import {FirebaseDataProvider} from "react-admin-firebase";
import {firebaseConfig, options} from "../configuration/FireBaseConfiguration";

export const firebaseDataProvider = FirebaseDataProvider(firebaseConfig, options);
