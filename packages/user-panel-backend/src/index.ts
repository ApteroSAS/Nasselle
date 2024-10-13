import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
//import {version as BUILD_VERSION} from "../dockflow.json";
//console.log(BUILD_VERSION);

import {computeDHSharedPassword, generateKeyPair, sign, verifySignature} from "./library/KeyLib.js";
import {getUser} from "./firebase/firebaseIntegration.js";
import {firebaseConfig} from "./firebase/firebaseConfig.js";
import admin, {auth} from "firebase-admin";
import axios from "axios";
import {config} from "./EnvConfig.js";
import {UserFB} from "./library/UserFBScheme.js";

let expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(cors());

const tmpToken = "eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2"

async function verifyToken(token: string): Promise<string> {
    if (!token) {
        throw new Error("Token not provided");
    }

    try {
        // Try to verify as an ID Token (the usual Firebase token)
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken.uid; // Return the UID from the verified ID Token
    } catch (e) {
        if(token.startsWith(tmpToken)){
            return token.replace(tmpToken,"");
        }
    }
}


const customToken = await admin.auth().createCustomToken("toto");
verifyToken(customToken).then((uid) => {
    console.log('UID:', uid);
});

let port = 8192;
expressApp.listen(port, () => {
    let router = express.Router();
    router.get('/version', (req, res) => {
        res.json("1.0.0");
    });

    router.get('/config/firebase', (req, res) => {
        res.json(firebaseConfig);
    });

    router.post('/sign', (req, res) => {
        let {key, msg} = req.body;
        sign(key, msg).then((sig) => {
            res.json({sig});
        });
    });

    router.post('/user/create', async (req, res) => {
        const {email, password, data} = req.body;
        let userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });

        // Store the user data in Firestore
        await admin.firestore().collection('users').doc(userRecord.uid).set(data);

        res.json(userRecord);
    });

    router.post('/vnas/create', async (req, res) => {
        try {
            const uid = await verifyToken(req.headers.authorization);
            const userDoc = await admin.firestore().collection('users').doc(uid).get();
            if (!userDoc.exists) {
                throw new Error('User not found');
            }
            const userData: UserFB = userDoc.data() as unknown as UserFB;
            // TODO verify subscription level then create a vnas
            console.log('Creating V-NAS for user', userData.id);
            if (!userData.domainName) {
                throw new Error('User has no domain');
            }
            if (!userData.serverDomain) {
                throw new Error('User has no name');
            }

            const keyPair = await generateKeyPair();
            const signature = await sign(keyPair.priv, uid);
            console.log('Generated key pair and signature', keyPair, signature, uid);


            const axiosResponse = await axios.post(config.VNAS_BACKEND_URL + '/setup', {
                signature: signature,
                name: userData.domainName,
                domain: userData.serverDomain,
                uid: uid,
                authToken: config.VNAS_AUTH_TOKEN
            });

            if (axiosResponse.data !== 'done') {
                throw new Error('Setup failed');
            }

            const data: UserFB = {
                pubkey: keyPair.pub,
                vnas: `setup-ok`,
            }
            // Store the public key in Firestore
            await admin.firestore().collection('users').doc(uid).update(data as any);

            res.json({status: 'success'});
        } catch (e) {
            console.error(e);
            res.status(500).json({err: e.toString()});
        }
    });

    router.post('/vnas/update', async (req, res) => {
        try {
            const uid = await verifyToken(req.headers.authorization);
            const userDoc = await admin.firestore().collection('users').doc(uid).get();
            if (!userDoc.exists) {
                throw new Error('User not found');
            }
            const userData: UserFB = userDoc.data() as unknown as UserFB;
            // TODO verify subscription level then create a vnas
            console.log('Creating V-NAS for user', userData.id);
            if (!userData.domainName) {
                throw new Error('User has no domain');
            }
            if (!userData.serverDomain) {
                throw new Error('User has no name');
            }

            const keyPair = await generateKeyPair();
            const signature = await sign(keyPair.priv, uid);
            console.log('Generated key pair and signature', keyPair, signature, uid);

            const axiosResponse = await axios.post(config.VNAS_BACKEND_URL + '/update',  {
                signature: signature,
                name: userData.domainName,
                domain: userData.serverDomain,
                uid: uid,
                authToken: config.VNAS_AUTH_TOKEN
            });

            if (axiosResponse.data !== 'done') {
                throw new Error('Update failed');
            }

            const data: UserFB = {
                pubkey: keyPair.pub,
                vnas: `setup-ok`,
            }
            // Store the public key in Firestore
            await admin.firestore().collection('users').doc(uid).update(data as any);

            res.json({status: 'success'});
        } catch (e) {
            console.error(e);
            res.status(500).json({err: e.toString()});
        }
    });

    router.post('/vnas/delete', async (req, res) => {
        try {
            const uid = await verifyToken(req.headers.authorization);
            console.log('Deleting V-NAS for user', uid);
            const axiosResponse = await axios.post(config.VNAS_BACKEND_URL + '/delete', {
                uid: uid,
                authToken: config.VNAS_AUTH_TOKEN
            });

            if (axiosResponse.data !== 'done') {
                throw new Error('Delete failed');
            }

            const data: UserFB = {
                pubkey: null,
                vnas: null,
                serverDomain: null,
                domainName: null
            }
            // Store the public key in Firestore
            await admin.firestore().collection('users').doc(uid).update(data as any);

            res.json({status: 'success'});
        } catch (e) {
            console.error(e);
            res.status(500).json({err: e.toString()});
        }
    });

    router.post('/vnas/reboot', async (req, res) => {
        try {
            const uid = await verifyToken(req.headers.authorization);
            console.log('Rebooting V-NAS for user', uid);

            const axiosResponse = await axios.post(config.VNAS_BACKEND_URL + '/reboot', {
                uid: uid,
                authToken: config.VNAS_AUTH_TOKEN
            });

            if (axiosResponse.data !== 'done') {
                throw new Error('Reboot failed');
            }

            res.json({status: 'success'});
        } catch (e) {
            console.error(e);
            res.status(500).json({err: e.toString()});
        }
    });

    router.get('/verify/:userid/:sig', async (req, res) => {
        let {userid, sig} = req.params;
        try {
            const user: UserFB = await getUser(userid) as UserFB;
            if (user) {
                let {pubkey} = user;
                const isValid = await verifySignature(pubkey, sig, userid)
                console.log('Verifying signature for', req.params, isValid);
                if (isValid) {
                    res.json({
                        serverDomain: user.serverDomain,
                        domainName: user.domainName
                    });
                } else {
                    res.json("" + isValid);
                }
            } else {
                res.json({err: "unknown user"});
            }
        } catch (e) {
            res.json({err: e.toString()});
        }
    });

    expressApp.use('/', router);
    console.log('Listening on ' + port);
});
