// firebaseConfig.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  storageBucket: "xxx.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "xxx"
};

export const firebaseApp = initializeApp(firebaseConfig);
