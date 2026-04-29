import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let dbInstance = null;
let isInitialized = false;

if (!admin.apps.length) {
  try {
    if (typeof window === 'undefined') {
      const saPath = path.join(process.cwd(), 'firebase-service-account.json');
      
      if (fs.existsSync(saPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id
        });
        isInitialized = true;
        console.log('Firebase Admin initialized with Service Account (Secure)');
      } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        // Option to provide via environment variable as a stringified JSON
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id
        });
        isInitialized = true;
        console.log('Firebase Admin initialized with Env Var (Secure)');
      } else {
        // DO NOT initialize with just projectId in production if no credentials exist
        // as it will hang looking for Metadata Servers on non-GCP environments.
        if (process.env.NODE_ENV === 'development') {
          admin.initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dev-project',
          });
          isInitialized = true;
          console.log('Firebase Admin initialized in DEV mode');
        } else {
          console.warn('Firebase Admin: No credentials found. Live database disabled to prevent timeouts.');
        }
      }
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
  }
} else {
  isInitialized = true;
}

const db = isInitialized ? admin.firestore() : null;
export { db, isInitialized };
