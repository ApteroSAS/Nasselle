import admin from "firebase-admin";

const PERMISSION_STORAGE_KEY = 'permissions';

export async function addPermission(uid: string, permissionKey: string): Promise<void> {
  await admin.firestore()
  .collection(PERMISSION_STORAGE_KEY)
  .doc(uid)
  .update({
    [`permission.${permissionKey}`]: true
  });
}

export async function removePermission(uid: string, permissionKey: string): Promise<void> {
  await admin.firestore()
  .collection(PERMISSION_STORAGE_KEY)
  .doc(uid)
  .update({
    [`permission.${permissionKey}`]: admin.firestore.FieldValue.delete()
  });
}

export async function hasPermission(uid: string, permissionKey: string): Promise<boolean> {
  const doc = await admin.firestore()
  .collection(PERMISSION_STORAGE_KEY)
  .doc(uid)
  .get();

  return doc.exists && !!doc.data()?.permission[permissionKey];
}

export async function getPermissions(uid: string): Promise<Record<string, any>> {
  const doc = await admin.firestore()
  .collection(PERMISSION_STORAGE_KEY)
  .doc(uid)
  .get();

  return doc.exists ? doc.data()?.permission : {};
}