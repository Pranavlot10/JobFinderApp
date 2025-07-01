import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as Colors from "../constants/colors";
import * as Sizes from "../constants/sizes";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import * as LightColors from "../constants/colors";
import * as DarkColors from "../constants/colors-dark";

// Get screen dimensions for responsive sizing
const { width, height } = Dimensions.get("window");

const JobInfoScreen = ({ route, navigation }) => {
  const { job } = route.params || {};
  const [bookmarked, setBookmarked] = React.useState(false);
  const user = auth.currentUser;

  const theme = useSelector((state) => state.theme.mode);
  const colors = theme === "dark" ? DarkColors : LightColors;

  const jobTypeStyle =
    colors.JOB_TYPES[job?.job_employment_type] || colors.JOB_TYPES.default;

  const checkIfBookmarked = async () => {
    if (!user || !job) return;
    const docRef = doc(db, "users", user.uid, "bookmarks", job.job_id);
    const docSnap = await getDoc(docRef);
    setBookmarked(docSnap.exists());
  };

  React.useEffect(() => {
    checkIfBookmarked();
  }, []);

  const toggleBookmark = async () => {
    if (!user || !job) return;

    const docRef = doc(db, "users", user.uid, "bookmarks", job.job_id);

    try {
      if (bookmarked) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          job_id: job.job_id,
          job_title: job.job_title,
          employer_name: job.employer_name,
          job_location: job.job_location,
          job_employment_type: job.job_employment_type,
          job_posted_at: job.job_posted_at,
          job_description: job.job_description,
          salary: job.salary || "Not Disclosed",
          created_at: new Date(),
        });
      }
      setBookmarked(!bookmarked);
    } catch (error) {
      console.error("Bookmark error:", error);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header Section */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: colors.WHITE,
            borderBottomColor: colors.BORDER,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIconButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.PRIMARY} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>
          Info
        </Text>

        <TouchableOpacity
          onPress={toggleBookmark}
          style={styles.headerIconButton}
        >
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={colors.PRIMARY}
          />
        </TouchableOpacity>
      </View>

      {/* Job Details */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.WHITE,
            borderBottomColor: colors.BORDER,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              fontSize: Sizes.FONT_SIZE_XXL,
              color: colors.TEXT_PRIMARY,
            },
          ]}
        >
          {job.job_title}
        </Text>
        <Text
          style={[
            styles.company,
            {
              fontSize: Sizes.FONT_SIZE_LG,
              color: colors.PRIMARY,
            },
          ]}
        >
          {job.employer_name}
        </Text>
        <Text
          style={[
            styles.location,
            {
              fontSize: Sizes.FONT_SIZE_MD,
              color: colors.TEXT_SECONDARY,
            },
          ]}
        >
          {job.job_location}
        </Text>
        <View style={styles.tagsContainer}>
          <View
            style={[
              styles.jobTypeTag,
              { backgroundColor: jobTypeStyle.background },
            ]}
          >
            <Text
              style={[
                styles.jobTypeText,
                { fontSize: Sizes.FONT_SIZE_SM, color: jobTypeStyle.text },
              ]}
            >
              {job.job_employment_type}
            </Text>
          </View>
          <Text
            style={[
              styles.postedDate,
              {
                fontSize: Sizes.FONT_SIZE_SM,
                color: colors.TEXT_TERTIARY,
              },
            ]}
          >
            {job.job_posted_at}
          </Text>
        </View>
      </View>

      {/* Salary Section */}
      <View
        style={[
          styles.salarySection,
          {
            backgroundColor: colors.WHITE,
            borderBottomColor: colors.BORDER,
          },
        ]}
      >
        <Text
          style={[
            styles.salaryLabel,
            {
              fontSize: Sizes.FONT_SIZE_SM,
              color: colors.TEXT_SECONDARY,
            },
          ]}
        >
          Salary Range
        </Text>
        <Text
          style={[
            styles.salaryAmount,
            {
              fontSize: Sizes.FONT_SIZE_XL,
              color: colors.TEXT_PRIMARY,
            },
          ]}
        >
          {job.salary || "Not Disclosed"}
        </Text>
      </View>

      {/* Description Section */}
      <View style={[styles.section, { backgroundColor: colors.WHITE }]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              fontSize: Sizes.FONT_SIZE_LG,
              color: colors.TEXT_PRIMARY,
            },
          ]}
        >
          Job Description
        </Text>
        <Text
          style={[
            styles.sectionText,
            {
              fontSize: Sizes.FONT_SIZE_MD,
              lineHeight: Sizes.LINE_HEIGHT_MD,
              color: colors.TEXT_SECONDARY,
            },
          ]}
        >
          {job.job_description}
        </Text>
      </View>

      {/* Apply Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.applyButton, { backgroundColor: colors.PRIMARY }]}
        >
          <Text
            style={[
              styles.applyButtonText,
              {
                fontSize: Sizes.FONT_SIZE_LG,
                color: colors.WHITE,
              },
            ]}
          >
            Apply Now
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: height * Sizes.SCROLL_PADDING_SCALE,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Sizes.SCREEN_PADDING,
    paddingTop: Sizes.SPACING_SM,
    paddingBottom: Sizes.SPACING_SM,
    borderBottomWidth: Sizes.BORDER_WIDTH,
  },
  headerIconButton: {
    padding: Sizes.PADDING_SM,
  },
  headerTitle: {
    fontSize: Sizes.FONT_SIZE_LG,
    fontWeight: "600",
  },
  header: {
    paddingHorizontal: Sizes.SCREEN_PADDING,
    paddingVertical: Sizes.SPACING_XXL,
    borderBottomWidth: Sizes.BORDER_WIDTH,
  },
  title: {
    fontWeight: "700",
    marginBottom: Sizes.SPACING_SM,
  },
  company: {
    fontWeight: "600",
    marginBottom: Sizes.SPACING_XS,
  },
  location: {
    fontWeight: "400",
    marginBottom: Sizes.SPACING_LG,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  jobTypeTag: {
    paddingHorizontal: Sizes.PADDING_MD,
    paddingVertical: Sizes.SPACING_SM,
    borderRadius: Sizes.BORDER_RADIUS,
  },
  jobTypeText: {
    fontWeight: "600",
  },
  postedDate: {
    fontWeight: "400",
  },
  salarySection: {
    paddingHorizontal: Sizes.SCREEN_PADDING,
    paddingVertical: Sizes.SPACING_XL,
    marginTop: Sizes.SPACING_MD,
    borderBottomWidth: Sizes.BORDER_WIDTH,
  },
  salaryLabel: {
    fontWeight: "500",
    marginBottom: Sizes.SPACING_XS,
  },
  salaryAmount: {
    fontWeight: "700",
  },
  section: {
    paddingHorizontal: Sizes.SCREEN_PADDING,
    paddingVertical: Sizes.SPACING_XL,
    marginTop: Sizes.SPACING_MD,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: Sizes.SPACING_LG,
  },
  sectionText: {
    fontWeight: "400",
  },
  buttonContainer: {
    paddingHorizontal: Sizes.SCREEN_PADDING,
    paddingVertical: Sizes.SPACING_XXL,
    marginTop: Sizes.SPACING_MD,
  },
  applyButton: {
    height: Sizes.BUTTON_HEIGHT,
    borderRadius: Sizes.BORDER_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontWeight: "600",
  },
});

export default JobInfoScreen;
