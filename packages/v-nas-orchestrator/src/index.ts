import cors from "cors";
import bodyParser from "body-parser";
import express from "express";

import {config} from "./EnvConfig.js";
import {createTmpDockerComposeFile} from "./DockerCopmposeLib.js";
import {createInstance, runDockerCompose} from "./ScalewayLib.js";
let expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(cors());

let port = 8194;
expressApp.listen(port, () => {
    let router = express.Router();
    router.get('/version', (req, res) => {
        res.json("1.0.0");
    });


    router.post('/delete', async (req, res) => {
        try {
            //TODO
            res.json("done");
        } catch (e) {
            res.status(500).json({error: e});
        }
    });

    router.post('/setup', async (req, res) => {
        try {
            let {signature, name, domain, uid, authToken}: {
                signature: string,
                name: string,
                domain: string,
                uid: string,
                authToken: string
            } = req.body;
            if (authToken !== config.KEY) {
                res.status(401).json({error: "Unauthorized"});
                return;
            }
            console.log(`Creating V-NAS for ${name}@${domain} with uid ${uid}`);
            const composeLocalPath = await createTmpDockerComposeFile(domain, name, uid, signature);
            const instance = await createInstance(uid);
            const ip = instance.public_ip.address;
            await runDockerCompose(ip,composeLocalPath, '/compose.yml');

            res.json("done");
        } catch (e) {
            console.log(e);
            res.status(500).json({error: e});
        }
    });

    expressApp.use('/', router);
    console.log('Listening on ' + port);
});
