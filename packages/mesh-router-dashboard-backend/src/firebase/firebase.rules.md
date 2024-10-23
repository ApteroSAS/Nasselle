// https://firebase.google.com/docs/rules/rules-language
// when you change this rule file, you need to deploy it to firebase and save it in the backend repo
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // General user document rules
    match /users/{userId} {

      // Allow read and write access to the owner of the document
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Match any document in the users collection
    match /nsl-router/{userId} {
      // Allow read and write access to the owner of the document
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // General user document rules
    match /permissions/{userId} {
      // readonly
      allow read;
    }

  }
}