import cors from "cors";
import bodyParser from "body-parser";
import express from "express";

import { ScalewayInstanceOperations } from "./providers/scaleway/ScalewayInstanceOperations.js";
import {vnasAPI} from "./service/VNASAPI.js";
import {initializeFb} from "./firebase/firebaseIntegration.js";

const expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(cors());

const instanceOperations = new ScalewayInstanceOperations();

let port = 8194;
expressApp.listen(port, () => {

    initializeFb();

    let router = express.Router();
    router.get("/version", (req, res) => {
        res.json("1.0.0");
    });
    expressApp.use("/", router);

    vnasAPI(expressApp,instanceOperations);

    console.log("Listening on " + port);
});
