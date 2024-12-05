// Authentication middleware
import {firebaseUserAuthenticate} from "../firebase/ExpressAuthenticateMiddleWare.js";

export type AuthUserRequest = Partial<{
  user: {
    uid: string;
  };
}> | any;

export const authenticate = async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //use SERVICE_API_KEY format Bearer SERVICE_API_KEY;uid
    if((req.headers.authorization+"").startsWith(`Bearer ${process.env.SERVICE_API_KEY};`)) {
      const idToken = req.headers.authorization.split("Bearer ")[1];
      req.user = {uid: idToken.split(";")[1]}; // Attach user info to request object
      return next();
    }else {
      //else default to firebase authentication
      return firebaseUserAuthenticate(req, res, next);
    }
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};