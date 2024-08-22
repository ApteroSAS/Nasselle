import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
//import {version as BUILD_VERSION} from "../dockflow.json";
//console.log(BUILD_VERSION);

import {sign, verifySignature} from "./library/KeyLib.js";
import {getUser} from "./firebase/firebaseIntegration.js";
import {firebaseConfig} from "./firebase/firebaseConfig.js";

let expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(cors());


let port = 8192;
expressApp.listen(port, () => {
  let router = express.Router();
  router.get('/version', (req, res) => {
    res.json("1.0.0");
  });

  router.get('/config/firebase', (req, res) => {
    res.json(firebaseConfig);
  });

  router.post('/sign', (req, res) => {
    let {key, msg} = req.body;
    sign(key, msg).then((sig) => {
      res.json({sig});
    });
  });

  router.get('/verify/:userid/:sig', async (req, res) => {
    let {userid, sig} = req.params;
    try {
      const user = await getUser(userid);
      if (user) {
        let {pubkey} = user;
        const isValid = await verifySignature(pubkey, sig, userid)
        if (isValid) {
          res.json({
            serverDomain: user.serverDomain,
            domainName: user.domainName
          });
        } else {
          res.json("" + isValid);
        }
      } else {
        res.json({err: "unknown user"});
      }
    } catch (e) {
      res.json({err: e.toString()});
    }
  });
  expressApp.use('/', router);
  console.log('Listening on ' + port);
});
