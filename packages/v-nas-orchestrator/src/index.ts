import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import {promises as fs} from 'fs';
import {exec} from 'child_process';
import {promisify} from 'util';
import path from 'path';
import sodium from 'libsodium-wrappers';

import {computeDHSharedPassword, generateKeyPair, sign, verifySignature} from "./library/KeyLib.js";
import {app, getUser} from "./firebase/firebaseIntegration.js";
import {firebaseConfig} from "./firebase/firebaseConfig.js";
import {config} from "./EnvConfig.js";
import admin from "firebase-admin";
import {base36} from "multiformats/bases/base36";

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
            let {uid, authToken}: {
                uid: string,
                authToken: string
            } = req.body;
            // Wait for libsodium to initialize
            await sodium.ready;
            if (authToken !== config.KEY) {
                res.status(401).json({error: "Unauthorized"});
                return;
            }

            const userFolder = `${config.ROOT_USER_FOLDER}/${uid}`;
            const composeFolder = `${userFolder}`;
            const execAsync = promisify(exec);

            //on this host*
            await execAsync("docker compose down", {cwd: composeFolder});
            await new Promise((resolve) => setTimeout(resolve, 10000));
            await fs.rm(userFolder, {recursive: true, force: true});

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
            // Wait for libsodium to initialize
            await sodium.ready;
            if (authToken !== config.KEY) {
                res.status(401).json({error: "Unauthorized"});
                return;
            }

            const netName = 'vnas_' + uid;
            const userFolder = `${config.ROOT_USER_FOLDER}/${uid}`;
            const composeFolder = `${userFolder}`;

            // for the crypto part we will have to do some kind of user register on the provider side
            //let userRecord = axios.post(`${config.USER_BACKEND_URL}/user/create`, {email: `${name}@${domain}`, password: password});
            //const apiKeyPair = await generateKeyPair();
            const provider = `https://${domain},${uid},${signature}`;
            const execAsync = promisify(exec);

            //on this host*
            try {
                await execAsync("docker compose down", {cwd: composeFolder});
                await new Promise((resolve) => setTimeout(resolve, 5000));
                //use delete to remove user data
                //await fs.rm(userFolder, {recursive: true, force: true});
            } catch (err) {
                /* ignore */
            }
            await fs.mkdir(userFolder, {recursive: true});

            // Read the template compose file
            const templateContent = await fs.readFile('./template/compose-template.yml', 'utf-8');

            // Replace placeholders with actual values
            let updatedComposeContent = templateContent
                .replace(/%PROVIDER_STR%/g, provider)
                .replace(/%USER_DATA_FOLDER%/g, userFolder + "/root")
                .replace(/%NETWORK%/g, netName)
                .replace(/%DOMAIN%/g, `${name}.${domain}`);//ref domain for container

            // Write the updated compose file to the compose folder
            const composeFilePath = path.join(composeFolder, 'compose.yml');
            await fs.writeFile(composeFilePath, updatedComposeContent, 'utf-8');

            // Execute the Docker Compose command
            await execAsync("docker compose up -d", {cwd: composeFolder});

            res.json("done");

        } catch (e) {
            res.status(500).json({error: e});
        }
    });

    router.post('/setup-pswd', async (req, res) => {
        let {publicKey, signature, name, domain, uid, authToken}: {
            publicKey: string,
            signature: string,
            name: string,
            domain: string,
            uid: string,
            authToken: string
        } = req.body;
        // Wait for libsodium to initialize
        await sodium.ready;
        if (authToken !== config.KEY) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        const serverTempKeyPair = await generateKeyPair();
        const password = await computeDHSharedPassword(serverTempKeyPair.priv, publicKey);

        const netName = 'vnas_' + uid;
        const user = `${name}:${password}`;
        const userFolder = `${config.ROOT_USER_FOLDER}/${uid}`;
        const composeFolder = `${userFolder}`;

        // for the crypto part we will have to do some kind of user register on the provider side
        //let userRecord = axios.post(`${config.USER_BACKEND_URL}/user/create`, {email: `${name}@${domain}`, password: password});
        //const apiKeyPair = await generateKeyPair();
        const provider = `https://${domain},${uid},${signature}`;
        const execAsync = promisify(exec);

        //on this host*
        try {
            await execAsync("docker compose down", {cwd: composeFolder});
            await fs.rm(userFolder, {recursive: true, force: true});
        } catch (err) {
            /* ignore */
        }
        await fs.mkdir(userFolder, {recursive: true});

        // Read the template compose file
        const templateContent = await fs.readFile('./template/compose-template-pswd.yml', 'utf-8');

        // Replace placeholders with actual values
        let updatedComposeContent = templateContent
            .replace(/%PROVIDER_STR%/g, provider)
            .replace(/%USER_DATA_FOLDER%/g, userFolder + "/root")
            .replace(/%NETWORK%/g, netName)
            .replace(/%DOMAIN%/g, domain)
            .replace(/%USER%/g, user);

        // Write the updated compose file to the compose folder
        const composeFilePath = path.join(composeFolder, 'compose.yml');
        await fs.writeFile(composeFilePath, updatedComposeContent, 'utf-8');

        // Execute the Docker Compose command
        await execAsync("docker compose up -d", {cwd: composeFolder});

        // return server temp public key for user to get the password
        res.json({publicKey: serverTempKeyPair.pub});
        //
        //const password = await computeDHSharedPassword(keyPair.priv, axiosResponse.data.publicKey)
    });

    expressApp.use('/', router);
    console.log('Listening on ' + port);
});
