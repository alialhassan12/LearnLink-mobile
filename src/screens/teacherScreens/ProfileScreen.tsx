import { useTeacherStore } from "@/src/store/teacherStore";
import { useEffect, useRef } from "react";
import { ScrollView, View, Text, Image, Pressable, Animated } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/src/providers/ThemeProvider";
import Skeleton from "@/src/components/Skeleton";
import { router } from "expo-router";

export default function ProfileScreen() {
    const { teacher, getTeacher, isGettingTeacher } = useTeacherStore();
    const { isDark } = useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";

    useEffect(() => {
        getTeacher();
    }, []);

    if (isGettingTeacher || !teacher) {
        return <ProfileScreenSkeleton />;
    }

    return (
        <ScrollView
            className="flex-1 w-full bg-bg-1 px-4"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Banner & Basic Info Header */}
            <View className="relative bg-bg-2 border border-border rounded-3xl overflow-hidden mb-6 shadow-sm">
                {/* Profile Header Content */}
                <View className="flex flex-col items-center p-6 relative">
                    {/* Avatar */}
                    <View className="relative h-32 w-32">
                        {teacher?.user?.avatar_url ? (
                            <Image 
                                source={{ uri: teacher.user.avatar_url }} 
                                className="w-full h-full rounded-full border-4 border-bg-1 shadow-md"
                            />
                        ) : (
                            <View className="w-full h-full rounded-full border-4 border-bg-1 bg-primary flex items-center justify-center shadow-md">
                                <Text className="text-3xl text-white font-bold">
                                    {teacher?.user?.name?.[0]?.toUpperCase() || "T"}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Name details */}
                    <Text className="text-2xl font-black text-text-strong text-center mt-4 tracking-tight">
                        Dr. {teacher?.user?.name}
                    </Text>
                    <Text className="text-primary font-semibold text-base text-center mt-1">
                        {teacher?.headline || "Expert Instructor"}
                    </Text>

                    {/* Badges / Contact Info */}
                    <View className="flex flex-col gap-2 items-center mt-4 w-full px-2">
                        <View className="flex flex-row items-center gap-1.5 px-3 py-1.5 bg-bg-1 rounded-full border border-border shadow-sm">
                            <FontAwesome5 name="envelope" size={11} color={primaryColor} />
                            <Text className="text-text-strong text-xs font-semibold">
                                {teacher?.user?.email}
                            </Text>
                        </View>
                        {teacher?.location ? (
                            <View className="flex flex-row items-center gap-1.5 px-3 py-1.5 bg-bg-1 rounded-full border border-border shadow-sm">
                                <FontAwesome5 name="map-marker-alt" size={11} color={primaryColor} />
                                <Text className="text-text-strong text-xs font-semibold">
                                    {teacher.location}
                                </Text>
                            </View>
                        ) : null}
                        <View className="flex flex-row items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full border border-primary shadow-sm mt-1">
                            <Text className="text-primary text-xs font-bold">
                                Teacher Account
                            </Text>
                        </View>
                    </View>

                    {/* Edit Profile Button */}
                    <Pressable 
                        className="w-full mt-5 h-11 bg-primary rounded-xl justify-center items-center active:scale-95 transition-all duration-200 shadow-sm"
                        onPress={() => router.push("/(teacher)/(Profile)/EditProfile")}
                    >
                        <Text className="text-white font-bold text-sm">Edit Profile</Text>
                    </Pressable>
                    {/* subscription button */}
                    <Pressable 
                        className="w-full mt-5 h-11 bg-primary rounded-xl justify-center items-center active:scale-95 transition-all duration-200 shadow-sm"
                        onPress={() => router.push("/(teacher)/(Profile)/SubscriptionPlans")}
                    >
                        <Text className="text-white font-bold text-sm">Upgrade Subscription</Text>
                    </Pressable>
                </View>
            </View>

            {/* About / Bio Card */}
            <View className="flex flex-col gap-4 p-5 border border-border rounded-3xl bg-bg-2 shadow-sm mb-6">
                <View className="flex flex-row items-center gap-2">
                    <FontAwesome5 name="book-open" size={16} color={primaryColor} />
                    <Text className="text-base font-bold text-text-strong">About me / Bio</Text>
                </View>
                <Text className="text-text-weak text-sm leading-relaxed">
                    {teacher?.bio || "No biography provided yet. Add information about your education, credentials, and teaching philosophy!"}
                </Text>
            </View>

            {/* Languages & Subjects Container */}
            <View className="flex flex-col gap-4 mb-6">
                {/* Languages Card */}
                <View className="flex flex-col gap-3 p-5 border border-border rounded-3xl bg-bg-2 shadow-sm">
                    <View className="flex flex-row items-center gap-2">
                        <FontAwesome5 name="language" size={16} color={primaryColor} />
                        <Text className="text-base font-bold text-text-strong">Languages</Text>
                    </View>
                    <Text className="text-text-weak text-sm leading-relaxed">
                        {teacher?.languages && teacher.languages.length > 0
                            ? teacher.languages.join(", ")
                            : "No languages listed"}
                    </Text>
                </View>

                {/* Subjects Card */}
                <View className="flex flex-col gap-3 p-5 border border-border rounded-3xl bg-bg-2 shadow-sm">
                    <View className="flex flex-row items-center gap-2">
                        <FontAwesome5 name="graduation-cap" size={16} color={primaryColor} />
                        <Text className="text-base font-bold text-text-strong">Subjects</Text>
                    </View>
                    <Text className="text-text-weak text-sm leading-relaxed">
                        {teacher?.subjects && teacher.subjects.length > 0
                            ? teacher.subjects.join(", ")
                            : "No subjects listed"}
                    </Text>
                </View>
            </View>

            {/* Hourly Rate Card */}
            <View className="flex flex-col gap-4 p-5 border border-border rounded-3xl bg-bg-2 shadow-sm mb-6">
                <View className="flex flex-row items-center gap-2">
                    <FontAwesome5 name="dollar-sign" size={16} color={primaryColor} />
                    <Text className="text-base font-bold text-text-strong">Session Rates</Text>
                </View>
                
                <View className="flex flex-col gap-3 mt-1 p-4 border border-border rounded-2xl bg-bg-1/50">
                    <View className="flex flex-row items-center gap-2">
                        <FontAwesome5 name="user" size={12} color={primaryColor} />
                        <Text className="text-text-strong font-bold text-sm">1-on-1 Sessions</Text>
                    </View>
                    <View className="flex flex-row items-center gap-2 mt-1">
                        <Text className="text-text-strong font-black text-xl">$</Text>
                        <View className="px-3 py-1.5 rounded-lg bg-bg-1 border border-border min-w-[80px] items-center justify-center shadow-sm">
                            <Text className="text-text-strong font-black text-lg">
                                {teacher?.hourly_rate ? `${teacher.hourly_rate}` : "Not Set"}
                            </Text>
                        </View>
                        <Text className="text-text-weak font-medium text-sm">/ hour</Text>
                    </View>
                </View>
            </View>

            {/* Weekly Availability Card */}
            <View className="flex flex-col gap-4 p-5 border border-border rounded-3xl bg-bg-2 shadow-sm mb-6">
                <View className="flex flex-row items-center gap-2">
                    <FontAwesome5 name="calendar-alt" size={16} color={primaryColor} />
                    <Text className="text-base font-bold text-text-strong">Weekly Availability</Text>
                </View>

                {teacher?.availabilities && teacher.availabilities.length > 0 ? (
                    <View className="flex flex-row flex-wrap gap-3">
                        {teacher.availabilities.map((avail, index) => (
                            <View 
                                key={index} 
                                className="w-[47%] p-3 rounded-2xl bg-bg-1/50 border border-border flex flex-col items-center justify-center"
                            >
                                <Text className="text-xs font-black text-primary uppercase tracking-wider">
                                    {avail.day_of_week}
                                </Text>
                                <Text className="text-xs text-text-strong font-semibold mt-1">
                                    {avail.start_time} - {avail.end_time}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text className="text-text-weak text-sm italic mt-1">
                        No availability set yet.
                    </Text>
                )}
            </View>
        </ScrollView>
    );
}

const ProfileScreenSkeleton = () => {
    const shimmer = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmer, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const animatedStyle = {
        opacity: shimmer.interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 0.9],
        }),
    };

    return (
        <ScrollView
            className="flex-1 w-full bg-bg-1 px-4"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 120, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Card Skeleton */}
            <View className="relative border border-border rounded-3xl bg-bg-2 overflow-hidden mb-6">
                <View className="flex flex-col items-center p-6 relative gap-3">
                    <Skeleton className="w-24 h-24 rounded-full border-4 border-bg-1 shadow-md" animatedStyle={animatedStyle} />
                    <Skeleton className="h-6 w-48 rounded-md mt-2" animatedStyle={animatedStyle} />
                    <Skeleton className="h-4 w-32 rounded-md" animatedStyle={animatedStyle} />
                    <Skeleton className="h-4 w-40 rounded-md" animatedStyle={animatedStyle} />
                    <Skeleton className="h-10 w-full rounded-xl mt-3" animatedStyle={animatedStyle} />
                </View>
            </View>

            {/* Bio Skeleton */}
            <View className="bg-bg-2 border border-border rounded-3xl p-5 mb-6 gap-3">
                <Skeleton className="h-6 w-32 rounded-md" animatedStyle={animatedStyle} />
                <Skeleton className="h-4 w-full rounded-md" animatedStyle={animatedStyle} />
                <Skeleton className="h-4 w-5/6 rounded-md" animatedStyle={animatedStyle} />
            </View>

            {/* Languages & Subjects Skeleton */}
            <View className="flex flex-col gap-4 mb-6">
                <View className="bg-bg-2 border border-border rounded-3xl p-5 gap-3">
                    <Skeleton className="h-6 w-32 rounded-md" animatedStyle={animatedStyle} />
                    <Skeleton className="h-4 w-1/2 rounded-md" animatedStyle={animatedStyle} />
                </View>
                <View className="bg-bg-2 border border-border rounded-3xl p-5 gap-3">
                    <Skeleton className="h-6 w-32 rounded-md" animatedStyle={animatedStyle} />
                    <Skeleton className="h-4 w-1/2 rounded-md" animatedStyle={animatedStyle} />
                </View>
            </View>

            {/* Hourly Rate Skeleton */}
            <View className="bg-bg-2 border border-border rounded-3xl p-5 mb-6 gap-3">
                <Skeleton className="h-6 w-32 rounded-md" animatedStyle={animatedStyle} />
                <Skeleton className="h-16 w-full rounded-2xl" animatedStyle={animatedStyle} />
            </View>

            {/* Availability Skeleton */}
            <View className="bg-bg-2 border border-border rounded-3xl p-5 mb-6 gap-3">
                <Skeleton className="h-6 w-36 rounded-md" animatedStyle={animatedStyle} />
                <View className="flex flex-row flex-wrap gap-3 justify-between">
                    <Skeleton className="h-14 w-[47%] rounded-xl" animatedStyle={animatedStyle} />
                    <Skeleton className="h-14 w-[47%] rounded-xl" animatedStyle={animatedStyle} />
                </View>
            </View>
        </ScrollView>
    );
};