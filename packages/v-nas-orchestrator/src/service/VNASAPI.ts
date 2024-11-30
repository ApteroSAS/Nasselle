import express from "express";
import {config} from "../EnvConfig.js";
import {ScalewayInstanceOperations} from "../providers/scaleway/ScalewayInstanceOperations.js";
import {authenticate, AuthUserRequest} from "./ExpressAuthenticateMiddleWare.js";

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

  router.post("/setup", authenticate, async (req:AuthUserRequest, res) => {
    try {
      const uid  = req.user.uid;
      //TODO query the mesh router API to get name and domain for the user using the uid@nasselle.com

      if(!keypair) {
        const userDoc = await admin.firestore().collection('users').doc(uid).get();
        //TODO IDea Use metamask to store the keypair?
        const keyPair = await generateKeyPair();
        //TODO store the keypair in a locked database
        const data: UserFB = {
          pubkey: keyPair.pub,
          vnas: `setup-ok`,
        }
        // Store the public key in Firestore
        await admin.firestore().collection('users').doc(uid).update(data as any);
      }

      const signature = await sign(keyPair.priv, uid);
      console.log('Generated key pair and signature', keyPair, signature, uid);

      const result = await instanceOperations.setup({ signature, name, domain, uid });
      res.json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  });

  expressApp.use('/', router);
}