import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZuQbEVNYbEwxeSSIeR-sPPoQq7x6cYEo",
  authDomain: "jobfinderapp-f07de.firebaseapp.com",
  projectId: "jobfinderapp-f07de",
  storageBucket: "jobfinderapp-f07de.appspot.com",
  messagingSenderId: "107435304602",
  appId: "1:107435304602:web:9592d5a83499b1e9876123",
  measurementId: "G-TS1BFJ2MQ5", // Ignored in React Native
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
