import {backendUrl} from "./AppConfiguration";

export let firebaseConfig:{
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId: string
};


export async function fetchFirebaseConfig() {
    const response = await fetch(`${backendUrl}/api/config/firebase`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    firebaseConfig = await response.json();
}