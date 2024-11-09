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
    const idToken = req.headers.authorization.split("Bearer ")[1];
    if(idToken.split(";").length == 2 && idToken.split(";")[0] === process.env.SERVICE_API_KEY) {
      req.user = {uid: idToken.split(";")[1]}; // Attach user info to request object
      return next();
    }

    //else default to firebase authentication
    return firebaseUserAuthenticate(req, res, next);
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};