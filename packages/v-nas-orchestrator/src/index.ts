import cors from "cors";
import bodyParser from "body-parser";
import express from "express";

import {config} from "./EnvConfig.js";
import {createTmpDockerComposeFile} from "./DockerCopmposeLib.js";
import {
    actionOnInstance,
    createInstance,
    deleteInstance,
    executeCommand,
    getInstanceByUID,
    runDockerCompose
} from "./ScalewayLib.js";
let expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(cors());


let port = 8194;
expressApp.listen(port, () => {
    let router = express.Router();
    router.get('/version', (req, res) => {
        res.json("1.0.0");
    });

    router.post('/reboot', async (req, res) => {
        try {
            if (req.body.authToken !== config.KEY) {
                res.status(401).json({error: "Unauthorized"});
                return;
            }
            console.log(`Rebooting V-NAS with UID ${req.body.uid}`);
            const instance = await getInstanceByUID(req.body.uid);
            await actionOnInstance(instance.id, 'reboot');
            res.json("done");
        } catch (e) {
            console.log(e);
            res.status(500).json({error: e});
        }
    });

    router.post('/update', async (req, res) => {
        try {
            if (req.body.authToken !== config.KEY) {
                res.status(401).json({error: "Unauthorized"});
                return;
            }
            console.log(`Rebooting V-NAS with UID ${req.body.uid}`);
            const instance = await getInstanceByUID(req.body.uid);
            const ip = instance.public_ip.address;
            await executeCommand(ip, 'docker-compose -f /compose.yml pull');
            await executeCommand(ip, 'docker-compose -f /compose.yml up -d');
            res.json("done");
        } catch (e) {
            console.log(e);
            res.status(500).json({error: e});
        }
    });

    router.post('/delete', async (req, res) => {
        try {
            if (req.body.authToken !== config.KEY) {
                res.status(401).json({error: "Unauthorized"});
                return;
            }
            console.log(`Deleting V-NAS with UID ${req.body.uid}`);
            const instance = await getInstanceByUID(req.body.uid);
            await actionOnInstance(instance.id, 'terminate');
            await new Promise(resolve => setTimeout(resolve, 5000));
            res.json("done");
        } catch (e) {
            console.log(e);
            res.status(500).json({error: e});
        }
    });

    router.post('/setup', async (req, res) => {
        try {
            if (req.body.authToken !== config.KEY) {
                res.status(401).json({error: "Unauthorized"});
                return;
            }
            let {signature, name, domain, uid}: {
                signature: string,
                name: string,
                domain: string,
                uid: string,
            } = req.body;
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
