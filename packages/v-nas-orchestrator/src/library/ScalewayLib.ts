import axios from 'axios';
import {config} from "../EnvConfig.js";
import {NodeSSH} from "node-ssh";
import {Instance} from "../providers/scaleway/ScalewayInterface.js";

export async function createInstance(uid: string): Promise<Instance> {
    // Create an instance and attach the reserved flexible IP
    const response = await axios.post(
        `${config.SCW_API_URL}/instance/v1/zones/${config.SCW_ZONE}/servers`,
        {
            name: servername(uid),
            project: config.SCW_DEFAULT_PROJECT_ID,
            commercial_type: config.SCW_INSTANCE,
            image: config.SCW_IMAGE,
            dynamic_ip_required: false,
        },
        {
            headers: {
                'X-Auth-Token': config.SCW_SECRET_KEY,
                'Content-Type': 'application/json'
            }
        }
    );

    let instance = response.data.server;
    await reserveFlexibleIP(instance.id);//add ip

    await actionOnInstanceBySid(instance.id, 'poweron');
    instance = await getInstanceDetails(instance.id);
    console.log('Created Instance:', instance);
    return instance;
}

async function deleteFlexibleIP(ipId: string): Promise<void> {
    await axios.delete(
      `${config.SCW_API_URL}/instance/v1/zones/${config.SCW_ZONE}/ips/${ipId}`,
      {
          headers: {
              'X-Auth-Token': config.SCW_SECRET_KEY,
              'Content-Type': 'application/json'
          }
      }
    );
}

async function deleteVolume(volumeId: string): Promise<void> {
    await axios.delete(
      `${config.SCW_API_URL}/instance/v1/zones/${config.SCW_ZONE}/volumes/${volumeId}`,
      {
          headers: {
              'X-Auth-Token': config.SCW_SECRET_KEY,
              'Content-Type': 'application/json'
          }
      }
    );
}

async function getInstanceIPs(instanceId: string): Promise<string[]> {
    const response = await axios.get(
      `${config.SCW_API_URL}/instance/v1/zones/${config.SCW_ZONE}/ips`,
      {
          headers: {
              'X-Auth-Token': config.SCW_SECRET_KEY,
              'Content-Type': 'application/json'
          },
          params: {
              server: instanceId
          }
      }
    );
    return response.data.ips.map((ip: any) => ip.id);
}

export async function deleteInstance(uid: string): Promise<void> {
    const instances = await getInstances(uid, false); // Get all instances including terminated ones

    for (const instance of instances) {
        try {
            // Step 1: Get and delete all attached IPs
            const ipIds = await getInstanceIPs(instance.id);
            for (const ipId of ipIds) {
                await deleteFlexibleIP(ipId);
                console.log(`Deleted IP ${ipId} for instance ${instance.id}`);
            }

            // Step 2: Delete all attached volumes
            const volumes = Object.values(instance.volumes || {});
            for (const volume of volumes) {
                // Wait for instance to be fully terminated before deleting volumes
                await actionOnInstanceBySid(instance.id, "terminate");
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

                try {
                    await deleteVolume(volume.id);
                    console.log(`Deleted volume ${volume.id} for instance ${instance.id}`);
                } catch (error: any) {
                    if (error.response?.status === 404) {
                        console.log(`Volume ${volume.id} already deleted`);
                    } else {
                        throw error;
                    }
                }
            }

            console.log(`Successfully cleaned up instance ${instance.id}`);
        } catch (error) {
            console.error(`Error cleaning up instance ${instance.id}:`, error);
            throw error;
        }
    }
}

export async function executeCommand(uid: string, command: string): Promise<void> {
    const ssh = await sshConnect(uid);
    try {
        let result = await ssh.execCommand(command);
        if (result.code !== 0) {
            throw new Error(`stderr: ${result.stderr}`);
        }
    } catch (error) {
        throw error;
    } finally {
        if(ssh) {
            ssh.dispose(); // Always close the connection
        }
    }
}

export async function actionOnInstance(uid: string, action: 'poweron' | 'poweroff' | 'reboot' | 'terminate'): Promise<void> {
    const instances = await getInstances(uid);
    if (instances.length !== 1) {
        console.error(instances);
        throw new Error(`Expected 1 instance but got ${instances.length}`);
    }
    await actionOnInstanceBySid(instances[0].id, action);
}

