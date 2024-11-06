let firebaseConfig:{
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId: string
};


export async function fetchFirebaseConfig() {
    if(!firebaseConfig) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/core/config/firebase`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        firebaseConfig = await response.json();
    }
    return firebaseConfig;
}