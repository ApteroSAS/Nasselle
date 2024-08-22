import {FirebaseDataProvider} from "react-admin-firebase";
import {options} from "../configuration/FireBaseOptions";
import {firebaseConfig} from "../configuration/FirebaseConfig";

export const firebaseDataProvider = FirebaseDataProvider(firebaseConfig, options);
