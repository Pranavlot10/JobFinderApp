import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase";
import { useSelector } from "react-redux";
import LoginScreen from "../screens/loginScreen";
import RegisterScreen from "../screens/registerScreen";
import ProfileSetupScreen from "../screens/ProfileSetupScreen";
import DrawerNavigation from "../DrawerNavigation"; // Contains ProfileScreen, Home, etc.
import JobInfoScreen from "../screens/infopage"; // Optional

const Stack = createNativeStackNavigator();

export default function AuthWrapper() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const theme = useSelector((state) => state.theme);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // 🔍 Check if profile exists
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        setProfileComplete(docSnap.exists());
      } else {
        setUser(null);
        setProfileComplete(false);
      }
      setChecking(false);
    });

    return unsubscribe;
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            {!profileComplete && (
              <Stack.Screen
                name="ProfileSetup"
                component={ProfileSetupScreen}
              />
            )}
            <Stack.Screen name="Drawer" component={DrawerNavigation} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen name="JobInfo" component={JobInfoScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
