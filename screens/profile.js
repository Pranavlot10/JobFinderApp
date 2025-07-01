import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";

import {
  PRIMARY,
  PRIMARY_LIGHT,
  SUCCESS,
  INFO,
  BACKGROUND,
  BACKGROUND_SECONDARY,
  WHITE,
  BORDER,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  SHADOW_COLOR,
} from "../constants/colors";

import {
  FONT_SIZE_SM,
  FONT_SIZE_MD,
  FONT_SIZE_LG,
  FONT_SIZE_XL,
  FONT_SIZE_XXL,
  SPACING_SM,
  SPACING_MD,
  SPACING_LG,
  SPACING_XL,
  SPACING_XXL,
  PADDING_MD,
  PADDING_LG,
  PADDING_XL,
  MARGIN_SM,
  MARGIN_MD,
  MARGIN_LG,
  BORDER_RADIUS,
  BORDER_RADIUS_SM,
  BORDER_RADIUS_ROUND,
  BUTTON_HEIGHT,
  SCREEN_PADDING,
  SHADOW_OFFSET,
  SHADOW_OPACITY,
  SHADOW_RADIUS,
  ELEVATION,
} from "../constants/sizes";

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  const THEME_BACKGROUND = isDark ? "#121212" : BACKGROUND;
  const THEME_CARD = isDark ? "#1E1E1E" : WHITE;
  const THEME_TEXT_PRIMARY = isDark ? "#FFFFFF" : TEXT_PRIMARY;
  const THEME_TEXT_SECONDARY = isDark ? "#BBBBBB" : TEXT_SECONDARY;

  const fetchUserData = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      let user = docSnap.exists() ? docSnap.data() : null;

      if (user) {
        const savedSnap = await getDocs(
          collection(db, "users", uid, "bookmarks")
        );
        const appsSnap = await getDocs(
          collection(db, "users", uid, "applications")
        );

        setUserData({
          ...user,
          savedCount: savedSnap.size,
          applicationCount: appsSnap.size,
        });
      } else {
        Alert.alert("No profile data found.");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      Alert.alert("Error fetching profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          signOut(auth)
            .then(() => navigation.replace("Login"))
            .catch((error) => {
              console.error("Logout error:", error);
              Alert.alert("Error logging out.");
            });
        },
      },
    ]);
  };

  const handleImagePick = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Allow access to gallery.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const imageUri = result.assets[0].uri;
        const formData = new FormData();

        formData.append("file", {
          uri: imageUri,
          type: "image/jpeg",
          name: "profile.jpg",
        });
        formData.append("upload_preset", "unsigned_profile_upload");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dl7nxkacq/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (data.secure_url) {
          const imageUrl = data.secure_url;
          console.log("Uploaded to Cloudinary:", imageUrl);

          const uid = auth.currentUser.uid;
          const userRef = doc(db, "users", uid);
          await updateDoc(userRef, { avatar: imageUrl });

          fetchUserData();
        } else {
          throw new Error("Upload failed.");
        }
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      Alert.alert("Image upload failed.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUserData();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: THEME_BACKGROUND }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={[styles.loadingText, { color: THEME_TEXT_SECONDARY }]}>
            Loading your profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: THEME_BACKGROUND }]}
      >
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateIcon}>👤</Text>
          <Text style={[styles.emptyStateTitle, { color: THEME_TEXT_PRIMARY }]}>
            No Profile Found
          </Text>
          <Text
            style={[styles.emptyStateSubtitle, { color: THEME_TEXT_SECONDARY }]}
          >
            Please complete your profile setup to get started.
          </Text>
          <TouchableOpacity
            style={styles.setupButton}
            onPress={() => navigation.navigate("ProfileSetup")}
          >
            <Text style={styles.setupButtonText}>Setup Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const StatCard = ({ title, value, color = PRIMARY, icon }) => (
    <View
      style={[
        styles.statCard,
        { borderLeftColor: color, backgroundColor: THEME_CARD },
      ]}
    >
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
      <Text style={[styles.statTitle, { color: THEME_TEXT_SECONDARY }]}>
        {title}
      </Text>
    </View>
  );

  const SkillTag = ({ skill }) => (
    <View style={styles.skillTag}>
      <Text style={styles.skillText}>{skill}</Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: THEME_BACKGROUND }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={THEME_BACKGROUND}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchUserData} />
        }
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: THEME_CARD,
              borderBottomColor: isDark ? "#333" : BORDER,
            },
          ]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.openDrawer()}
              activeOpacity={0.7}
            >
              <Text style={[styles.backIcon, { color: THEME_TEXT_PRIMARY }]}>
                ≡
              </Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: THEME_TEXT_PRIMARY }]}>
              My Profile
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("ProfileSetup", { fromProfile: true })
              }
              activeOpacity={0.7}
            >
              <Text style={styles.editIcon}>✎</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleImagePick} activeOpacity={0.8}>
          <View
            style={[styles.profileSection, { backgroundColor: THEME_CARD }]}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri:
                    userData.avatar ||
                    "https://via.placeholder.com/120x120.png?text=👤",
                }}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>

            <Text style={[styles.name, { color: THEME_TEXT_PRIMARY }]}>
              {userData.name || "Unnamed User"}
            </Text>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {userData.preferredRole || "Role not set"}
              </Text>
            </View>
            <Text style={[styles.location, { color: THEME_TEXT_SECONDARY }]}>
              📍 {userData.city || "Location not specified"}
            </Text>

            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Text style={styles.contactIcon}>📧</Text>
                <Text
                  style={[styles.contactText, { color: THEME_TEXT_SECONDARY }]}
                >
                  {userData.email}
                </Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactIcon}>🎓</Text>
                <Text
                  style={[styles.contactText, { color: THEME_TEXT_SECONDARY }]}
                >
                  {userData.education || "Education not specified"}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.statsSection}>
          <StatCard
            title="Saved Jobs"
            value={userData.savedCount || 0}
            color={SUCCESS}
            icon="💾"
          />
          <StatCard
            title="Applications"
            value={userData.applicationCount || 0}
            color={INFO}
            icon="📝"
          />
        </View>

        <View style={[styles.section, { backgroundColor: THEME_CARD }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: THEME_TEXT_PRIMARY }]}>
              About Me
            </Text>
            <Text style={styles.sectionIcon}>👋</Text>
          </View>
          <Text style={[styles.bioText, { color: THEME_TEXT_SECONDARY }]}>
            {userData.bio ||
              "Passionate job seeker with an interest in innovative roles and collaborative environments. Always eager to learn new technologies and contribute to meaningful projects."}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: THEME_CARD }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: THEME_TEXT_PRIMARY }]}>
              Skills & Expertise
            </Text>
            <Text style={styles.sectionIcon}>🚀</Text>
          </View>
          <View style={styles.skillsContainer}>
            {userData.skills?.length > 0 ? (
              userData.skills.map((skill, index) => (
                <SkillTag key={index} skill={skill} />
              ))
            ) : (
              <View style={styles.emptySkillsContainer}>
                <Text style={styles.emptySkillsText}>
                  No skills added yet. Tap edit to add your skills!
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutIcon}>👋</Text>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING_XXL,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SCREEN_PADDING,
  },
  loadingText: {
    marginTop: MARGIN_LG,
    fontSize: FONT_SIZE_MD,
    color: TEXT_SECONDARY,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SCREEN_PADDING,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: MARGIN_LG,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZE_XL,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    marginBottom: MARGIN_SM,
  },
  emptyStateSubtitle: {
    fontSize: FONT_SIZE_MD,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: MARGIN_LG,
    lineHeight: 22,
  },
  setupButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: PADDING_XL,
    paddingVertical: PADDING_LG,
    borderRadius: BORDER_RADIUS,
  },
  setupButtonText: {
    color: WHITE,
    fontSize: FONT_SIZE_MD,
    fontWeight: "600",
  },
  header: {
    backgroundColor: WHITE,
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: PADDING_LG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS_SM,
    backgroundColor: BACKGROUND_SECONDARY,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  backIcon: {
    fontSize: FONT_SIZE_LG,
    color: TEXT_PRIMARY,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: FONT_SIZE_XL,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS_SM,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  editIcon: {
    fontSize: FONT_SIZE_MD,
    color: PRIMARY,
    fontWeight: "600",
  },
  profileSection: {
    backgroundColor: WHITE,
    alignItems: "center",
    paddingVertical: SPACING_XXL,
    paddingHorizontal: SCREEN_PADDING,
    marginBottom: MARGIN_MD,
    shadowColor: SHADOW_COLOR,
    shadowOffset: SHADOW_OFFSET,
    shadowOpacity: SHADOW_OPACITY,
    shadowRadius: SHADOW_RADIUS,
    elevation: ELEVATION,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: MARGIN_LG,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: PRIMARY_LIGHT,
  },
  onlineIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: SUCCESS,
    borderWidth: 2,
    borderColor: WHITE,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: WHITE,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraIcon: {
    fontSize: FONT_SIZE_SM,
  },
  name: {
    fontSize: FONT_SIZE_XXL,
    fontWeight: "bold",
    color: TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: MARGIN_SM,
  },
  titleContainer: {
    backgroundColor: PRIMARY_LIGHT,
    paddingHorizontal: PADDING_MD,
    paddingVertical: SPACING_SM,
    borderRadius: BORDER_RADIUS_ROUND,
    marginBottom: MARGIN_SM,
  },
  title: {
    fontSize: FONT_SIZE_MD,
    color: PRIMARY,
    textAlign: "center",
    fontWeight: "600",
  },
  location: {
    fontSize: FONT_SIZE_MD,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: MARGIN_LG,
  },
  contactInfo: {
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: PADDING_LG,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: MARGIN_SM,
    backgroundColor: BACKGROUND_SECONDARY,
    paddingHorizontal: PADDING_MD,
    paddingVertical: SPACING_SM,
    borderRadius: BORDER_RADIUS_SM,
    width: "100%",
  },
  contactIcon: {
    fontSize: FONT_SIZE_MD,
    marginRight: MARGIN_SM,
    width: 20,
  },
  contactText: {
    fontSize: FONT_SIZE_SM,
    color: TEXT_SECONDARY,
    flex: 1,
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: SCREEN_PADDING,
    marginBottom: MARGIN_LG,
    gap: SPACING_MD,
  },
  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    padding: PADDING_LG,
    borderRadius: BORDER_RADIUS,
    borderLeftWidth: 4,
    shadowColor: SHADOW_COLOR,
    shadowOffset: SHADOW_OFFSET,
    shadowOpacity: SHADOW_OPACITY,
    shadowRadius: SHADOW_RADIUS,
    elevation: ELEVATION,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: MARGIN_SM,
  },
  statIcon: {
    fontSize: FONT_SIZE_LG,
  },
  statValue: {
    fontSize: FONT_SIZE_XL,
    fontWeight: "bold",
  },
  statTitle: {
    fontSize: FONT_SIZE_SM,
    color: TEXT_SECONDARY,
    fontWeight: "500",
  },
  section: {
    backgroundColor: WHITE,
    marginHorizontal: SCREEN_PADDING,
    marginBottom: MARGIN_MD,
    paddingHorizontal: PADDING_XL,
    paddingVertical: PADDING_XL,
    borderRadius: BORDER_RADIUS,
    shadowColor: SHADOW_COLOR,
    shadowOffset: SHADOW_OFFSET,
    shadowOpacity: SHADOW_OPACITY,
    shadowRadius: SHADOW_RADIUS,
    elevation: ELEVATION,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: MARGIN_LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZE_LG,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  sectionIcon: {
    fontSize: FONT_SIZE_LG,
  },
  bioText: {
    fontSize: FONT_SIZE_MD,
    color: TEXT_SECONDARY,
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING_SM,
  },
  skillTag: {
    backgroundColor: PRIMARY_LIGHT,
    paddingHorizontal: PADDING_MD,
    paddingVertical: SPACING_SM,
    borderRadius: BORDER_RADIUS_ROUND,
    marginBottom: MARGIN_SM,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  skillText: {
    fontSize: FONT_SIZE_SM,
    color: PRIMARY,
    fontWeight: "600",
  },
  emptySkillsContainer: {
    padding: PADDING_LG,
    backgroundColor: BACKGROUND_SECONDARY,
    borderRadius: BORDER_RADIUS,
    alignItems: "center",
    width: "100%",
  },
  emptySkillsText: {
    fontSize: FONT_SIZE_SM,
    color: TEXT_TERTIARY,
    textAlign: "center",
    fontStyle: "italic",
  },
  logoutSection: {
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: SPACING_XL,
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    height: BUTTON_HEIGHT,
    borderRadius: BORDER_RADIUS,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING_XXL,
    flexDirection: "row",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutIcon: {
    fontSize: FONT_SIZE_MD,
    marginRight: MARGIN_SM,
  },
  logoutText: {
    fontSize: FONT_SIZE_MD,
    fontWeight: "600",
    color: WHITE,
  },
});

export default ProfileScreen;
