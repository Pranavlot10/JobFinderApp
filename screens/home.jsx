import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import axios from "axios";

import * as Colors from "../constants/colors";
import * as Sizes from "../constants/sizes";

import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

// Get screen dimensions for responsive sizing
const { width, height } = Dimensions.get("window");

const JobCard = ({ item, onPress }) => {
  const type = item.job_employment_type || "Other";
  const typeStyle = Colors.JOB_TYPES[type] || Colors.JOB_TYPES.default;

  // console.log(item.job_is_remote);

  return (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {item.job_title}
          </Text>
          <Text style={styles.jobCompany}>{item.employer_name}</Text>
        </View>
        <View
          style={[styles.typeTag, { backgroundColor: typeStyle.background }]}
        >
          <Text style={[styles.typeText, { color: typeStyle.text }]}>
            {type}
          </Text>
        </View>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>
            {item.job_is_remote ? "Remote" : item.job_location || "N/A"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>💰</Text>
          <Text style={styles.salaryText}>
            {item.job_salary || "Not Disclosed"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const docSnap = await getDoc(doc(db, "users", uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPreferredRole(data.preferredRole || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (loadingProfile || !preferredRole) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching jobs for role:", preferredRole);
        const response = await axios.get(
          "https://jsearch.p.rapidapi.com/search",
          {
            params: {
              query: preferredRole,
              page: "1",
              num_pages: "1",
              country: "in",
              date_posted: "all",
            },
            headers: {
              "x-rapidapi-key":
                "2dcac70567mshb4a6263ccc73747p15bda5jsn18f0fa23de9d",
              "x-rapidapi-host": "jsearch.p.rapidapi.com",
            },
          }
        );
        setData(response.data.data);
        console.log("Fetched jobs:", response.data.data?.length);
        console.log("Fetched jobs:", response.data.data[0]);
      } catch (err) {
        setError(err);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [preferredRole, loadingProfile]);

  const filteredJobs = (data || []).filter((job) => {
    const matchesSearch =
      job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.employer_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType
      ? job.job_employment_type?.toLowerCase() === selectedType.toLowerCase()
      : true;

    const matchesLocation = locationFilter
      ? job.job_city?.toLowerCase().includes(locationFilter.toLowerCase())
      : true;

    return matchesSearch && matchesType && matchesLocation;
  });

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];

  const renderJobCard = ({ item }) => (
    <JobCard
      item={item}
      onPress={() => navigation.navigate("JobInfo", { job: item })}
    />
  );

  const clearFilters = () => {
    setSelectedType("");
    setLocationFilter("");
    setFilterModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.openDrawer()}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jobs</Text>
        </View>

        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.subtitle}>
          {loadingProfile
            ? "Loading jobs..."
            : `Find ${preferredRole ? `${preferredRole} ` : ""}jobs`}
        </Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs or companies..."
              placeholderTextColor={Colors.TEXT_TERTIARY}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {(selectedType || locationFilter) && (
          <View style={styles.activeFilters}>
            {selectedType && (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterText}>{selectedType}</Text>
                <TouchableOpacity onPress={() => setSelectedType("")}>
                  <Text style={styles.removeFilter}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            {locationFilter && (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterText}>{locationFilter}</Text>
                <TouchableOpacity onPress={() => setLocationFilter("")}>
                  <Text style={styles.removeFilter}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
        </Text>
      </View>

      <FlatList
        data={filteredJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.job_id}
        contentContainerStyle={styles.jobList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Jobs</Text>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Job Type</Text>
                <View style={styles.filterOptions}>
                  {jobTypes.map((type) => {
                    const typeStyle =
                      Colors.JOB_TYPES[type] || Colors.JOB_TYPES.default;
                    const isSelected = selectedType === type;

                    return (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.filterOption,
                          isSelected && {
                            backgroundColor: Colors.PRIMARY,
                            borderColor: Colors.PRIMARY,
                          },
                        ]}
                        onPress={() =>
                          setSelectedType(type === selectedType ? "" : type)
                        }
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            isSelected && { color: Colors.WHITE },
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Location</Text>
                <TextInput
                  style={styles.locationInput}
                  placeholder="Enter city or 'Remote'"
                  placeholderTextColor={Colors.TEXT_TERTIARY}
                  value={locationFilter}
                  onChangeText={setLocationFilter}
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setFilterModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    paddingHorizontal: Sizes.SCREEN_PADDING,
    paddingTop: 50, // Adjusted for status bar
    paddingBottom: Sizes.SPACING_XL,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: Sizes.BORDER_WIDTH,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Sizes.SPACING_LG,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.BACKGROUND_SECONDARY,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    fontSize: 20,
    color: Colors.TEXT_PRIMARY,
    fontWeight: "600",
  },
  headerTitle: {
    flex: 1,
    fontSize: Sizes.FONT_SIZE_XL,
    fontWeight: "600",
    color: Colors.TEXT_PRIMARY,
    textAlign: "center",
    marginLeft: -40, // offsets the width of the profile button to visually center text
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    fontSize: 20,
    color: Colors.WHITE,
  },
  welcomeText: {
    fontSize: Sizes.FONT_SIZE_MD,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Sizes.SPACING_XS,
  },
  subtitle: {
    fontSize: Sizes.FONT_SIZE_XXXL,
    fontWeight: "700",
    color: Colors.TEXT_PRIMARY,
    marginBottom: Sizes.SPACING_XXL,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.SPACING_MD,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.BACKGROUND_SECONDARY,
    borderRadius: Sizes.BORDER_RADIUS,
    paddingHorizontal: Sizes.PADDING_LG,
    height: Sizes.SEARCH_HEIGHT,
  },
  searchIcon: {
    fontSize: Sizes.FONT_SIZE_LG,
    marginRight: Sizes.SPACING_MD,
    color: Colors.TEXT_TERTIARY,
  },
  searchInput: {
    flex: 1,
    fontSize: Sizes.FONT_SIZE_MD,
    color: Colors.TEXT_PRIMARY,
  },
  filterButton: {
    marginLeft: Sizes.SPACING_MD,
    width: Sizes.BUTTON_HEIGHT,
    height: Sizes.BUTTON_HEIGHT,
    backgroundColor: Colors.PRIMARY,
    borderRadius: Sizes.BORDER_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  filterIcon: {
    fontSize: Sizes.FONT_SIZE_LG,
    color: Colors.WHITE,
  },
  activeFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Sizes.SPACING_SM,
  },
  activeFilterTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
    borderRadius: Sizes.BORDER_RADIUS_LG,
    paddingHorizontal: Sizes.PADDING_MD,
    paddingVertical: Sizes.PADDING_SM,
    marginRight: Sizes.SPACING_SM,
    marginBottom: Sizes.SPACING_XS,
  },
  activeFilterText: {
    color: Colors.WHITE,
    fontSize: Sizes.FONT_SIZE_XS,
    fontWeight: "500",
    marginRight: Sizes.SPACING_SM,
  },
  removeFilter: {
    color: Colors.WHITE,
    fontSize: Sizes.FONT_SIZE_LG,
    fontWeight: "600",
  },
  resultsHeader: {
    paddingHorizontal: Sizes.SCREEN_PADDING,
    paddingVertical: Sizes.PADDING_LG,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: Sizes.BORDER_WIDTH,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  resultsCount: {
    fontSize: Sizes.FONT_SIZE_SM,
    color: Colors.TEXT_SECONDARY,
    fontWeight: "500",
  },
  jobList: {
    padding: Sizes.SCREEN_PADDING,
  },
  jobCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: Sizes.BORDER_RADIUS_LG,
    padding: Sizes.CARD_PADDING,
    marginBottom: Sizes.SPACING_LG,
    shadowColor: Colors.SHADOW_COLOR,
    shadowOffset: Sizes.SHADOW_OFFSET,
    shadowOpacity: Sizes.SHADOW_OPACITY,
    shadowRadius: Sizes.SHADOW_RADIUS,
    elevation: Sizes.ELEVATION,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Sizes.SPACING_LG,
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: Sizes.SPACING_MD,
  },
  jobTitle: {
    fontSize: Sizes.FONT_SIZE_LG,
    fontWeight: "600",
    color: Colors.TEXT_PRIMARY,
    marginBottom: Sizes.SPACING_XS,
    lineHeight: Sizes.LINE_HEIGHT_LG,
  },
  jobCompany: {
    fontSize: Sizes.FONT_SIZE_SM,
    color: Colors.TEXT_SECONDARY,
    fontWeight: "500",
  },
  typeTag: {
    paddingHorizontal: Sizes.PADDING_MD,
    paddingVertical: Sizes.PADDING_SM,
    borderRadius: Sizes.BORDER_RADIUS,
    minWidth: 70,
    alignItems: "center",
  },
  typeText: {
    fontSize: Sizes.FONT_SIZE_XS,
    fontWeight: "600",
  },
  jobDetails: {
    gap: Sizes.SPACING_SM,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    fontSize: Sizes.FONT_SIZE_SM,
    marginRight: Sizes.SPACING_SM,
    width: 20,
  },
  detailText: {
    fontSize: Sizes.FONT_SIZE_SM,
    color: Colors.TEXT_SECONDARY,
    flex: 1,
  },
  salaryText: {
    fontSize: Sizes.FONT_SIZE_SM,
    color: Colors.PRIMARY,
    fontWeight: "600",
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Sizes.SPACING_LG,
  },
  emptyTitle: {
    fontSize: Sizes.FONT_SIZE_LG,
    fontWeight: "600",
    color: Colors.TEXT_PRIMARY,
    marginBottom: Sizes.SPACING_SM,
  },
  emptyText: {
    fontSize: Sizes.FONT_SIZE_SM,
    color: Colors.TEXT_SECONDARY,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.OVERLAY,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: Sizes.BORDER_RADIUS_ROUND,
    borderTopRightRadius: Sizes.BORDER_RADIUS_ROUND,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Sizes.SCREEN_PADDING,
    borderBottomWidth: Sizes.BORDER_WIDTH,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  modalTitle: {
    fontSize: Sizes.FONT_SIZE_XL,
    fontWeight: "600",
    color: Colors.TEXT_PRIMARY,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.BACKGROUND_SECONDARY,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: Sizes.FONT_SIZE_XL,
    color: Colors.TEXT_SECONDARY,
    fontWeight: "400",
  },
  modalBody: {
    flex: 1,
  },
  filterSection: {
    padding: Sizes.SCREEN_PADDING,
    borderBottomWidth: Sizes.BORDER_WIDTH,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  filterLabel: {
    fontSize: Sizes.FONT_SIZE_MD,
    fontWeight: "600",
    color: Colors.TEXT_PRIMARY,
    marginBottom: Sizes.SPACING_LG,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Sizes.SPACING_SM,
  },
  filterOption: {
    backgroundColor: Colors.BACKGROUND_SECONDARY,
    borderRadius: Sizes.BORDER_RADIUS_XL,
    paddingHorizontal: Sizes.PADDING_LG,
    paddingVertical: Sizes.PADDING_MD,
    borderWidth: Sizes.BORDER_WIDTH,
    borderColor: Colors.BORDER,
  },
  filterOptionText: {
    fontSize: Sizes.FONT_SIZE_SM,
    color: Colors.TEXT_PRIMARY,
    fontWeight: "500",
  },
  locationInput: {
    backgroundColor: Colors.BACKGROUND_SECONDARY,
    borderRadius: Sizes.BORDER_RADIUS,
    paddingHorizontal: Sizes.PADDING_LG,
    paddingVertical: Sizes.PADDING_MD,
    fontSize: Sizes.FONT_SIZE_MD,
    color: Colors.TEXT_PRIMARY,
    borderWidth: Sizes.BORDER_WIDTH,
    borderColor: Colors.BORDER,
  },
  modalButtons: {
    flexDirection: "row",
    padding: Sizes.SCREEN_PADDING,
    gap: Sizes.SPACING_MD,
  },
  clearButton: {
    flex: 1,
    paddingVertical: Sizes.PADDING_LG,
    borderRadius: Sizes.BORDER_RADIUS,
    alignItems: "center",
    backgroundColor: Colors.BACKGROUND_SECONDARY,
    borderWidth: Sizes.BORDER_WIDTH,
    borderColor: Colors.BORDER,
  },
  applyButton: {
    flex: 1,
    paddingVertical: Sizes.PADDING_LG,
    borderRadius: Sizes.BORDER_RADIUS,
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
  },
  clearButtonText: {
    fontSize: Sizes.FONT_SIZE_MD,
    color: Colors.TEXT_PRIMARY,
    fontWeight: "600",
  },
  applyButtonText: {
    fontSize: Sizes.FONT_SIZE_MD,
    color: Colors.WHITE,
    fontWeight: "600",
  },
});

export default HomeScreen;
