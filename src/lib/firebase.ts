import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCpGBBWRvovddrZO6TXY_5_ExoR38zSjcI',
  authDomain: 'storelink-89646.firebaseapp.com',
  projectId: 'storelink-89646',
  storageBucket: 'storelink-89646.appspot.com',
  messagingSenderId: '964211880207',
  appId: '1:964211880207:web:a12d84fd4188087db5ce7a',
  measurementId: 'G-VFCENHE98D', // Not used, but included for completeness
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 