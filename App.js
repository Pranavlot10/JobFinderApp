import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthWrapper from "./components/AuthWrapper";
import { Provider } from "react-redux";
import { store } from "./redux/store";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AuthWrapper />
        <StatusBar style="auto" />
      </Provider>
    </GestureHandlerRootView>
  );
}
