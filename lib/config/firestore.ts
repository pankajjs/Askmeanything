import 'server-only'

import { initializeApp, cert, getApps, ServiceAccount } from 'firebase-admin/app';
import { getFirestore }  from 'firebase-admin/firestore';
import serviceAccount from "./prod.firestore.json";

const firestoreConfig = process.env.NODE_ENV === "production" ? {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n')
}: serviceAccount;

// Check if Firebase app is already initialized
if (getApps().length === 0) {
  initializeApp({
    credential: cert(firestoreConfig as ServiceAccount)
  });
}

export const db = getFirestore();