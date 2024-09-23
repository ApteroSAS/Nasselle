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

export async function deleteInstance(uid: string): Promise<void> {
    //try {
        const instances = await getInstanceByUID(uid);
        for (const instance of instances) {
            await actionOnInstanceBySid(instance.id, "terminate");
            // await deleteInstanceBySid(instance.id);
        }
    /*}catch (e) {
        console.error(e);//just log the error
    }*/
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
    const instances = await getInstanceByUID(uid);
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

// Helper function to create a temporary Docker Compose file

async function sshConnect(uid: string): Promise<NodeSSH> {
    const instances = await getInstanceByUID(uid);
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

async function deleteInstanceBySid(serverId: string): Promise<void> {
    try {
        // Perform DELETE request to delete the instance
        await axios.delete(
            `${config.SCW_API_URL}/instance/v1/zones/${config.SCW_ZONE}/servers/${serverId}`,
            {
                headers: {
                    'X-Auth-Token': config.SCW_SECRET_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`Instance with Server ID ${serverId} deleted successfully.`);
    } catch (error) {
        console.error(`Failed to delete instance with Server ID ${serverId}:`, error);
        throw new Error(`Error deleting instance with Server ID ${serverId}`);
    }
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

async function getInstanceByUID(uid: string):Promise<Instance[]> {
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
        throw new Error(`No instances found with name filter "${uid}"`);
    }

    // Find the exact instance by checking the UID if necessary
    const instance = instances.find((server: any) => server.name === servername(uid));

    if (!instance) {
        throw new Error(`Instance with UID ${uid} not found`);
    }

    //filter out the instances with state_detail: 'terminating' || 'terminated' or  state: 'deleted'
    instances = instances.filter((server: any) =>
      server.state_detail !== 'terminating' &&
      server.state_detail !== 'terminated' &&
      server.state !== 'deleted' &&
      server.state !== 'stopping' &&
      server.state !== 'stopped in place' &&
      server.state !== 'stopped' &&
      server.state !== 'locked'
    );
    return instances;
}