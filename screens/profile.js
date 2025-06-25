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
} from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// (Import your constants below as you already did — unchanged)
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

  const fetchUserData = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
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
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        Alert.alert("Error logging out.");
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUserData(); // refresh profile when screen is focused again
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color={PRIMARY}
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text
          style={{ textAlign: "center", marginTop: 50, color: TEXT_PRIMARY }}
        >
          No profile found. Please complete your profile setup.
        </Text>
      </SafeAreaView>
    );
  }

  const StatCard = ({ title, value, color = PRIMARY }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const SkillTag = ({ skill }) => (
    <View style={styles.skillTag}>
      <Text style={styles.skillText}>{skill}</Text>
    </View>
  );

  const MenuOption = ({ icon, title, subtitle, onPress, showArrow = true }) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <View style={styles.menuContent}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && <Text style={styles.menuArrow}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.openDrawer()}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("ProfileSetup", {
                  fromProfile: true, // optional: flag to know where user came from
                })
              }
            >
              <Text style={styles.editIcon}>✎</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  userData.avatar ||
                  "https://via.placeholder.com/100x100.png?text=👤",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{userData.name || "Unnamed"}</Text>
          <Text style={styles.title}>
            {userData.preferredRole || "Role not set"}
          </Text>
          <Text style={styles.location}>
            📍 {userData.city || "Unknown city"}
          </Text>

          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>📧 {userData.email}</Text>
            <Text style={styles.contactText}>
              🎓 {userData.education || "Not specified"}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          {/* <StatCard title="Applications" value="12" /> */}
          <StatCard title="Saved Jobs" value="8" color={SUCCESS} />
          {/* <StatCard title="Profile Views" value="156" color={INFO} /> */}
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>
            {userData.bio ||
              "Passionate job seeker with an interest in innovative roles and collaborative environments."}
          </Text>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {userData.skills?.map((skill, index) => (
              <SkillTag key={index} skill={skill} />
            )) || <Text>No skills listed</Text>}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
  header: {
    backgroundColor: WHITE,
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: PADDING_LG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
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
  },
  backIcon: {
    fontSize: FONT_SIZE_XL,
    color: TEXT_PRIMARY,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: FONT_SIZE_XL,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS_SM,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  editIcon: {
    fontSize: FONT_SIZE_MD,
    color: PRIMARY,
  },
  profileSection: {
    backgroundColor: WHITE,
    alignItems: "center",
    paddingVertical: SPACING_XXL,
    paddingHorizontal: SCREEN_PADDING,
    marginBottom: MARGIN_MD,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: MARGIN_LG,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: PRIMARY_LIGHT,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: WHITE,
  },
  cameraIcon: {
    fontSize: 14,
  },
  name: {
    fontSize: FONT_SIZE_XXL,
    fontWeight: "bold",
    color: TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: MARGIN_SM,
  },
  title: {
    fontSize: FONT_SIZE_LG,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: MARGIN_SM,
  },
  location: {
    fontSize: FONT_SIZE_MD,
    color: TEXT_TERTIARY,
    textAlign: "center",
    marginBottom: MARGIN_LG,
  },
  contactInfo: {
    alignItems: "center",
  },
  contactText: {
    fontSize: FONT_SIZE_SM,
    color: TEXT_SECONDARY,
    marginBottom: MARGIN_SM,
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
  statValue: {
    fontSize: FONT_SIZE_XL,
    fontWeight: "bold",
    color: TEXT_PRIMARY,
    marginBottom: MARGIN_SM,
  },
  statTitle: {
    fontSize: FONT_SIZE_SM,
    color: TEXT_SECONDARY,
  },
  section: {
    backgroundColor: WHITE,
    marginBottom: MARGIN_MD,
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: PADDING_XL,
  },
  sectionTitle: {
    fontSize: FONT_SIZE_LG,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    marginBottom: MARGIN_LG,
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
  },
  skillText: {
    fontSize: FONT_SIZE_SM,
    color: PRIMARY,
    fontWeight: "500",
  },
  menuContainer: {
    gap: SPACING_SM,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: PADDING_LG,
    paddingHorizontal: PADDING_MD,
    backgroundColor: BACKGROUND_SECONDARY,
    borderRadius: BORDER_RADIUS,
    marginBottom: MARGIN_SM,
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    fontSize: FONT_SIZE_LG,
    marginRight: MARGIN_MD,
    width: 24,
    textAlign: "center",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONT_SIZE_MD,
    fontWeight: "500",
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: FONT_SIZE_SM,
    color: TEXT_SECONDARY,
  },
  menuArrow: {
    fontSize: FONT_SIZE_XL,
    color: TEXT_TERTIARY,
    fontWeight: "bold",
  },
  logoutSection: {
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: SPACING_XXL,
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    height: BUTTON_HEIGHT,
    borderRadius: BORDER_RADIUS,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING_XXL,
  },
  logoutText: {
    fontSize: FONT_SIZE_MD,
    fontWeight: "600",
    color: WHITE,
  },
});

export default ProfileScreen;
