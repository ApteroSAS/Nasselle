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
      //TODO read the signature name and domain from the database
      //TODO read uid from auth request
      //TODO generate domain private key where di i do that before?
      const { signature, name, domain } = req.body;
      const result = await instanceOperations.setup({ signature, name, domain, uid });
      res.json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  });

  expressApp.use('/', router);
}