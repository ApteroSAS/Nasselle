import cors from "cors";
import bodyParser from "body-parser";
import express from "express";

import { config } from "./EnvConfig.js";
import { ScalewayInstanceOperations } from "./providers/scaleway/ScalewayInstanceOperations.js";
import {createBucket, createKey} from "./library/BackblazeLib.js";

const expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(cors());

const instanceOperations = new ScalewayInstanceOperations();

let port = 8194;
expressApp.listen(port, () => {
    let router = express.Router();
    router.get("/version", (req, res) => {
        res.json("1.0.0");
    });

    router.post("/reboot", async (req, res) => {
        try {
            if (req.body.authToken !== config.KEY) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const uid = req.body.uid;
            const result = await instanceOperations.reboot(uid);
            res.json(result);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: e });
        }
    });

    router.post("/update", async (req, res) => {
        try {
            if (req.body.authToken !== config.KEY) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const { signature, name, domain, uid } = req.body;
            const result = await instanceOperations.update({ signature, name, domain, uid });
            res.json(result);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: e });
        }
    });

    router.post("/delete", async (req, res) => {
        try {
            if (req.body.authToken !== config.KEY) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const uid = req.body.uid;
            const result = await instanceOperations.delete(uid);
            res.json(result);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: e });
        }
    });

    router.post("/setup", async (req, res) => {
        try {
            if (req.body.authToken !== config.KEY) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const { signature, name, domain, uid } = req.body;
            const result = await instanceOperations.setup({ signature, name, domain, uid });
            res.json(result);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: e });
        }
    });

    router.get("/b2_test", async (req, res) => {
        console.log("b2_test");
        // Main function to run the steps
        try {
            // Step 1: Create a new bucket
            /*const bucketName = 'nsl-ad26qsd4f45qs622';
            const bucket = await createBucket(bucketName);
            console.log('Bucket created:', bucket);*/

            // Step 2: Create a key to access the bucket
            /*const bucket = {bucketId: '44240008df891d9797250f1b'};
            const key = await createKey(bucket.bucketId);
            console.log('Key created:', key.keyId, key.applicationKey);*/
        } catch (error) {
            console.error('Error in process:', error.message);
        }
    });

    expressApp.use("/", router);
    console.log("Listening on " + port);
});
