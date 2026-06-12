import useAuthStore from "@/src/store/authStore";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function StudentHomeScreen(){
    const {authUser,logout,isLoggingout}=useAuthStore();
    const handleLogout=async()=>{
        const loggedout=await logout();
        if(loggedout){
            router.replace('/(auth)/Login');
        }
    }
    return(
        <View className="flex-1 items-center justify-center text-text-strong">
            <Text className="text-text-weak">Student Home Page</Text>
            <Text className="text-text-weak">{authUser?.name}</Text>
            <Text className="text-text-weak">{authUser?.role}</Text>

            <Pressable className="bg-red-500 px-4 py-2 rounded-lg" onPress={handleLogout}>
                <Text className="text-white text-center">Logout</Text>
            </Pressable>
        </View>
    );
}