import cors from "cors";
import bodyParser from "body-parser";
import express from "express";

import { ScalewayInstanceOperations } from "./providers/scaleway/ScalewayInstanceOperations.js";
import {vnasAPI} from "./service/VNASAPI.js";
import {initializeFb} from "./firebase/firebaseIntegration.js";
import {sendEmail} from "./library/Sendgrid.js";
import {config} from "./EnvConfig.js";

const expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(cors());

const instanceOperations = new ScalewayInstanceOperations();

let port = 8194;
expressApp.listen(port, async() => {

    initializeFb();

    let router = express.Router();
    router.get("/version", (req, res) => {
        res.json("1.0.0");
    });
    expressApp.use("/", router);

    vnasAPI(expressApp,instanceOperations);

    // send a mail to admin to notify that the service is working and hav been created
    if(config.SENDMAIL_FROM_EMAIL && process.env.PROD){
        await sendEmail({
            to: config.SENDMAIL_FROM_EMAIL,
            subject: `V-NAS Orchestrator Service started`,
            text: `The service has been started and is working as expected.`,
        })
    }

    console.log("Listening on " + port);
});
