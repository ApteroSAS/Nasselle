// Authentication middleware
import {firebaseUserAuthenticate} from "../firebase/ExpressAuthenticateMiddleWare.js";

export type AuthUserRequest = Partial<{
  user: {
    uid: string;
  };
}> | any;

export const authenticate = firebaseUserAuthenticate;