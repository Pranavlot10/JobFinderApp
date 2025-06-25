import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as Colors from "../constants/colors";
import * as Sizes from "../constants/sizes";

// Sample bookmarked jobs data
const bookmarkedJobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Tech Corp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    bookmarkedDate: "2024-01-15",
  },
  {
    id: "3",
    title: "UX Designer",
    company: "Design Co.",
    location: "Remote",
    type: "Contract",
    salary: "$80,000 - $110,000",
    bookmarkedDate: "2024-01-10",
  },
];

const BookmarkCard = ({ item, onPress, onRemove }) => {
  const typeStyle = Colors.JOB_TYPES[item.type] || Colors.JOB_TYPES.default;

  return (
    <TouchableOpacity
      style={styles.bookmarkCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.jobCompany}>{item.company}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.7}
        >
          <Text style={styles.removeIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>💰</Text>
          <Text style={styles.detailText}>{item.salary}</Text>
        </View>
        <View style={styles.detailRow}>
          <View
            style={[
              styles.jobTypeTag,
              { backgroundColor: typeStyle.backgroundColor },
            ]}
          >
            <Text style={[styles.jobTypeText, { color: typeStyle.color }]}>
              {item.type}
            </Text>
          </View>
          <Text style={styles.bookmarkDate}>
            Saved on {new Date(item.bookmarkedDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BookmarksScreen = ({ navigation }) => {
  const handleJobPress = (job) => {
    // Navigate to job details screen
    navigation.navigate("JobDetails", { job });
  };

  const handleRemoveBookmark = (jobId) => {
    // Handle bookmark removal logic here
    console.log("Remove bookmark for job:", jobId);
    // In a real app, you would update the state/context to remove the bookmark
  };

  const renderBookmarkItem = ({ item }) => (
    <BookmarkCard
      item={item}
      onPress={() => handleJobPress(item)}
      onRemove={() => handleRemoveBookmark(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔖</Text>
      <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
      <Text style={styles.emptyDescription}>
        Jobs you bookmark will appear here for easy access
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate("JobSearch")}
      >
        <Text style={styles.browseButtonText}>Browse Jobs</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookmarks</Text>
        <Text style={styles.headerSubtitle}>
          {bookmarkedJobs.length} job{bookmarkedJobs.length !== 1 ? "s" : ""}{" "}
          saved
        </Text>
      </View>

      <FlatList
        data={bookmarkedJobs}
        renderItem={renderBookmarkItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND || "#f8f9fa",
  },
  header: {
    paddingHorizontal: Sizes.PADDING || 20,
    paddingTop: Sizes.PADDING || 20,
    paddingBottom: 16,
    backgroundColor: Colors.WHITE || "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER || "#e9ecef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.TEXT_PRIMARY || "#212529",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY || "#6c757d",
  },
  listContainer: {
    padding: Sizes.PADDING || 20,
    flexGrow: 1,
  },
  bookmarkCard: {
    backgroundColor: Colors.WHITE || "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.BORDER || "#e9ecef",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.TEXT_PRIMARY || "#212529",
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY || "#6c757d",
    fontWeight: "500",
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.DANGER_LIGHT || "#fff5f5",
  },
  removeIcon: {
    fontSize: 16,
  },
  jobDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY || "#6c757d",
    flex: 1,
  },
  jobTypeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 12,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  bookmarkDate: {
    fontSize: 12,
    color: Colors.TEXT_LIGHT || "#adb5bd",
    fontStyle: "italic",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.TEXT_PRIMARY || "#212529",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY || "#6c757d",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  browseButton: {
    backgroundColor: Colors.PRIMARY || "#007bff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: Colors.WHITE || "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default BookmarksScreen;
