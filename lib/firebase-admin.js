import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

if (!admin.apps.length) {
  try {
    if (typeof window === 'undefined') {
      // Use fs.readFileSync instead of require to prevent Turbopack/Webpack 
      // from trying to bundle this into the client-side code.
      const saPath = path.join(process.cwd(), 'firebase-service-account.json');
      
      if (fs.existsSync(saPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id
        });
        console.log('Firebase Admin initialized with Service Account (Secure)');
      } else {
        // Fallback for environments where the file is provided via Env Vars
        admin.initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
        console.log('Firebase Admin initialized with Project ID fallback');
      }
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
  }
}

const db = admin.firestore();
export { db };
