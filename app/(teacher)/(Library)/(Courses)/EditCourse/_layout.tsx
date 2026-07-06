import { Stack } from "expo-router";

export default function EditCourseLayout(){
    return(
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="[CourseId]"/>
        </Stack>
    );
}