import useAuthStore from "@/src/store/authStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function TeacherHomeScreen(){
    const { logout, isLoggingout } = useAuthStore();
    const handleLogout = async () => {
        const loggedout = await logout();
        if (loggedout) {
            router.replace('/(auth)/Login');
        }
    };

    return(
        <View>
            {/* Logout */}
            <View className="flex flex-col gap-2">
                <Text className="text-sm font-bold text-text-strong">Logout</Text>
                <Text className="text-text-weak text-xs">Logout of your account.</Text>
                <Pressable 
                    className="w-full mt-2 h-11 bg-red-600 rounded-xl justify-center items-center active:scale-95 transition-all duration-200"
                    onPress={handleLogout}
                    disabled={isLoggingout}
                >
                    {isLoggingout ? (
                        <View className="flex flex-row items-center gap-2">
                            <ActivityIndicator size="small" color="#fff" />
                            <Text className="text-white font-bold text-sm">Logging out...</Text>
                        </View>
                    ) : (
                        <View className="flex flex-row items-center gap-2">
                            <FontAwesome5 name="sign-out-alt" size={14} color="#fff" />
                            <Text className="text-white font-bold text-sm">Logout</Text>
                        </View>
                    )}
                </Pressable>
            </View>
        </View>
    );
}