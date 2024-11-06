// Initialize Firebase
import {FirebaseApp, initializeApp} from "firebase/app";
import {fetchFirebaseConfig} from "./FirebaseConfig";

let app:FirebaseApp;

export const initFirebase: () => Promise<FirebaseApp> = async () => {
  if(!app) {
    const firebaseConfig = await fetchFirebaseConfig();
    app = initializeApp(firebaseConfig);
  }

  return app;
}