export async function runDockerComposeSetup(uid: string, localComposePath: string, remoteComposePath: string) {
    const ssh = await sshConnect(uid);
    try {
        // Use putFile to copy the file from local to remote
        await ssh.putFile(localComposePath, remoteComposePath);
        console.log('compose file send!');

        let result = await ssh.execCommand(`docker compose -f ${remoteComposePath} -p nasselle pull`);
        if (result.code !== 0) {
            throw new Error(`stderr: ${result.stderr}`);
        }
        console.log('compose pull done!');
        result = await ssh.execCommand(`docker compose -f ${remoteComposePath} -p nasselle up -d`);
        if (result.code !== 0) {
            throw new Error(`stderr: ${result.stderr}`);
        }
        console.log('compose up done!');
    } catch (error) {
        throw error;
    } finally {
        if(ssh) {
            ssh.dispose(); // Always close the connection
        }
    }
}

export async function getInstances(uid: string,filtered:boolean = true):Promise<Instance[]> {
    // Fetch instances filtered by name using the UID (assuming the UID is part of the instance name)
    const response = await axios.get(
      `${config.SCW_API_URL}/instance/v1/zones/${config.SCW_ZONE}/servers?name=${servername(uid)}`,
      {
          headers: {
              'X-Auth-Token': config.SCW_SECRET_KEY,
              'Content-Type': 'application/json'
          }
      }
    );

    let instances = response.data.servers;

    // If no instances are found
    if (instances.length === 0) {
        return [];
    }

    // Find the exact instance by checking the UID if necessary
    const instance = instances.find((server: any) => server.name === servername(uid));

    if (!instance) {
        throw new Error(`Instance with UID ${uid} not found`);
    }

    //filter out the instances with state_detail: 'terminating' || 'terminated' or  state: 'deleted'
    if(filtered) {
        instances = instances.filter((server: any) =>
          server.state_detail !== 'terminating' &&
          server.state_detail !== 'terminated' &&
          server.state !== 'deleted' &&
          server.state !== 'stopping' &&
          server.state !== 'stopped in place' &&
          server.state !== 'stopped' &&
          server.state !== 'locked'
        );
    }
    return instances;
}

// Helper function to create a temporary Docker Compose file
//@deprecated will use ssh fom the browser for end to end control of the VM
async function sshConnect(uid: string): Promise<NodeSSH> {
    const instances = await getInstances(uid);
    try {
        if (instances.length !== 1) {
            throw new Error(`Expected 1 instance but got ${instances.length}`);
        }
        const instanceIp = instances[0].public_ip.address;
        const ssh = new NodeSSH();
        const retries = 10;
        for (let attempt = 1; attempt <= retries; attempt++) {
            let delay = 1000 * attempt;
            try {
                await ssh.connect({
                    host: instanceIp,
                    username: 'root',
                    privateKey: config.SSH_KEY,
                });
            } catch (error) {
                if (attempt === retries) {
                    throw error; // Rethrow the error if it's the last attempt
                }
                console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay)); // Wait before retrying
            }
        }
        return ssh;
    }catch (error){
        console.error("instances :", instances);
        throw error;
    }
}

function servername(uid: string): string {
    return `nasselle-v-nas-${uid}`;
}

async function getInstanceDetails(instanceId: string):Promise<Instance> {
    const response = await axios.get(
        `${config.SCW_API_URL}/instance/v1/zones/${config.SCW_ZONE}/servers/${instanceId}`,
        {
            headers: {
                'X-Auth-Token': config.SCW_SECRET_KEY,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data.server;
}

async function actionOnInstanceBySid(instanceId: string, action: 'poweron' | 'poweroff' | 'reboot' | 'terminate'): Promise<void> {
    await axios.post(
        `${config.SCW_API_URL}/instance/v1/zones/${config.SCW_ZONE}/servers/${instanceId}/action`, {action,},
        {
            headers: {
                'X-Auth-Token': config.SCW_SECRET_KEY,
                'Content-Type': 'application/json'
            }
        }
    );
}

async function reserveFlexibleIP(server_uuid: string): Promise<string> {
    const response = await axios.post(
        `${config.SCW_API_URL}/instance/v1/zones/${config.SCW_ZONE}/ips`,
        {
            project: config.SCW_DEFAULT_PROJECT_ID,
            //type: 'routed_ipv6',
            type: 'routed_ipv4',
            server: server_uuid,
        },
        {
            headers: {
                'X-Auth-Token': config.SCW_SECRET_KEY,
                'Content-Type': 'application/json',
            },
        }
    );

    const ip = response.data.ip;
    return ip.id;
}