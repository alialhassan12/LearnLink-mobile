import { useTheme } from "@/src/providers/ThemeProvider";
import useAuthStore from "@/src/store/authStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { RelativePathString, router } from "expo-router";
import { View, Text, ScrollView, Image, Pressable } from "react-native";

export default function LibraryIndexScreen(){
    const {authUser}=useAuthStore();
    const { isDark } = useTheme();
    
    // colour handling
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const bgCard = isDark ? "bg-gray-800" : "bg-white";
    const borderCard = isDark ? "border-gray-700" : "border-gray-200";
    const iconColor=isDark?"#93c5fd":"#3b82f6";

    const cards = [
        { id: 0, label: "My Courses", icon: "graduation-cap", navigation:"/(Courses)",img:require("../../../assets/images/coursesCardBg.webp"),description:"Manage curriculum & content"},
        { id: 1, label: "My Sessions", icon: "video", navigation:"/(Sessions)",img:require("../../../assets/images/sessionCardBg.png"),description:"Schedule & live teaching" },
    ];

    return(
        <ScrollView
            className="px-4 w-full"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            <View className="flex flex-row flex-wrap items-center gap-4 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl mb-6">
                {!authUser?.avatar_url ? (
                    <View className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
                        <FontAwesome5 name="user" size={24} color={strongText} />
                    </View>
                ) : (
                    <Image
                        source={{ uri: authUser.avatar_url}}
                        className="w-16 h-16 rounded-full border-2 border-primary"
                    />
                )}
                <Text className="text-xl font-bold text-text-strong">
                    Welcome back, {authUser?.name}
                </Text>
                <Text className="text-text-strong font-bold text-2xl mt-4">Instructor Library</Text>
            </View>
            <View className="-mx-2 flex flex-wrap">
                {cards.map((card)=>{
                    return(
                        <Pressable
                            key={card.id}
                            className="w-full sm:w-1/2 p-2 group"
                            onPress={()=>{router.push(card.navigation as RelativePathString)}}
                        >
                            <View className={`relative ${borderCard} border rounded-xl h-48 overflow-hidden flex flex-col items-center justify-center group-active:scale-95 group-active:opacity-80 transition-all duration-200`}>
                                <Image
                                    source={card.img}
                                    className="absolute inset-0 w-full h-full group-active:opacity-60 group-active:scale-110 transition-all duration-200"
                                    resizeMode="cover"
                                />
                                <FontAwesome5 name={card.icon} size={24} color={"#fff"} />
                                <View className="mt-3 items-center">
                                    <Text className="text-xl font-semibold text-white">
                                        {card.label}
                                    </Text>
                                    <Text className="text-md font-light text-white">
                                        {card.description}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    );
                })}
            </View>
        </ScrollView>
    );
}