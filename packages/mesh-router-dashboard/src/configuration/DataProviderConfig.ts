import {addResource} from "./providers/interface/DataProvider";
import { firebaseDataProvider } from "./providers/firebase/FireBaseDataProvider";

export function initializeDataProvider() {
  addResource('nsl-router', firebaseDataProvider);
  addResource('users', firebaseDataProvider);
}