import express from "express";
import {config} from "../EnvConfig.js";
import {ScalewayInstanceOperations} from "../providers/scaleway/ScalewayInstanceOperations.js";
import {authenticate, AuthUserRequest} from "./ExpressAuthenticateMiddleWare.js";
import {getDomainControlKeyPair} from "./KeyPairService.js";
import {sign} from "../library/KeyLib.js";
import {domainApiClient} from "./DomainAPIClient.js";

export function vnasAPI(expressApp: express.Application,instanceOperations:ScalewayInstanceOperations) {
  let router = express.Router();

  router.post("/reboot", authenticate, async (req:AuthUserRequest, res) => {
    try {
      const uid  = req.user.uid;
      const result = await instanceOperations.reboot(uid);
      res.json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  });

  router.post("/update", authenticate, async (req:AuthUserRequest, res) => {
    try {
      const uid  = req.user.uid;
      //TODO read the signature name and domain from the database
      //TODO read uid from auth request
      const { signature, name, domain } = req.body;
      const result = await instanceOperations.update({ signature, name, domain, uid });
      res.json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  });

  router.post("/delete", authenticate, async (req:AuthUserRequest, res) => {
    try {
      const uid  = req.user.uid;
      const result = await instanceOperations.delete(uid);
      res.json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  });

  router.post("/create", authenticate, async (req:AuthUserRequest, res) => {
    try {
      const uid  = req.user.uid;
      const keyPair = await getDomainControlKeyPair(uid);
      const signature = await sign(keyPair.privkey, uid);
      let nsluid = `${uid}@nasselle.com`;

      let domainData = await domainApiClient.getDomainInfo(nsluid);

      if(!domainData.publicKey ||keyPair.pubkey !== domainData.publicKey) {
        await domainApiClient.setDomainInfo(nsluid,{
          domainName:domainData.domainName,
          publicKey:keyPair.pubkey,
          serverDomain:domainData.serverDomain
        });
        domainData = await domainApiClient.getDomainInfo(nsluid);
        if(!domainData.publicKey || keyPair.pubkey !== domainData.publicKey) {
          throw new Error("Failed to update domain info");
        }
      }

      const result = await instanceOperations.setup({ signature, name:domainData.domainName, domain:domainData.serverDomain, uid });
      res.json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  });

  expressApp.use('/vnas/', router);
}