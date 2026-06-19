import { useTheme } from "@/src/providers/ThemeProvider";
import useAuthStore from "@/src/store/authStore";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { RelativePathString, router } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function LibraryScreen() {
    const { authUser } = useAuthStore();
    const { isDark } = useTheme();

    // colour handling
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const bgCard = isDark ? "bg-gray-800" : "bg-white";
    const borderCard = isDark ? "border-gray-700" : "border-gray-200";
    const iconColor=isDark?"#93c5fd":"#3b82f6";

    const cards = [
        { id: 0, label: "My Learnings", icon: "book-open", navigation:"/Learnings" },
        { id: 1, label: "My Bookings", icon: "calendar", navigation:"/MyBookings" },
        { id: 2, label: "Live Sessions", icon: "video", navigation:"/LiveSessions" },
    ];

    return (
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
        </View>

        <View className="-mx-2 flex flex-wrap">
            {cards.map((card) => (
                <Pressable
                    key={card.id}
                    className="w-full sm:w-1/2 p-2 group"
                    onPress={()=>router.push(card.navigation as RelativePathString)}
                >
                    <View
                        className={`${bgCard} ${borderCard} border rounded-xl p-5 flex flex-col items-center justify-center group-active:scale-95 group-active:opacity-80 transition-all duration-200`}
                    >
                        <FontAwesome5 name={card.icon} size={34} color={iconColor} />
                        <Text className="mt-3 text-xl font-semibold text-text-strong">
                            {card.label}
                        </Text>
                    </View>
                </Pressable>
            ))}
        </View>

        </ScrollView>
    );
}