const admin = require('firebase-admin') as any;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
const privateKey = privateKeyRaw ? privateKeyRaw.replace(/\\n/g, '\n') : undefined;

let firebaseAdminAuth: any;

if (projectId && clientEmail && privateKey) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      })
    });
  }
  firebaseAdminAuth = admin.auth();
} else {
  // Do not throw at module import time so dev server can run without Firebase admin credentials.
  // Any code that tries to verify an ID token will get a clear error from `verifyIdToken`.
  // This makes local development easier when service account keys are not present.
  // Log a friendly warning for developers.
  // eslint-disable-next-line no-console
  console.warn('Firebase admin credentials not set — Google token verification disabled. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to enable.');

  firebaseAdminAuth = {
    verifyIdToken: async () => {
      throw new Error('Firebase admin not initialized. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to enable Google sign-in.');
    }
  } as any;
}

export { firebaseAdminAuth };
