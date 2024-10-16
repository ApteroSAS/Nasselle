import {addResource} from "../providers/DataProvider";
import { firebaseDataProvider } from "../providers/FireBaseDataProvider";

export function initializeDataProvider() {
  addResource('nsl-router', firebaseDataProvider);
  addResource('users', firebaseDataProvider);
}