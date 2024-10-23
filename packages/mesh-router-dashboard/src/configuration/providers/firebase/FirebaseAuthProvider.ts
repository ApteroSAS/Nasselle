import {FirebaseAuthProvider} from 'react-admin-firebase';
import {options} from "./FireBaseOptions";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider
} from "firebase/auth";


// Initialize Firebase
import {initializeApp} from "firebase/app";
import {firebaseDataProvider} from "./FireBaseDataProvider";
import {firebaseConfig} from "./FirebaseConfig";
import {AuthProviderAdditionalInterface, AuthProviderInterface} from '../interface/AuthProviderInterface';
import {getBackendURL} from "../../BackendURL";
import axios from "axios";

export const app = initializeApp(firebaseConfig);

const fbauthProvider = FirebaseAuthProvider(firebaseConfig, options);
const authProviderCopy = { ...fbauthProvider };
export const auth = getAuth();

authProviderCopy.getIdentity = async () => {
  const user = await fbauthProvider.getIdentity();
  if(!user){
    throw new Error("No user is currently signed in.");
  }
  let userData = await firebaseDataProvider.getOne('users', {id: user.id});
  console.log("userData",userData);
  return {
    id: user.id,
    fullName: userData.data.first_name,
    avatar: userData.data.avatar,
    permissions: userData.data.permissions,
  }
};

const authProviderAdditional:AuthProviderAdditionalInterface = {
  registerUser: async (email: string, password: string) => {
    const response = await axios.post(`${getBackendURL()}/user/create`, {
      email,
      password
    });
    if (response.status != 200){
      throw new Error(response.data.error);
    }
  },

  updatePassword: async (newPassword: string) => {
    const user = auth.currentUser;
    console.log("user", user);
    if (user) {
      return await updatePassword(user, newPassword);
    } else {
      throw new Error("No user is currently signed in.");
    }
  },

  updateEmail: async (email: string, currentPassword: string) => {
    const user = auth.currentUser;
    if (user) {
      const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
      await reauthenticateWithCredential(user, credential);
      await verifyBeforeUpdateEmail(user, email);
      // Send verification email
      await sendEmailVerification(user);
    } else {
      throw new Error("No user is currently signed in.");
    }
  },

  getEmail: () => {
    const user = auth.currentUser;
    return user ? user.email : null;
  },
};


export const authProvider:AuthProviderInterface = {...authProviderCopy,...authProviderAdditional} as any;
