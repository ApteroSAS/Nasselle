import {FirebaseAuthProvider} from 'react-admin-firebase';
import {options} from "../configuration/FireBaseOptions";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";


// Initialize Firebase
import {initializeApp} from "firebase/app";
import {firebaseDataProvider} from "./FireBaseDataProvider";
import {firebaseConfig} from "../configuration/FirebaseConfig";

export const app = initializeApp(firebaseConfig);

const fbauthProvider = FirebaseAuthProvider(firebaseConfig, options);
const authProviderCopy = {...fbauthProvider}
export const auth = getAuth();

authProviderCopy.registerUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
}

authProviderCopy.getIdentity = async () => {
  const user = await fbauthProvider.getIdentity();
  console.log("id",user);
  let userData = await firebaseDataProvider.getOne('users', {id: user.id});
  console.log("userData",userData);
  return {
    id: user.id,
    fullName: userData.data.first_name,
    avatar: userData.data.avatar,
  }

}


export async function getUserToken() {
  return  await auth.currentUser.getIdToken(true);
}

export const authProvider = authProviderCopy;

/*export const authProvider: AuthProvider = {
  ...fbauthProvider,
  registerUser : async (email: string, password: string) => {
    const auth = getAuth();
    return await createUserWithEmailAndPassword(auth, email, password);
  },
  login: async ({ username }) => {
    return fbauthProvider.login({ username });
  },
  logout: async (params: any) => {
    return fbauthProvider.logout(params);
  },
  checkError: async (error) => {
    return fbauthProvider.checkError(error);
  },
  checkAuth: async (params) => {
    return fbauthProvider.checkAuth(params);
  },
  getPermissions: async (params) => {
    return fbauthProvider.getPermissions(params);
  },
  getIdentity: async () => {
    const test = await fbauthProvider.getIdentity();
    console.log("test",test);
    return test;
  }
};*/
