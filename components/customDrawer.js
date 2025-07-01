// components/CustomDrawer.js
import { View, Text, StyleSheet, Switch } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/themeSlice"; // adjust path as needed

const CustomDrawer = (props) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      {/* Theme toggle switch */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={() => dispatch(toggleTheme())}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CustomDrawer;
