import useAuthStore from "@/src/store/authStore";
import { useStudentStore } from "@/src/store/studentStores/studentStore";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Text, View, ScrollView, Image, Pressable, Animated } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/src/providers/ThemeProvider";
import CourseCard from "@/src/components/student/CourseCard";
import Skeleton from "@/src/components/Skeleton";

export default function ProfileScreen() {
    const {
        student,
        getStudent,
        isGettingStudent,
        completed_sessions_count,
        upcomming_sessions_count,
        enrolled_courses_count,
        upcomming_sessions,
        enrolled_courses
    } = useStudentStore();
    const { logout, isLoggingout } = useAuthStore();
    const { isDark } = useTheme();

    const primaryColor = isDark ? "#3b82f6" : "#2563eb";

    useEffect(() => {
        getStudent();
    }, []);

    const handleLogout = async () => {
        const loggedout = await logout();
        if (loggedout) {
            router.replace('/(auth)/Login');
        }
    };

    if (isGettingStudent || !student) {
        return <ProfileSkeleton />;
    }

    const joinedDate = student?.user?.created_at ? new Date(student.user.created_at) : new Date();
    const formattedJoinedDate = joinedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    const fullJoinedDateString = joinedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const cards = [
        {
            id: 0,
            title: "Sessions Completed",
            icon: "check-circle",
            value: completed_sessions_count,
            iconBg: "bg-emerald-500/10 ",
            iconColor: "#10b981",
        },
        {
            id: 1,
            title: "Courses Enrolled",
            icon: "layer-group",
            value: enrolled_courses_count,
            iconBg: "bg-blue-500/10 ",
            iconColor: "#3b82f6",
        },
        {
            id: 2,
            title: "Upcoming Sessions",
            icon: "clock",
            value: upcomming_sessions_count,
            iconBg: "bg-amber-500/10",
            iconColor: "#f59e0b",
        }
    ];

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
                        {student?.user?.avatar_url ? (
                            <Image 
                                source={{ uri: student.user.avatar_url }} 
                                className="w-full h-full rounded-full border-4 border-bg-1 shadow-md"
                            />
                        ) : (
                            <View className="w-full h-full rounded-full border-4 border-bg-1 bg-primary flex items-center justify-center shadow-md">
                                <Text className="text-3xl text-white font-bold">
                                    {student?.user?.name?.[0].toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Name details */}
                    <Text className="text-2xl font-black text-text-strong text-center mt-4 tracking-tight">
                        {student?.user?.name}
                    </Text>
                    <Text className="text-primary font-semibold text-base text-center mt-1">
                        {student?.headline || "Aspiring Scholar"}
                    </Text>

                    {/* Badges */}
                    <View className="flex flex-row flex-wrap gap-2 justify-center mt-4">
                        <View className="flex flex-row items-center gap-1.5 px-3 py-1.5 bg-bg-1 rounded-full border border-border shadow-sm">
                            <FontAwesome5 name="calendar-alt" size={11} color={primaryColor} />
                            <Text className="text-text-strong text-xs font-semibold">
                                Joined {formattedJoinedDate}
                            </Text>
                        </View>
                        <View className="flex flex-row items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20 shadow-sm">
                            <Text className="text-primary text-xs font-bold">
                                Student Account
                            </Text>
                        </View>
                    </View>

                    {/* Bio */}
                    <Text className="text-text-weak text-sm leading-relaxed text-center mt-4 px-2">
                        {student?.bio || "No biography provided yet. Add information about your academic interests and goals!"}
                    </Text>
                </View>
            </View>

            {/* Quick Stats Grid */}
            <View className="flex flex-col gap-3 mb-6">
                {cards.map((card) => (
                    <View key={card.id} className="flex flex-row items-center bg-bg-2 border border-border rounded-2xl p-4 shadow-sm">
                        <View className={`p-3.5 rounded-2xl ${card.iconBg} justify-center items-center`}>
                            <FontAwesome5 name={card.icon} size={18} color={card.iconColor} />
                        </View>
                        <View className="ml-4">
                            <Text className="text-2xl font-black text-text-strong">{card.value}</Text>
                            <Text className="text-xs font-bold text-text-weak uppercase tracking-wider mt-0.5">{card.title}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Enrolled Courses Progress */}
            <View className="flex flex-col gap-4 mb-6">
                <View className="flex flex-row justify-between items-center">
                    <View className="flex flex-row items-center gap-2">
                        <FontAwesome5 name="book-open" size={16} color={primaryColor} />
                        <Text className="text-lg font-bold text-text-strong">Enrolled Courses Progress</Text>
                    </View>
                    {enrolled_courses.length > 0 && (
                        <Pressable 
                            onPress={() => router.push("/Learnings" as any)}
                            className="flex flex-row items-center gap-1"
                        >
                            <Text className="text-primary font-bold text-sm">View All</Text>
                            <FontAwesome5 name="chevron-right" size={10} color={primaryColor} />
                        </Pressable>
                    )}
                </View>

                {enrolled_courses.length > 0 ? (
                    <View className="flex flex-col gap-4">
                        {enrolled_courses.slice(0, 2).map((enrollment) => (
                            <CourseCard key={enrollment?.course_id} course={enrollment?.course!} />
                        ))}
                    </View>
                ) : (
                    <View className="flex flex-col justify-center items-center py-8 px-4 border-2 border-dashed border-border rounded-3xl bg-bg-2">
                        <View className="p-3.5 bg-bg-1 rounded-full mb-3 shadow-sm border border-border/50">
                            <FontAwesome5 name="book-open" size={20} color={primaryColor} />
                        </View>
                        <Text className="text-base font-bold text-text-strong">No enrolled courses yet</Text>
                        <Text className="text-xs text-text-weak text-center max-w-xs mt-1 mb-4">
                            Start learning by enrolling in top-rated courses from experts worldwide.
                        </Text>
                        <Pressable 
                            className="bg-primary rounded-xl px-5 py-2.5 active:scale-95"
                            onPress={() => router.push("/(student)/(Courses)" as any)}
                        >
                            <Text className="text-white font-bold text-sm">Explore Courses</Text>
                        </Pressable>
                    </View>
                )}
            </View>

            {/* Upcoming Sessions (Bookings) */}
            <View className="flex flex-col gap-4 mb-6">
                <View className="flex flex-row justify-between items-center">
                    <View className="flex flex-row items-center gap-2">
                        <FontAwesome5 name="calendar-alt" size={16} color={primaryColor} />
                        <Text className="text-lg font-bold text-text-strong">Upcoming Tutoring Sessions</Text>
                    </View>
                    {upcomming_sessions.length > 0 && (
                        <Pressable 
                            onPress={() => router.push("/MyBookings" as any)}
                            className="flex flex-row items-center gap-1"
                        >
                            <Text className="text-primary font-bold text-sm">View Schedule</Text>
                            <FontAwesome5 name="chevron-right" size={10} color={primaryColor} />
                        </Pressable>
                    )}
                </View>

                {upcomming_sessions.filter(b => b.status !== 'rejected').length > 0 ? (
                    <View className="flex flex-col gap-4">
                        {upcomming_sessions.map((booking) => {
                                const borderLeftColor = booking.status === 'approved' ? 'border-l-emerald-500' : 'border-l-amber-500';
                                const badgeBg = booking.status === 'approved' ? 'bg-emerald-500/10' : 'bg-amber-500/10';
                                const badgeTextColor = booking.status === 'approved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400';
                                
                                return (
                                    <View key={booking.id} className={`bg-bg-2 border border-border border-l-4 ${borderLeftColor} rounded-2xl p-4 shadow-sm`}>
                                        <View className="flex flex-row items-center justify-between">
                                            <View className="flex flex-row items-center gap-3 flex-1">
                                                <View className="w-12 h-12 border border-primary shadow-sm rounded-full overflow-hidden">
                                                    {booking?.live_session?.teacher?.user?.avatar_url? (
                                                        <Image 
                                                            source={{ uri: booking?.live_session?.teacher?.user?.avatar_url }} 
                                                            className="w-full h-full"
                                                        />
                                                    ) : (
                                                        <View className="w-full h-full bg-transparent border border-primary flex items-center justify-center shadow-sm">
                                                            <Text className="text-primary font-bold text-base">
                                                                {booking?.live_session?.teacher?.user?.name?.[0].toUpperCase()}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="font-bold text-text-strong text-base" numberOfLines={1}>
                                                        {booking?.live_session?.teacher?.user?.name}
                                                    </Text>
                                                    <Text className="text-xs text-text-weak mt-0.5">
                                                        Subject: <Text className="text-primary font-semibold">{booking?.subject}</Text>
                                                    </Text>
                                                    <View className="flex flex-row flex-wrap items-center gap-2 mt-1.5">
                                                        <View className="flex flex-row items-center gap-1 bg-bg-1 border border-border/50 px-2 py-0.5 rounded-md">
                                                            <FontAwesome5 name="calendar-day" size={10} color={primaryColor} />
                                                            <Text className="text-[10px] font-medium text-text-weak">
                                                                {booking?.scheduled_day}, {booking?.scheduled_date}
                                                            </Text>
                                                        </View>
                                                        <View className="flex flex-row items-center gap-1 bg-bg-1 border border-border/50 px-2 py-0.5 rounded-md">
                                                            <FontAwesome5 name="clock" size={10} color={primaryColor} />
                                                            <Text className="text-[10px] font-medium text-text-weak">
                                                                {booking?.scheduled_time}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>

                                            <View className="items-end gap-1.5 justify-center pl-2">
                                                <Text className="text-base font-black text-text-strong">${booking?.price}</Text>
                                                <View className={`px-2 py-0.5 rounded-full ${badgeBg}`}>
                                                    <Text className={`text-[10px] uppercase font-bold tracking-wider ${badgeTextColor}`}>
                                                        {booking?.status}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                    </View>
                ) : (
                    <View className="flex flex-col justify-center items-center py-8 px-4 border-2 border-dashed border-border rounded-3xl bg-bg-2">
                        <View className="p-3.5 bg-bg-1 rounded-full mb-3 shadow-sm border border-border/50">
                            <FontAwesome5 name="calendar-alt" size={20} color={primaryColor} />
                        </View>
                        <Text className="text-base font-bold text-text-strong">No upcoming sessions</Text>
                        <Text className="text-xs text-text-weak text-center max-w-xs mt-1 mb-4">
                            Book a personalized live tutoring session with expert instructors.
                        </Text>
                        <Pressable 
                            className="bg-primary rounded-xl px-5 py-2.5 active:scale-95"
                            onPress={() => router.push("/(student)/(Teachers)/Teachers" as any)}
                        >
                            <Text className="text-white font-bold text-sm">Find Tutors</Text>
                        </Pressable>
                    </View>
                )}
            </View>

            {/* General Info Card */}
            <View className="flex flex-col gap-4 p-5 border border-border rounded-3xl bg-bg-2 shadow-sm mb-6">
                <View className="flex flex-row items-center gap-2">
                    <FontAwesome5 name="shield-alt" size={16} color={primaryColor} />
                    <Text className="text-base font-bold text-text-strong">General Information</Text>
                </View>
                <View className="flex flex-col gap-3">
                    <View className="flex flex-col gap-1 pb-3 border-b border-border">
                        <Text className="text-[11px] font-semibold text-text-weak uppercase tracking-wider">Email Address</Text>
                        <View className="flex flex-row items-center gap-2 mt-0.5">
                            <FontAwesome5 name="envelope" size={11} color={primaryColor} />
                            <Text className="text-text-strong font-medium truncate">
                                {student?.user?.email}
                            </Text>
                        </View>
                    </View>
                    <View className="flex flex-col gap-1 pb-3 border-b border-border">
                        <Text className="text-[11px] font-semibold text-text-weak uppercase tracking-wider">Account Status</Text>
                        <View className="flex flex-row items-center gap-1.5 mt-0.5">
                            <View className="w-2 h-2 rounded-full bg-emerald-500" />
                            <Text className="text-emerald-600 dark:text-emerald-400 font-bold">
                                Active
                            </Text>
                        </View>
                    </View>
                    <View className="flex flex-col gap-1">
                        <Text className="text-[11px] font-semibold text-text-weak uppercase tracking-wider">Member Since</Text>
                        <Text className="text-text-strong font-medium mt-0.5">
                            {fullJoinedDateString}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Security Settings */}
            <View className="flex flex-col gap-4 p-5 border border-border rounded-3xl bg-bg-2 shadow-sm mb-6">
                <View className="flex flex-row items-center gap-2">
                    <FontAwesome5 name="lock" size={14} color={primaryColor} />
                    <Text className="text-base font-bold text-text-strong">Security Settings</Text>
                </View>
                <Text className="text-text-weak text-xs -mt-1 leading-relaxed">
                    Manage your account credentials and security preferences.
                </Text>
                
                <View className="flex flex-col gap-4 pt-2">
                    {/* Edit Profile */}
                    <View className="flex flex-col gap-2 pb-4 border-b border-border">
                        <Text className="text-sm font-bold text-text-strong">Edit Profile</Text>
                        <Text className="text-text-weak text-xs">Update your profile information.</Text>
                        <Pressable 
                            className="w-full mt-2 h-11 bg-primary rounded-xl justify-center items-center active:scale-95 transition-all duration-200"
                            onPress={() => router.push("/(student)/(Profile)/EditProfile")}
                        >
                            <Text className="text-white font-bold text-sm">Edit Profile</Text>
                        </Pressable>
                    </View>

                    {/* Change Password */}
                    <View className="flex flex-col gap-2 pb-4 border-b border-border">
                        <Text className="text-sm font-bold text-text-strong">Update Password</Text>
                        <Text className="text-text-weak text-xs">Regularly change your password to keep your account secure.</Text>
                        <Pressable className="w-full mt-2 h-11 bg-transparent border border-primary rounded-xl justify-center items-center active:scale-95 transition-all duration-200">
                            <Text className="text-primary font-bold text-sm">Change Password</Text>
                        </Pressable>
                    </View>

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
            </View>
        </ScrollView>
    );
}

const ProfileSkeleton = () => {
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
                <Skeleton className="h-32 w-full" animatedStyle={animatedStyle} />
                <View className="flex flex-col items-center p-6 -mt-16 relative gap-3">
                    <Skeleton className="w-28 h-28 rounded-full border-4 border-bg-1 shadow-md" animatedStyle={animatedStyle} />
                    <Skeleton className="h-6 w-48 rounded-md mt-2" animatedStyle={animatedStyle} />
                    <Skeleton className="h-4 w-32 rounded-md" animatedStyle={animatedStyle} />
                    <View className="flex flex-row gap-2 mt-2">
                        <Skeleton className="h-7 w-28 rounded-full" animatedStyle={animatedStyle} />
                        <Skeleton className="h-7 w-28 rounded-full" animatedStyle={animatedStyle} />
                    </View>
                    <Skeleton className="h-4 w-full rounded-md mt-3" animatedStyle={animatedStyle} />
                    <Skeleton className="h-4 w-5/6 rounded-md" animatedStyle={animatedStyle} />
                </View>
            </View>

            {/* Quick Stats Grid Skeleton */}
            <View className="flex flex-col gap-3 mb-6">
                {[1, 2, 3].map((i) => (
                    <View key={i} className="flex flex-row items-center bg-bg-2 border border-border rounded-2xl p-4 gap-4">
                        <Skeleton className="h-14 w-14 rounded-2xl" animatedStyle={animatedStyle} />
                        <View className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-12 rounded" animatedStyle={animatedStyle} />
                            <Skeleton className="h-4 w-28 rounded" animatedStyle={animatedStyle} />
                        </View>
                    </View>
                ))}
            </View>

            {/* Enrolled Courses Progress Skeleton */}
            <View className="flex flex-col gap-4 mb-6">
                <View className="flex flex-row justify-between items-center">
                    <Skeleton className="h-5 w-44 rounded-md" animatedStyle={animatedStyle} />
                    <Skeleton className="h-4 w-16 rounded-md" animatedStyle={animatedStyle} />
                </View>
                <View className="flex flex-col gap-4">
                    {[1, 2].map((i) => (
                        <View key={i} className="border border-border rounded-2xl overflow-hidden bg-bg-2">
                            <Skeleton className="h-40 w-full" animatedStyle={animatedStyle} />
                            <View className="p-4 gap-2">
                                <Skeleton className="h-5 w-24 rounded-lg" animatedStyle={animatedStyle} />
                                <Skeleton className="h-6 w-3/4 rounded-md mt-1" animatedStyle={animatedStyle} />
                                <View className="flex flex-row gap-2 items-center py-2 border-b border-border/50">
                                    <Skeleton className="h-8 w-8 rounded-full" animatedStyle={animatedStyle} />
                                    <Skeleton className="h-4 w-24 rounded-md" animatedStyle={animatedStyle} />
                                </View>
                                <View className="flex flex-row justify-between items-center mt-2">
                                    <Skeleton className="h-6 w-12 rounded-md" animatedStyle={animatedStyle} />
                                    <Skeleton className="h-9 w-24 rounded-lg" animatedStyle={animatedStyle} />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Upcoming Sessions Skeleton */}
            <View className="flex flex-col gap-4 mb-6">
                <View className="flex flex-row justify-between items-center">
                    <Skeleton className="h-5 w-48 rounded-md" animatedStyle={animatedStyle} />
                    <Skeleton className="h-4 w-24 rounded-md" animatedStyle={animatedStyle} />
                </View>
                <View className="flex flex-col gap-4">
                    {[1, 2].map((i) => (
                        <View key={i} className="border border-border rounded-2xl p-4 bg-bg-2 flex flex-row justify-between items-center">
                            <View className="flex flex-row gap-3 flex-1">
                                <Skeleton className="h-12 w-12 rounded-full" animatedStyle={animatedStyle} />
                                <View className="space-y-1.5 flex-1">
                                    <Skeleton className="h-4 w-32 rounded-md" animatedStyle={animatedStyle} />
                                    <Skeleton className="h-3.5 w-24 rounded-md" animatedStyle={animatedStyle} />
                                    <View className="flex flex-row gap-2 mt-1">
                                        <Skeleton className="h-5 w-28 rounded-md" animatedStyle={animatedStyle} />
                                        <Skeleton className="h-5 w-20 rounded-md" animatedStyle={animatedStyle} />
                                    </View>
                                </View>
                            </View>
                            <View className="space-y-1.5 items-end justify-center pl-2">
                                <Skeleton className="h-5 w-10 rounded-md" animatedStyle={animatedStyle} />
                                <Skeleton className="h-5.5 w-16 rounded-full" animatedStyle={animatedStyle} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};