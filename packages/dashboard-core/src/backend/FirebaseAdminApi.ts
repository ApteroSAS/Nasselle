// src/lib/firebase.ts
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Get the current file's directory
const rootDir = process.cwd();

// Define paths to the service account and Firebase config files
const filePathSA = path.join(rootDir, 'config/serviceAccount.json');
const serviceAccount = JSON.parse(fs.readFileSync(filePathSA, 'utf-8'));

const filePathConfig = path.join(rootDir, 'config/firebaseConfig.json');
const config = JSON.parse(fs.readFileSync(filePathConfig, 'utf-8'));

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  console.log('Initializing Firebase Admin...');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin, config };
