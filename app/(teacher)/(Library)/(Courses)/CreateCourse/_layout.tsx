import { Stack } from "expo-router";

export default function CreateCourseLayout() {
    return (
        <Stack screenOptions={{ headerShown: false,animation:"none" }}>
        <Stack.Screen name="Step1" />
        <Stack.Screen name="Step2" />
        <Stack.Screen name="Step3" />
        </Stack>
    );
}
