import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function ProfileSetupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [skills, setSkills] = useState([]);
  const [about, setAbout] = useState("");

  const [educationOpen, setEducationOpen] = useState(false);
  const [education, setEducation] = useState(null);
  const [educationOptions, setEducationOptions] = useState([
    { label: "High School", value: "High School" },
    { label: "Diploma", value: "Diploma" },
    { label: "Bachelor's", value: "Bachelors" },
    { label: "Master's", value: "Masters" },
    { label: "PhD", value: "PhD" },
  ]);

  const [roleOpen, setRoleOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [roleOptions, setRoleOptions] = useState([
    { label: "Frontend Developer", value: "Frontend Developer" },
    { label: "Backend Developer", value: "Backend Developer" },
    { label: "Fullstack Developer", value: "Fullstack Developer" },
    { label: "Mobile Developer", value: "Mobile Developer" },
    { label: "Data Scientist", value: "Data Scientist" },
  ]);

  const [experienceOpen, setExperienceOpen] = useState(false);
  const [experience, setExperience] = useState(null);
  const [experienceOptions, setExperienceOptions] = useState([
    { label: "Fresher", value: "Fresher" },
    { label: "1-2 Years", value: "1-2" },
    { label: "3-5 Years", value: "3-5" },
    { label: "5+ Years", value: "5+" },
  ]);

  const fetchUserProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setCity(data.city || "");
        setSkills(data.skills || []);
        setEducation(data.education || null);
        setRole(data.preferredRole || null);
        setExperience(data.experience || null);
        setAbout(data.bio || "");
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!name || !education || !role || !city || !experience) {
      Alert.alert("Please fill out all required fields");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name,
        city,
        education,
        preferredRole: role,
        experience,
        skills,
        bio: about,
        updatedAt: new Date(),
      });

      Alert.alert("Profile updated!");
      navigation.goBack(); // Return to ProfileScreen
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error saving profile data");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Edit Your Profile</Text>

          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <View style={[styles.dropdownWrapper, { zIndex: 3000 }]}>
            <DropDownPicker
              open={educationOpen}
              value={education}
              items={educationOptions}
              setOpen={setEducationOpen}
              setValue={setEducation}
              setItems={setEducationOptions}
              placeholder="Select Education"
              style={styles.dropdown}
            />
          </View>

          <TextInput
            placeholder="City"
            value={city}
            onChangeText={setCity}
            style={styles.input}
          />

          <View style={[styles.dropdownWrapper, { zIndex: 2000 }]}>
            <DropDownPicker
              open={roleOpen}
              value={role}
              items={roleOptions}
              setOpen={setRoleOpen}
              setValue={setRole}
              setItems={setRoleOptions}
              placeholder="Preferred Role"
              style={styles.dropdown}
            />
          </View>

          <View style={[styles.dropdownWrapper, { zIndex: 1000 }]}>
            <DropDownPicker
              open={experienceOpen}
              value={experience}
              items={experienceOptions}
              setOpen={setExperienceOpen}
              setValue={setExperience}
              setItems={setExperienceOptions}
              placeholder="Experience Level"
              style={styles.dropdown}
            />
          </View>

          <TextInput
            placeholder="Skills (comma separated)"
            value={skills.join(", ")}
            onChangeText={(text) =>
              setSkills(text.split(",").map((s) => s.trim()))
            }
            style={styles.input}
          />

          <TextInput
            placeholder="About Me"
            value={about}
            onChangeText={setAbout}
            multiline
            numberOfLines={4}
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          />

          <Button title="Save Profile" onPress={handleSaveProfile} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  dropdownWrapper: {
    marginBottom: 15,
  },
  dropdown: {
    borderColor: "#ccc",
  },
});
