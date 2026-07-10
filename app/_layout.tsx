import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import NotificationProvider from "@/src/providers/NotificationProvider";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});


export default function RootLayout() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Stack screenOptions={{ headerShown: false}} ></Stack>
        <Toast />
      </NotificationProvider>
    </ThemeProvider>
  );
}
