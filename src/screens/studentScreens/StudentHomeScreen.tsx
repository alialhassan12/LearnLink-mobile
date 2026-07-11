import useAuthStore from "@/src/store/authStore";
import { useStudentStore } from "@/src/store/studentStores/studentStore";
import { useEffect } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import StatCard from "@/src/components/StatCard";
import UpcomingSessionCard from "@/src/components/student/UpcomingSessionCard";
import EnrolledCourseCard from "@/src/components/student/EnrolledCourseCard";
import QuickActionGrid from "@/src/components/QuickActionGrid";

export default function StudentHomeScreen() {
    const { authUser } = useAuthStore();
    const {
        getStudent,
        isGettingStudent,
        completed_sessions_count,
        upcomming_sessions_count,
        enrolled_courses_count,
        upcomming_sessions,
        enrolled_courses,
    } = useStudentStore();

    useEffect(() => {
        getStudent();
    }, []);

    const quickActions = [
        { icon: "people-outline" as const, label: "Browse Teachers", route: "/(student)/(Teachers)/Teachers" },
        { icon: "book-outline" as const, label: "Browse Courses", route: "/(student)/(Courses)" },
        { icon: "calendar-outline" as const, label: "My Bookings", route: "/(student)/(Library)/MyBookings" },
        { icon: "chatbubbles-outline" as const, label: "Chat", route: "/(student)/(Chat)" },
    ];

    if (isGettingStudent) {
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
                        <View className="flex-row items-center justify-between pt-2">
                            <View className="flex-1">
                                <Text className="text-text-weak text-sm">Welcome back,</Text>
                                <Text className="text-text-strong text-2xl font-bold">
                                    {authUser?.name?.split(" ")[0]} 👋
                                </Text>
                            </View>
                        </View>

                        {/* Quick Stats */}
                        <View className="flex-row gap-3">
                            <StatCard
                                icon="time-outline"
                                value={upcomming_sessions_count}
                                label="Upcoming"
                                color="#2563eb"
                            />
                            <StatCard
                                icon="book-outline"
                                value={enrolled_courses_count}
                                label="Courses"
                                color="#8b5cf6"
                            />
                            <StatCard
                                icon="checkmark-circle-outline"
                                value={completed_sessions_count}
                                label="Completed"
                                color="#22c55e"
                            />
                        </View>

                        {/* Upcoming Sessions */}
                        <View className="gap-3">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-text-strong font-bold text-lg">
                                    Upcoming Sessions
                                </Text>
                                {upcomming_sessions.length > 0 && (
                                    <Pressable
                                        onPress={() => router.push("/(student)/(Library)/(sessions)/LiveSessions")}
                                    >
                                        <Text className="text-primary text-sm font-semibold">See All</Text>
                                    </Pressable>
                                )}
                            </View>
                            {upcomming_sessions.length === 0 ? (
                                <View className="bg-bg-2 border border-border rounded-2xl p-6 items-center gap-2">
                                    <Ionicons name="calendar-outline" size={28} color="#64748b" />
                                    <Text className="text-text-weak text-sm text-center">
                                        No upcoming sessions. Book a session with a teacher!
                                    </Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={upcomming_sessions.slice(0, 5)}
                                    renderItem={({ item }) => <UpcomingSessionCard booking={item} />}
                                    keyExtractor={(item) => item.id?.toString() ?? ""}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ gap: 12 }}
                                />
                            )}
                        </View>

                        {/* Continue Learning */}
                        <View className="gap-3">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-text-strong font-bold text-lg">
                                    Continue Learning
                                </Text>
                                {enrolled_courses.length > 0 && (
                                    <Pressable
                                        onPress={() => router.push("/(student)/(Library)/Learnings")}
                                    >
                                        <Text className="text-primary text-sm font-semibold">See All</Text>
                                    </Pressable>
                                )}
                            </View>
                            {enrolled_courses.length === 0 ? (
                                <View className="bg-bg-2 border border-border rounded-2xl p-6 items-center gap-2">
                                    <Ionicons name="school-outline" size={28} color="#64748b" />
                                    <Text className="text-text-weak text-sm text-center">
                                        You haven't enrolled in any courses yet.
                                    </Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={enrolled_courses.slice(0, 5)}
                                    renderItem={({ item }) => <EnrolledCourseCard enrollment={item} />}
                                    keyExtractor={(item) => item.id.toString()}
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
