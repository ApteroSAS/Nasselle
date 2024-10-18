//https://firebase.google.com/docs/admin/setup/#initialize_the_sdk_in_non-google_environments
import admin from "firebase-admin";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../../key/serviceAccount.json');
const serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Firestore database reference
export async function getUser(userid:string) {
  const db = admin.firestore();
  const usersRef = db.collection('users');
  const document = await usersRef.doc(userid).get();
  return document.data();
}