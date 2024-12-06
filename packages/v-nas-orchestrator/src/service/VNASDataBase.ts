import admin from "firebase-admin";

export interface VNASEntry {
  instance: string;
}

export const VNASCollection = "vnas";

export async function getVNAS(uid: string): Promise<VNASEntry> {
  const docRef = admin.firestore().collection(VNASCollection).doc(uid);

  return admin.firestore().runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);

    return {
      instance: doc.get('instance'),
    };
  });
}

export async function createVNAS(uid: string, instance: string): Promise<VNASEntry> {
  const docRef = admin.firestore().collection(VNASCollection).doc(uid);

  return admin.firestore().runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);
    const data: VNASEntry = {
      instance: instance,
    };

    transaction.set(docRef, data, { merge: true });
    return data;
  });
}