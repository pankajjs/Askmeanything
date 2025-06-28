import { initializeApp, cert, ServiceAccount, getApps } from 'firebase-admin/app';
import { getFirestore }  from 'firebase-admin/firestore';
import serviceAccount from "./prod.firestore.json";

// Check if Firebase app is already initialized
if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });
}

export const db = getFirestore();