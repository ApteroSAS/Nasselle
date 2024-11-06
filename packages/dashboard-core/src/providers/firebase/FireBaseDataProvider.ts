import {options} from "./FireBaseOptions";
import {fetchFirebaseConfig} from "./FirebaseConfig";
import {DataProvider} from "react-admin";

let firebaseDataProvider:DataProvider;

export const getFirebaseDataProvider = async () => {
  if(!firebaseDataProvider){
    const {FirebaseDataProvider} = await import("react-admin-firebase");
    firebaseDataProvider = FirebaseDataProvider(await fetchFirebaseConfig(), options);
  }
  return firebaseDataProvider;
}