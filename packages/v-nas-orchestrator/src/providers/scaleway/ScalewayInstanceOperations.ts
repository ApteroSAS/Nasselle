import { createTmpDockerComposeFile } from "../../library/DockerComposeLib.js";
import {
  actionOnInstance,
  createInstance,
  deleteInstance,
  executeCommand,
  runDockerComposeSetup,
} from "../../library/ScalewayLib.js";
import { InstanceOperations } from "../InstanceOperations.js";

export class ScalewayInstanceOperations implements InstanceOperations {

  async setup(data: { signature: string; name: string; domain: string; uid: string }): Promise<string> {
    const { signature, name, domain, uid } = data;
    console.log(`Creating V-NAS for ${name}@${domain} with uid ${uid}`);
    const composeLocalPath = await createTmpDockerComposeFile(domain, name, uid, signature);
    try {
      await deleteInstance(uid); // in case it already exists
    } catch (e) {
      /*ignore: will panic if nothing to delete*/
    }
    await createInstance(uid);
    await runDockerComposeSetup(uid, composeLocalPath, '/compose.yml');
    return "done";
  }

  async delete(uid: string): Promise<string> {
    console.log(`Deleting V-NAS with UID ${uid}`);
    await deleteInstance(uid);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return "done";
  }

  async update(data: { signature: string; name: string; domain: string; uid: string }): Promise<string> {
    const { signature, name, domain, uid } = data;
    console.log(`Updating V-NAS with UID ${uid}`);
    const composeLocalPath = await createTmpDockerComposeFile(domain, name, uid, signature);
    await runDockerComposeSetup(uid, composeLocalPath, '/compose.yml'); // this does the update
    return "done";
  }

  async reboot(uid: string): Promise<string> {
    console.log(`Rebooting V-NAS with UID ${uid}`);
    await actionOnInstance(uid, 'reboot');
    await new Promise((resolve) => setTimeout(resolve, 20000));
    await executeCommand(uid, 'ping -c 4 google.com');
    return "done";
  }
}