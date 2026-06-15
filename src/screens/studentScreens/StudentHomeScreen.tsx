import useAuthStore from "@/src/store/authStore";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudentHomeScreen(){
    const {authUser,logout,isLoggingout}=useAuthStore();
    const handleLogout=async()=>{
        const loggedout=await logout();
        if(loggedout){
            router.replace('/(auth)/Login');
        }
    }
    return(
        <SafeAreaView className="flex-1 w-full" edges={["top","bottom"]}>
            <ScrollView 
                className="px-4" 
                contentContainerStyle={{flexGrow:1}}
                showsVerticalScrollIndicator={false}
            >
                <Pressable onPress={()=>{handleLogout()}}>
                    <Text className="text-md text-text-strong font-bold flex flex-row items-center gap-2">
                        Logout
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}