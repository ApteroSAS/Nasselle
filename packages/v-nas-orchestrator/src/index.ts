import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import sodium from 'libsodium-wrappers';

import {generateKeyPair, sign, verifySignature} from "./library/KeyLib.js";
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

  router.post('/setup', async (req, res) => {
    let {publicKey,signature, name, domain,uid,authToken}:{
      publicKey:string,
      signature:string,
        name:string,
        domain:string,
        uid:string,
        authToken:string
    } = req.body;
    // Wait for libsodium to initialize
    await sodium.ready;
    if(authToken !== config.KEY){
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    const masterPublicKey = base36.decode(publicKey);
    const serverTempKeyPair = sodium.crypto_kx_keypair();
    const dhPublicKey = sodium.crypto_sign_ed25519_pk_to_curve25519(masterPublicKey);
    const password = base36.encode(sodium.crypto_scalarmult(serverTempKeyPair.privateKey, dhPublicKey));

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
    await fs.mkdir(userFolder, { recursive: true });

    // Read the template compose file
    const templateContent = await fs.readFile('./template/compose-template.yml', 'utf-8');

    // Replace placeholders with actual values
    let updatedComposeContent = templateContent
        .replace(/%PROVIDER_STR%/g, provider)
        .replace(/%USER_DATA_FOLDER%/g, "./root")
        .replace(/%NETWORK%/g, netName)
        .replace(/%DOMAIN%/g, domain)
        .replace(/%USER%/g, user);

    // Write the updated compose file to the compose folder
    const composeFilePath = path.join(composeFolder, 'compose.yml');
    await fs.writeFile(composeFilePath, updatedComposeContent, 'utf-8');

    // Execute the Docker Compose command
    await execAsync("docker compose up -d", { cwd: composeFolder });

    // return server temp public key for user to get the password
    res.json({dhPublicKey: base36.encode(serverTempKeyPair.publicKey)});
  });

  expressApp.use('/', router);
  console.log('Listening on ' + port);
});
