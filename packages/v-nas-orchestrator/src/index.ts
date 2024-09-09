import cors from "cors";
import bodyParser from "body-parser";
import express from "express";

import {config} from "./EnvConfig.js";
import {createTmpDockerComposeFile} from "./DockerCopmposeLib.js";
import {
    actionOnInstance,
    createInstance, deleteInstance, executeCommand, runDockerComposeSetup
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
            const uid = req.body.uid;
            console.log(`Rebooting V-NAS with UID ${uid}`);
            await actionOnInstance(uid, 'reboot');
            await executeCommand(uid, 'docker-compose -p nasselle down');
            await executeCommand(uid, 'docker-compose -p nasselle up -d');
            await new Promise(resolve => setTimeout(resolve, 20000));
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
            let {signature, name, domain, uid}: {
                signature: string,
                name: string,
                domain: string,
                uid: string,
            } = req.body;
            console.log(`Rebooting V-NAS with UID ${uid}`);
            const composeLocalPath = await createTmpDockerComposeFile(domain, name, uid, signature);
            await runDockerComposeSetup(uid, composeLocalPath, '/compose.yml');//this do the update
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
            const uid = req.body.uid;
            console.log(`Deleting V-NAS with UID ${uid}`);
            await deleteInstance(uid);
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
            try {
                await deleteInstance(uid);//in case it already exists
            } catch (e) {
                /*ignore : will panic if nothing to delete*/
            }
            await createInstance(uid);
            await runDockerComposeSetup(uid, composeLocalPath, '/compose.yml');

            res.json("done");
        } catch (e) {
            console.log(e);
            res.status(500).json({error: e});
        }
    });

    expressApp.use('/', router);
    console.log('Listening on ' + port);
});
