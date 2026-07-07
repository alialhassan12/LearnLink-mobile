import { useTheme } from "@/src/providers/ThemeProvider";
import { Stack } from "expo-router";

export default function LibraryLayout(){
    const {isDark}=useTheme();
    return(
        <Stack screenOptions={{headerShown:false}} >
            <Stack.Screen name="index" />
            <Stack.Screen name="(Courses)" />
            <Stack.Screen name="Calendar"/>
        </Stack>
    );
}