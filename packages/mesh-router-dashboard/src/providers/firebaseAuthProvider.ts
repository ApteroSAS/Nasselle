import {FirebaseAuthProvider} from 'react-admin-firebase';
import {options} from "../configuration/FireBaseOptions";
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
import {firebaseConfig} from "../configuration/FirebaseConfig";

export const app = initializeApp(firebaseConfig);

const fbauthProvider = FirebaseAuthProvider(firebaseConfig, options);
const authProviderCopy = {...fbauthProvider}
export const auth = getAuth();

authProviderCopy.registerUser = async (email: string, password: string) => {
  await createUserWithEmailAndPassword(auth, email, password);
  const user = auth.currentUser;
  await sendEmailVerification(user);
}

authProviderCopy.updatePassword = async (newPassword: string) => {
  const user = auth.currentUser;
  console.log("user",user);
  if (user) {
    return await updatePassword(user, newPassword);
  } else {
    throw new Error("No user is currently signed in.");
  }
}

authProviderCopy.updateEmail = async (email: string,currentPassword:string) => {
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
}

authProviderCopy.getEmail = (email: string) => {
  const user = auth.currentUser;
  if (user) {
    return user.email;
  } else {
    return null;
  }
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
export const authProvider = authProviderCopy;
