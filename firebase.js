// firebase.js
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZuQbEVNYbEwxeSSIeR-sPPoQq7x6cYEo",
  authDomain: "jobfinderapp-f07de.firebaseapp.com",
  projectId: "jobfinderapp-f07de",
  storageBucket: "jobfinderapp-f07de.appspot.com",
  messagingSenderId: "107435304602",
  appId: "1:107435304602:web:9592d5a83499b1e9876123",
  measurementId: "G-TS1BFJ2MQ5",
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
