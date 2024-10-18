import {FirebaseDataProvider} from "react-admin-firebase";
import {options} from "./FireBaseOptions";
import {firebaseConfig} from "./FirebaseConfig";

export const firebaseDataProvider = FirebaseDataProvider(firebaseConfig, options);
