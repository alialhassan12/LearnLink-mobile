import { Stack } from "expo-router";

export default function LiveSessionsLayout(){
    return(
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="LiveSessions"/>
            <Stack.Screen name="SessionDetails"/>
            <Stack.Screen name="SessionRoom"/>
        </Stack>
    );
}