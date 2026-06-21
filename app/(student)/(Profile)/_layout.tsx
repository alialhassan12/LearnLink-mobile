import { Stack } from "expo-router";

export default function ProfileLayout(){
    return <>
    <Stack screenOptions={{
        headerShown: false,
    }}>
        <Stack.Screen name="Profile" />
        <Stack.Screen name="EditProfile" />
    </Stack>
    </>
}