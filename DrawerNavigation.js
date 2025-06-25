// DrawerNavigation.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./screens/home";
import ProfileScreen from "./screens/profile";
import BookmarksScreen from "./screens/bookmarks";
import { Text } from "react-native";

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#ffffff",
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 16,
          color: "#333",
          fontWeight: "500",
        },
        drawerItemStyle: {
          marginVertical: 5,
        },
        drawerActiveTintColor: "#007AFF",
        drawerInactiveTintColor: "#666",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: "Profile",
          drawerIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          drawerLabel: "Bookmarks",
          drawerIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔖</Text>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
