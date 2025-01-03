import admin from "firebase-admin";
import {generateKeyPair} from "../library/KeyLib.js";

export interface DomainEntry {
  pubkey: string;
  privkey: string;
}

export const DomainCollection = "domain";

export async function getDomainControlKeyPair(uid: string): Promise<DomainEntry> {
  const docRef = admin.firestore().collection(DomainCollection).doc(uid);

  return admin.firestore().runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);

    if (!doc.get('pubkey') && !doc.get('privkey')) {
      const keyPair = await generateKeyPair();
      const data: DomainEntry = {
        pubkey: keyPair.pub,
        privkey: keyPair.priv,
      };

      transaction.set(docRef, data, { merge: true });
      return data;
    }

    return {
      pubkey: doc.get('pubkey'),
      privkey: doc.get('privkey'),
    };
  });
}

export async function deleteDomainControlKeyPair(uid: string): Promise<void> {
  await admin.firestore().collection(DomainCollection).doc(uid).delete();
}