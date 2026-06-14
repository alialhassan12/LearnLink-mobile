import { Stack } from "expo-router";

export default function TeachersLayout(){
    return (
        <Stack screenOptions={{ headerShown: false}}>
            <Stack.Screen name="Teachers" />
            <Stack.Screen name="TeacherProfile"  />
        </Stack>
    );
}