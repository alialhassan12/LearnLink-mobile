import useAuthStore from "@/src/store/authStore";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home(){
    const {authUser,logout,isLoggingout}=useAuthStore();
    const handleLogout=async()=>{
        const loggedout=await logout();
        if(loggedout){
            router.replace('/(auth)/Login'); 
        }
    }
    return(
        <View>
            <Text>Student Home Page</Text>
            <Text>{authUser?.name}</Text>
            <Text>{authUser?.role}</Text>

            <Pressable className="bg-red-500 px-4 py-2 rounded-lg" onPress={handleLogout}>
                <Text className="text-white text-center">Logout</Text>
            </Pressable>
        </View>
    );
}