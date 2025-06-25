import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
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
    urgency: "high",
  },
  {
    id: "2",
    title: "UX Designer",
    company: "Design Co.",
    location: "Remote",
    type: "Contract",
    salary: "$80,000 - $110,000",
    bookmarkedDate: "2024-01-10",
    urgency: "medium",
  },
  {
    id: "3",
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "Full-time",
    salary: "$95,000 - $130,000",
    bookmarkedDate: "2024-01-08",
    urgency: "low",
  },
];

const BookmarkCard = ({ item, onPress, onRemove }) => {
  const typeStyle = Colors.JOB_TYPES[item.type] || Colors.JOB_TYPES.default;
  const urgencyColor =
    {
      high: "#ff4757",
      medium: "#ffa502",
      low: "#2ed573",
    }[item.urgency] || "#6c757d";

  return (
    <TouchableOpacity
      style={[styles.bookmarkCard, { borderLeftColor: urgencyColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.jobInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.jobTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View
              style={[styles.urgencyDot, { backgroundColor: urgencyColor }]}
            />
          </View>
          <Text style={styles.jobCompany}>{item.company}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.7}
        >
          <Text style={styles.removeIcon}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>💰</Text>
            <Text style={styles.detailText}>{item.salary}</Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
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
            {new Date(item.bookmarkedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BookmarksScreen = ({ navigation }) => {
  const handleJobPress = (job) => {
    navigation.navigate("JobDetails", { job });
  };

  const handleRemoveBookmark = (jobId) => {
    console.log("Remove bookmark for job:", jobId);
  };

  const handleGoBack = () => {
    navigation.goBack();
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
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>🔖</Text>
      </View>
      <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
      <Text style={styles.emptyDescription}>
        Save jobs you're interested in to keep track of them easily
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate("JobSearch")}
      >
        <Text style={styles.browseButtonText}>Find Jobs</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.WHITE || "#ffffff"}
      />

      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>My Bookmarks</Text>
          </View>
          <TouchableOpacity style={styles.menuButton} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>⋯</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerBottom}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{bookmarkedJobs.length}</Text>
              <Text style={styles.statLabel}>Saved Jobs</Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={bookmarkedJobs}
        renderItem={renderBookmarkItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND || "#f8f9fa",
  },
  header: {
    backgroundColor: Colors.WHITE || "#ffffff",
    paddingHorizontal: Sizes.PADDING || 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.BACKGROUND || "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    fontWeight: "300",
    color: Colors.TEXT_PRIMARY || "#212529",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.TEXT_PRIMARY || "#212529",
    letterSpacing: -0.5,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.BACKGROUND || "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.TEXT_PRIMARY || "#212529",
  },
  headerBottom: {
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.BACKGROUND || "#f8f9fa",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.PRIMARY || "#007bff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.TEXT_SECONDARY || "#6c757d",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.BORDER || "#e9ecef",
    marginHorizontal: 20,
  },
  listContainer: {
    padding: Sizes.PADDING || 20,
    flexGrow: 1,
  },
  bookmarkCard: {
    backgroundColor: Colors.WHITE || "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  jobInfo: {
    flex: 1,
    marginRight: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.TEXT_PRIMARY || "#212529",
    flex: 1,
    lineHeight: 24,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 8,
  },
  jobCompany: {
    fontSize: 15,
    color: Colors.TEXT_SECONDARY || "#6c757d",
    fontWeight: "600",
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffe0e0",
  },
  removeIcon: {
    fontSize: 20,
    color: "#ff4757",
    fontWeight: "300",
  },
  jobDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  detailText: {
    fontSize: 15,
    color: Colors.TEXT_SECONDARY || "#6c757d",
    fontWeight: "500",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  jobTypeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bookmarkDate: {
    fontSize: 13,
    color: Colors.TEXT_LIGHT || "#adb5bd",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.BACKGROUND || "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.TEXT_PRIMARY || "#212529",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY || "#6c757d",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: Colors.PRIMARY || "#007bff",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: Colors.PRIMARY || "#007bff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  browseButtonText: {
    color: Colors.WHITE || "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default BookmarksScreen;
