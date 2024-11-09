import cors from "cors";
import bodyParser from "body-parser";
import express from "express";

import { config } from "./EnvConfig.js";
import { ScalewayInstanceOperations } from "./providers/scaleway/ScalewayInstanceOperations.js";

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

    expressApp.use("/", router);
    console.log("Listening on " + port);
});
