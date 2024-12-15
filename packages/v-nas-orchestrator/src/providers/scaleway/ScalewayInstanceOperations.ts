import {createTmpDockerComposeFile} from "../../library/DockerComposeLib.js";
import {
  actionOnInstance, getInstance,
  createInstance,
  deleteInstance,
  executeCommand,
  runDockerComposeSetup,
} from "../../library/ScalewayLib.js";
import {InstanceOperations} from "../InstanceOperations.js";
import {getDomainControlKeyPair} from "../../service/KeyPairDataBase.js";
import {sign} from "../../library/KeyLib.js";
import {domainApiClient} from "../../service/DomainAPIClient.js";
import {addPermission, removePermission} from "../../library/Permission.js";

export class ScalewayInstanceOperations implements InstanceOperations {

  async setup(uid: string): Promise<string> {

    const keyPair = await getDomainControlKeyPair(uid);
    let signatureUid = `${uid}@nasselle.com`;
    const signature = await sign(keyPair.privkey, signatureUid);

    let domainData = await domainApiClient.getDomainInfo(signatureUid);

    if (!domainData.publicKey || keyPair.pubkey !== domainData.publicKey) {
      await domainApiClient.setDomainInfo(signatureUid, {
        domainName: domainData.domainName,
        publicKey: keyPair.pubkey,
        serverDomain: domainData.serverDomain
      });
      domainData = await domainApiClient.getDomainInfo(signatureUid);
      if (!domainData.publicKey || keyPair.pubkey !== domainData.publicKey) {
        throw new Error("Failed to update domain info");
      }
    }

    console.log(`Creating V-NAS for ${domainData.domainName}@${domainData.serverDomain} with uid ${uid} / ${signatureUid}`);
    const composeLocalPath = await createTmpDockerComposeFile(domainData.serverDomain, domainData.domainName, signatureUid, signature);
    try {
      await deleteInstance(uid); // in case it already exists
    } catch (e) {
      /*ignore: will panic if nothing to delete*/
    }
    let instance = await createInstance(uid);
    await runDockerComposeSetup(uid, composeLocalPath, '/compose.yml');
    await this.status(uid);
    return instance.id;
  }

  async delete(uid: string): Promise<string> {
    console.log(`Deleting V-NAS with UID ${uid}`);
    await deleteInstance(uid);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return "done";
  }

  async reboot(uid: string): Promise<string> {
    console.log(`Rebooting V-NAS with UID ${uid}`);
    await actionOnInstance(uid, 'reboot');
    await new Promise((resolve) => setTimeout(resolve, 20000));
    await executeCommand(uid, 'ping -c 4 google.com');
    return "done";
  }

  async status(uid: string): Promise<string> {
    console.log(`Checking integrity of V-NAS with UID ${uid}`);
    let instanceId = await getInstance(uid);
    if (instanceId) {
      return instanceId;
    } else {
      return null;
    }
  }
}
