import axios from 'axios';
import {config} from "./EnvConfig.js";
import {NodeSSH} from "node-ssh";

async function getInstanceDetails(instanceId: string) {
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


async function powerOnInstance(instanceId: string) {
    await axios.post(
        `${config.SCW_API_URL}/instance/v1/zones/${config.SCW_ZONE}/servers/${instanceId}/action`,
        {
            action: 'poweron',
        },
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

export async function createInstance(uid: string): Promise<any> {
    // Create an instance and attach the reserved flexible IP
    const response = await axios.post(
        `${config.SCW_API_URL}/instance/v1/zones/${config.SCW_ZONE}/servers`,
        {
            name: `nasselle-v-nas-${uid}`,
            project: config.SCW_DEFAULT_PROJECT_ID,
            commercial_type: config.SCW_INSTANCE,
            image: config.SCW_IMAGE,
            //enable_ipv6: true
        },
        {
            headers: {
                'X-Auth-Token': config.SCW_SECRET_KEY,
                'Content-Type': 'application/json'
            }
        }
    );

    let instance = response.data.server;
    await reserveFlexibleIP(instance.id);

    await powerOnInstance(instance.id);
    instance = await getInstanceDetails(instance.id);
    //console.log('Instance:', instance);
    return instance;
}

export async function runDockerCompose(instanceIp: string, localComposePath: string, remoteComposePath: string) {
    const ssh = new NodeSSH();
    try {
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
        // Use putFile to copy the file from local to remote
        await ssh.putFile(localComposePath, remoteComposePath);
        console.log('compose file send!');

        let result = await ssh.execCommand(`docker compose -f ${remoteComposePath} -p nasselle up -d`);
        if (result.code !== 0) {
            throw new Error(`stderr: ${result.stderr}`);
        }
    } catch (error) {
        throw error;
    } finally {
        ssh.dispose(); // Always close the connection
    }
}