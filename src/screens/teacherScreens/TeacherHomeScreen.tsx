import useAuthStore from "@/src/store/authStore";
import { useTeacherStore } from "@/src/store/teacherStore";
import useBookingStore from "@/src/store/booking";
import { useCourseStore } from "@/src/store/courseStore";
import { useLiveSessionStore } from "@/src/store/liveSessionsStore";
import { useEffect } from "react";
import { View, Text, FlatList, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import StatCard from "@/src/components/StatCard";
import PendingBookingCard from "@/src/components/teacherComponents/PendingBookingCard";
import TeacherCourseCard from "@/src/components/teacherComponents/TeacherCourseCard";
import QuickActionGrid from "@/src/components/QuickActionGrid";

export default function TeacherHomeScreen() {
    const { authUser } = useAuthStore();
    const {
        getTeacher,
        isGettingTeacher,
        teacher,
    } = useTeacherStore();
    const {
        getTeacherBookings,
        isGettingTeacherBookings,
        teacherBookings,
    } = useBookingStore();
    const {
        getTeacherCourses,
        isGettingTeacherCourses,
        teacherCourses,
    } = useCourseStore();
    const {
        getTeacherLiveSessions,
        isGettingTeacherLiveSessions,
        teacherLiveSessions,
    } = useLiveSessionStore();

    useEffect(() => {
        getTeacher();
        getTeacherBookings();
        getTeacherCourses();
        getTeacherLiveSessions();
    }, []);

    const pendingBookings = teacherBookings.filter((b) => b.status === "pending");
    const upcomingSessions = teacherLiveSessions.filter(
        (s) => s.status === "booked"
    );

    const quickActions = [
        { icon: "add-circle-outline" as const, label: "Create Course", route: "/(teacher)/(Library)/(Courses)/CreateCourse/Step1" },
        { icon: "calendar-outline" as const, label: "Calendar", route: "/(teacher)/(Library)/Calendar" },
        { icon: "chatbubble-outline" as const, label: "Chat", route: "/(teacher)/(Chat)" },
        { icon: "card-outline" as const, label: "Subscription", route: "/(teacher)/(Profile)/SubscriptionPlans" },
    ];

    const isLoading = isGettingTeacher || isGettingTeacherBookings || isGettingTeacherCourses || isGettingTeacherLiveSessions;

    if (isLoading && !teacher) {
        return (
            <SafeAreaView className="flex-1 bg-bg-1">
                <View className="flex-1 items-center justify-center gap-3">
                    <Ionicons name="hourglass-outline" size={32} color="#64748b" />
                    <Text className="text-text-weak text-sm">Loading your dashboard...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-bg-1">
            <FlatList
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={
                    <View className="px-4 pb-24 gap-6">
                        {/* Greeting */}
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-text-weak text-sm">Welcome back,</Text>
                                <Text className="text-text-strong text-2xl font-bold">
                                    {authUser?.name?.split(" ")[0]} 👋
                                </Text>
                                {authUser?.subscription?.status === "active" && (
                                    <View className="flex-row items-center gap-1 mt-1">
                                        <Ionicons name="diamond" size={12} color="#8b5cf6" />
                                        <Text className="text-primary text-xs font-semibold">
                                            {authUser.subscription.plan?.title ?? "Pro"} Plan
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Quick Stats */}
                        <View className="flex-row gap-3">
                            <StatCard
                                icon="hourglass-outline"
                                value={pendingBookings.length}
                                label="Pending"
                                color="#f59e0b"
                            />
                            <StatCard
                                icon="book-outline"
                                value={teacherCourses.length}
                                label="Courses"
                                color="#8b5cf6"
                            />
                            <StatCard
                                icon="videocam-outline"
                                value={upcomingSessions.length}
                                label="Sessions"
                                color="#22c55e"
                            />
                        </View>

                        {/* Pending Bookings */}
                        <View className="gap-3">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-text-strong font-bold text-lg">
                                    Pending Bookings
                                </Text>
                                {pendingBookings.length > 0 && (
                                    <Pressable onPress={() => router.push("/(teacher)/Bookings")}>
                                        <Text className="text-primary text-sm font-semibold">See All</Text>
                                    </Pressable>
                                )}
                            </View>
                            {pendingBookings.length === 0 ? (
                                <View className="bg-bg-2 border border-border rounded-2xl p-6 items-center gap-2">
                                    <Ionicons name="checkmark-circle-outline" size={28} color="#64748b" />
                                    <Text className="text-text-weak text-sm text-center">
                                        No pending bookings. All caught up!
                                    </Text>
                                </View>
                            ) : (
                                pendingBookings.slice(0, 3).map((booking) => (
                                    <PendingBookingCard key={booking.id} booking={booking} />
                                ))
                            )}
                        </View>

                        {/* Upcoming Sessions */}
                        <View className="gap-3">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-text-strong font-bold text-lg">
                                    Upcoming Sessions
                                </Text>
                                {upcomingSessions.length > 0 && (
                                    <Pressable
                                        onPress={() => router.push("/(teacher)/(Library)/(Sessions)")}
                                    >
                                        <Text className="text-primary text-sm font-semibold">See All</Text>
                                    </Pressable>
                                )}
                            </View>
                            {upcomingSessions.length === 0 ? (
                                <View className="bg-bg-2 border border-border rounded-2xl p-6 items-center gap-2">
                                    <Ionicons name="videocam-outline" size={28} color="#64748b" />
                                    <Text className="text-text-weak text-sm text-center">
                                        No upcoming sessions scheduled.
                                    </Text>
                                </View>
                            ) : (
                                upcomingSessions.slice(0, 3).map((session) => (
                                    <View
                                        key={session.id}
                                        className="bg-bg-2 border border-border rounded-2xl p-4 flex-row items-center justify-between"
                                    >
                                        <View className="flex-row items-center gap-3 flex-1">
                                            <View className="w-10 h-10 rounded-full bg-green-500/10 items-center justify-center">
                                                <Ionicons name="videocam" size={18} color="#22c55e" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-text-strong font-semibold text-sm" numberOfLines={1}>
                                                    {session.subject}
                                                </Text>
                                                <Text className="text-text-weak text-xs">
                                                    {session.scheduled_date} • {session.scheduled_time}
                                                </Text>
                                            </View>
                                        </View>
                                        {/* <View className="px-3 py-1.5 rounded-full bg-green-500/10">
                                            <Text className="text-green-500 text-[10px] font-semibold">
                                                {session.duration} min
                                            </Text>
                                        </View> */}
                                    </View>
                                ))
                            )}
                        </View>

                        {/* My Courses */}
                        <View className="gap-3">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-text-strong font-bold text-lg">My Courses</Text>
                                {teacherCourses.length > 0 && (
                                    <Pressable
                                        onPress={() => router.push("/(teacher)/(Library)/(Courses)")}
                                    >
                                        <Text className="text-primary text-sm font-semibold">See All</Text>
                                    </Pressable>
                                )}
                            </View>
                            {teacherCourses.length === 0 ? (
                                <View className="bg-bg-2 border border-border rounded-2xl p-6 items-center gap-2">
                                    <Ionicons name="book-outline" size={28} color="#64748b" />
                                    <Text className="text-text-weak text-sm text-center">
                                        You haven't created any courses yet.
                                    </Text>
                                    <Pressable
                                        onPress={() => router.push("/(teacher)/(Library)/(Courses)/CreateCourse/Step1")}
                                        className="bg-primary px-4 py-2 rounded-xl active:scale-95 transition-all duration-200"
                                    >
                                        <Text className="text-white font-semibold text-sm">Create Your First Course</Text>
                                    </Pressable>
                                </View>
                            ) : (
                                <FlatList
                                    data={teacherCourses.slice(0, 5)}
                                    renderItem={({ item }) => <TeacherCourseCard course={item} />}
                                    keyExtractor={(item) => item.id?.toString() ?? ""}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ gap: 12 }}
                                />
                            )}
                        </View>

                        {/* Quick Actions */}
                        <View className="gap-3">
                            <Text className="text-text-strong font-bold text-lg">Quick Actions</Text>
                            <QuickActionGrid actions={quickActions} />
                        </View>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}
