import cors from "cors";
import bodyParser from "body-parser";
import express from "express";

import {initializeFb} from "./firebase/firebaseIntegration.js";
import {routerAPI} from "./services/RouterAPI.js";

import 'dotenv/config';

let expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(cors());

let port = 8192;
expressApp.listen(port, () => {
    initializeFb();
    let router = express.Router();

    routerAPI(expressApp);

    expressApp.use('/', router);
    console.log('Listening on ' + port);
});
