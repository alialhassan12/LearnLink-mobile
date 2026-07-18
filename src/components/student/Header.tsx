import useAuthStore from "@/src/store/authStore";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";


import { useTheme } from "@/src/providers/ThemeProvider";
import ToggleThemeButton from "../ToggleThemeButton";
import { router } from "expo-router";

export default function Header(){
    const {authUser}=useAuthStore();
    const { isDark } = useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";

    return(
        <SafeAreaView className="flex flex-row items-center justify-between" edges={['top']}>
            <View className="flex flex-row justify-between items-center w-full px-4 py-4 border-b border-border mb-4">
                {/* logo */}
                <View className="flex flex-row items-center gap-2">
                    <FontAwesome5 name="graduation-cap" size={28} color={primaryColor} />
                    <Text className="text-2xl font-bold text-text-strong">LearnLink</Text>
                </View>

                <View className="flex flex-row items-center gap-4">
                    {/* theme toggle */}
                    {/* <ToggleThemeButton /> */}

                    {/* notification */}
                    <TouchableOpacity onPress={()=>router.push("/Notifications")}>
                        <FontAwesome5 name="bell" size={24} color={primaryColor} />
                    </TouchableOpacity>

                    {/* avatar */}
                    <View>
                        {
                            authUser?.avatar_url ? (
                                <View className="w-10 h-10 rounded-full overflow-hidden">
                                    <Image source={{uri:authUser?.avatar_url}} className="w-full h-full"/>
                                </View>
                            ) : (
                                <View className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-400/20 border border-border ">
                                    <Text className="text-text-weak font-bold text-sm">{authUser?.name?.charAt(0).toUpperCase()}</Text>
                                </View>
                            )
                        }
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
