import {options} from "./FireBaseOptions";
import {
  deleteUser,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendEmailVerification,
  updatePassword,
  verifyBeforeUpdateEmail
} from "firebase/auth";


// Initialize Firebase
import type {AuthProviderAdditionalInterface, AuthProviderInterface} from '../interface/AuthProviderInterface';
import axios from "axios";
import {deleteDoc, doc, getDoc, getFirestore} from 'firebase/firestore';
import type {UserIdentity} from "ra-core/src/types.ts";
import {initFirebase} from "./FirebaseProvider";

let authProvider:AuthProviderInterface;

export const getAuthProvider: () => Promise<AuthProviderInterface> = async () => {
  if (typeof window === 'undefined') {
    // Return a dummy provider for SSR
    return {} as AuthProviderInterface;
  }
  if(!authProvider) {
    const app = await initFirebase();
    const { FirebaseAuthProvider } = await import('react-admin-firebase');
    const fbauthProvider = FirebaseAuthProvider(app.options, options);
    const authProviderCopy = { ...fbauthProvider };

    authProviderCopy.getIdentity = async ():Promise<UserIdentity>=> {
      const auth = getAuth();
      const user = auth.currentUser;
      if(!user){
        throw new Error("No user is currently signed in.");
      }
      const db = getFirestore(app);
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const idToken = await user.getIdToken( true);

      return {
        id: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        fullName: docSnap.get("first_name"),
        avatar: docSnap.get("avatar"),
        permissions: docSnap.get("permissions"),
        authToken:idToken,
      };
    };

    const authProviderAdditional:AuthProviderAdditionalInterface = {

      registerUser: async (email: string, password: string) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/core/user/create`, {
          email,
          password
        });
        if (response.status != 200){
          throw new Error(response.data.error);
        }
      },

      sendResetPasswordMail: async (email: string) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/core/user/reset`, {
          email,
        });
        if (response.status != 200){
          throw new Error(response.data.error);
        }
      },

      deleteAccount: async (currentPassword: string) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !user.email) {
          throw new Error("No user is currently signed in.");
        }

        try {
          // Create credential with current password
          const credential = EmailAuthProvider.credential(user.email, currentPassword);

          // Reauthenticate the user
          await reauthenticateWithCredential(user, credential);

          // Delete user data from Firestore or your backend
          const db = getFirestore(app);
          await deleteDoc(doc(db, 'users', user.uid));

          // Delete the user from Firebase Authentication
          await deleteUser(user);

        } catch (error: any) {
          // Handle specific Firebase errors
          if (error.code === 'auth/wrong-password') {
            throw new Error("Incorrect password. Please try again.");
          } else if (error.code === 'auth/too-many-requests') {
            throw new Error("Too many attempts. Please try again later.");
          } else {
            throw new Error(error.message || "Failed to delete account.");
          }
        }
      },

      updatePassword: async (newPassword: string) => {
        const auth = getAuth();
        const user = auth.currentUser;
        console.log("user", user);
        if (user) {
          return await updatePassword(user, newPassword);
        } else {
          throw new Error("No user is currently signed in.");
        }
      },

      updateEmail: async (email: string, currentPassword: string) => {
        const auth = getAuth();
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

      authStateReady(): Promise<void> {
        const auth = getAuth();
        return auth.authStateReady();
      },

      getEmail: () => {
        const auth = getAuth();
        const user = auth.currentUser;
        return user ? user.email : null;
      },
    };

    authProvider = {...authProviderCopy,...authProviderAdditional} as any;
  }

  return authProvider;
}