import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthWrapper from "./components/AuthWrapper"; // 👈 Import the new wrapper

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthWrapper />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
