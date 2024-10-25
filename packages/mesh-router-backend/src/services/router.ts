import express from "express";
import admin from "firebase-admin";
import {sign, verifySignature} from "../library/KeyLib.js";
import {getFbDoc} from "../firebase/firebaseIntegration.js";
import {NSLRouterData} from "../DataBaseDTO/DataBaseNSLRouter.js";
import {authenticate, AuthUserRequest} from "../firebase/ExpressAuthenticateMiddleWare.js";

/*
full domain = domainName+"."+serverDomain
model
nsl-router/%uid%
- domainName:string // eg foo
- serverDomain:string //always nsl.sh
- publicKey:string
*/

const NSL_ROUTER_COLLECTION = "nsl-router";

/**
 * Checks the availability of a given domain name.
 * @param domain - The domain name to check.
 * @returns A promise that resolves to true if available, false otherwise.
 */
async function checkAvailability(domain: string): Promise<boolean> {
  if (!domain) {
    throw new Error("Domain name is required for availability check.");
  }

  const nslRouterCollection = admin.firestore().collection(NSL_ROUTER_COLLECTION);
  const querySnapshot = await nslRouterCollection.where('domainName', '==', domain).get();

  return querySnapshot.empty;
}

export function routerAPI(expressApp: express.Application) {
  let router = express.Router();

  //TODO remove this
  router.get('/test',authenticate,(req:AuthUserRequest, res) => {
    req.user ? res.json({user: req.user}) : res.json({error: "no user"});
  });

  /**
   * GET /available/:domain
   * Checks if a domain name is available.
   */
  router.get('/available/:domain', async (req, res) => {
    try {
      const domain = req.params.domain.trim(); // Extract and trim domain from the route parameter

      // Validate that the domain is provided
      if (!domain) {
        return res.status(400).json({ error: "Domain name is required." });
      }

      // Use the checkAvailability function
      const isAvailable = await checkAvailability(domain);

      if (isAvailable) {
        return res.status(200).json({ available:true, message: "Domain name is available." });
      } else {
        return res.status(409).json({ error: "Domain name is already in use." });
      }
    } catch (e) {
      console.error("Error in /available/:domain:", e);
      return res.status(500).json({ error: e.toString() });
    }
  });

  router.post('/sign', (req, res) => {
    let {key, msg} = req.body;
    sign(key, msg).then((sig) => {
      res.json({sig});
    });
  });

  //used by mesh router
  router.get('/verify/:userid/:sig', async (req, res) => {
    let {userid, sig} = req.params;
    try {
      const db = admin.firestore();
      const usersRef = db.collection(NSL_ROUTER_COLLECTION);
      const document = await usersRef.doc(userid).get();
      const user = document.data() as NSLRouterData;

      if (user) {
        let {publicKey} = user;
        const isValid = await verifySignature(publicKey, sig, userid)
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

  /**
   * GET /domain/:userid
   * Retrieves the domain information for the specified user.
   */
  router.get('/domain/:userid', async (req, res) => {
    const { userid } = req.params;

    try {
      if (!userid) {
        return res.status(400).json({ error: "User ID is required." });
      }

      const userDoc = await admin.firestore().collection(NSL_ROUTER_COLLECTION).doc(userid).get();

      if (!userDoc.exists) {
        return res.status(280).json({ error: "User not found." });
      }

      const userData = userDoc.data() as NSLRouterData;

      return res.status(200).json({
        domainName: userData.domainName,
        serverDomain: userData.serverDomain,
        publicKey: userData.publicKey
      });
    } catch (error) {
      console.error(error.toString());
      return res.status(500).json({ error: error.toString() });
    }
  });

  /**
   * POST /domain/:userid
   * Updates or sets the domain information for the specified user.
   * Requires authentication.
   */
  router.post('/domain/:userid', authenticate, async (req: AuthUserRequest, res) => {
    const { userid } = req.params;
    const { domainName, serverDomain = "nsl.sh", publicKey } = req.body;

    try {
      // Ensure that the authenticated user matches the userid parameter
      if (!req.user || req.user.uid !== userid) {
        return res.status(403).json({ error: "Unauthorized to modify this user." });
      }

      // At least one field must be present
      if (!domainName && !serverDomain && !publicKey) {
        return res.status(400).json({ error: "At least one of 'domainName', 'serverDomain', or 'publicKey' must be provided." });
      }

      const db = admin.firestore();
      const nslRouterCollection = db.collection(NSL_ROUTER_COLLECTION);
      const userDocRef = nslRouterCollection.doc(userid);

      // If domainName is being updated, check its availability
      if (domainName) {
        const isAvailable = await checkAvailability(domainName);

        if (!isAvailable) {
          return res.status(409).json({ error: "Domain name is already in use." });
        }
      }

      // Prepare the update object
      const updateData: Partial<NSLRouterData> = {};
      if (domainName) updateData.domainName = domainName;
      if (serverDomain) updateData.serverDomain = serverDomain;
      if (publicKey) updateData.publicKey = publicKey;

      // Update the user's document
      await userDocRef.set(updateData, { merge: true });

      return res.status(200).json({ message: "Domain information updated successfully." });
    } catch (error) {
      console.error("Error in POST /domain/:userid:", error);
      return res.status(500).json({ error: error.toString() });
    }
  });

  expressApp.use('/', router);
}