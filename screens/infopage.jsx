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

// Get screen dimensions for responsive sizing
const { width, height } = Dimensions.get("window");

// Sample job data (replace with actual data from API or route params)
const jobData = {
  salary: "90,000 - 140,000",
};

const JobInfoScreen = ({ route, navigation }) => {
  // In a real app, use route.params to get job data
  const { job } = route.params || { jobId: "1" }; // Fallback for testing
  const {
    title,
    company,
    location,
    type,
    salary,
    description,
    requirements,
    postedDate,
  } = jobData;

  const [bookmarked, setBookmarked] = React.useState(false);

  const user = auth.currentUser;

  const jobTypeStyle = Colors.JOB_TYPES[type] || Colors.JOB_TYPES.default;

  const checkIfBookmarked = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "bookmarks", job.job_id);
    const docSnap = await getDoc(docRef);
    setBookmarked(docSnap.exists());
  };

  React.useEffect(() => {
    checkIfBookmarked();
  }, []);

  const toggleBookmark = async () => {
    if (!user) return;

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
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header Section */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIconButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Info</Text>

        <TouchableOpacity
          onPress={toggleBookmark}
          style={styles.headerIconButton}
        >
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={Colors.PRIMARY}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: Sizes.FONT_SIZE_XXL }]}>
          {job.job_title}
        </Text>
        <Text style={[styles.company, { fontSize: Sizes.FONT_SIZE_LG }]}>
          {job.employer_name}
        </Text>
        <Text style={[styles.location, { fontSize: Sizes.FONT_SIZE_MD }]}>
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
          <Text style={[styles.postedDate, { fontSize: Sizes.FONT_SIZE_SM }]}>
            {job.job_posted_at}
          </Text>
        </View>
      </View>

      {/* Salary Section */}
      <View style={styles.salarySection}>
        <Text style={[styles.salaryLabel, { fontSize: Sizes.FONT_SIZE_SM }]}>
          Salary Range
        </Text>
        <Text style={[styles.salaryAmount, { fontSize: Sizes.FONT_SIZE_XL }]}>
          {salary}
        </Text>
      </View>

      {/* Description Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: Sizes.FONT_SIZE_LG }]}>
          Job Description
        </Text>
        <Text
          style={[
            styles.sectionText,
            { fontSize: Sizes.FONT_SIZE_MD, lineHeight: Sizes.LINE_HEIGHT_MD },
          ]}
        >
          {job.job_description}
        </Text>
      </View>

      {/* Requirements Section
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: Sizes.FONT_SIZE_LG }]}>
          Requirements
        </Text>
        <View style={styles.requirementsList}>
          {requirements.map((req, index) => (
            <View key={index} style={styles.requirementItem}>
              <View style={styles.bullet} />
              <Text
                style={[
                  styles.requirementText,
                  {
                    fontSize: Sizes.FONT_SIZE_MD,
                    lineHeight: Sizes.LINE_HEIGHT_MD,
                  },
                ]}
              >
                {job.requirements}
              </Text>
            </View>
          ))}
        </View>
      </View> */}

      {/* Apply Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.applyButton}>
          <Text
            style={[styles.applyButtonText, { fontSize: Sizes.FONT_SIZE_LG }]}
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
    backgroundColor: Colors.BACKGROUND,
  },
  scrollContent: {
    paddingBottom: height * Sizes.SCROLL_PADDING_SCALE,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Sizes.SCREEN_PADDING,
    paddingTop: Sizes.SPACING_SM,
    paddingBottom: Sizes.SPACING_SM,
    borderBottomWidth: Sizes.BORDER_WIDTH,
    borderBottomColor: Colors.BORDER,
  },

  headerIconButton: {
    padding: Sizes.PADDING_SM,
  },

  headerTitle: {
    fontSize: Sizes.FONT_SIZE_LG,
    fontWeight: "600",
    color: Colors.TEXT_PRIMARY,
  },

  header: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Sizes.SCREEN_PADDING,
    paddingVertical: Sizes.SPACING_XXL,
    borderBottomWidth: Sizes.BORDER_WIDTH,
    borderBottomColor: Colors.BORDER,
  },
  backButton: {
    padding: Sizes.PADDING_SM,
    marginBottom: Sizes.SPACING_MD,
  },
  backButtonText: {
    color: Colors.PRIMARY,
    fontWeight: "600",
  },
  title: {
    fontWeight: "700",
    color: Colors.TEXT_PRIMARY,
    marginBottom: Sizes.SPACING_SM,
  },
  company: {
    fontWeight: "600",
    color: Colors.PRIMARY,
    marginBottom: Sizes.SPACING_XS,
  },
  location: {
    fontWeight: "400",
    color: Colors.TEXT_SECONDARY,
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
    color: Colors.TEXT_TERTIARY,
  },
  salarySection: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Sizes.SCREEN_PADDING,
    paddingVertical: Sizes.SPACING_XL,
    marginTop: Sizes.SPACING_MD,
    borderBottomWidth: Sizes.BORDER_WIDTH,
    borderBottomColor: Colors.BORDER,
  },
  salaryLabel: {
    fontWeight: "500",
    color: Colors.TEXT_SECONDARY,
    marginBottom: Sizes.SPACING_XS,
  },
  salaryAmount: {
    fontWeight: "700",
    color: Colors.TEXT_PRIMARY,
  },
  section: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Sizes.SCREEN_PADDING,
    paddingVertical: Sizes.SPACING_XL,
    marginTop: Sizes.SPACING_MD,
  },
  sectionTitle: {
    fontWeight: "700",
    color: Colors.TEXT_PRIMARY,
    marginBottom: Sizes.SPACING_LG,
  },
  sectionText: {
    fontWeight: "400",
    color: Colors.TEXT_SECONDARY,
  },
  requirementsList: {
    gap: Sizes.SPACING_MD,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.PRIMARY,
    marginTop: 8,
    marginRight: Sizes.SPACING_MD,
  },
  requirementText: {
    flex: 1,
    fontWeight: "400",
    color: Colors.TEXT_SECONDARY,
  },
  buttonContainer: {
    paddingHorizontal: Sizes.SCREEN_PADDING,
    paddingVertical: Sizes.SPACING_XXL,
    marginTop: Sizes.SPACING_MD,
  },
  applyButton: {
    backgroundColor: Colors.PRIMARY,
    height: Sizes.BUTTON_HEIGHT,
    borderRadius: Sizes.BORDER_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontWeight: "600",
    color: Colors.WHITE,
  },
});

export default JobInfoScreen;
