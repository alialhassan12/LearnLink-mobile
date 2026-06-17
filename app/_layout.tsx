import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { ThemeProvider } from "@/src/providers/ThemeProvider";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});


export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false}} ></Stack>
      <Toast />
    </ThemeProvider>
  );
}
