import type { user } from "@/src/@types/user";
import MessageButton from "@/src/components/MessageButton";
import Skeleton from "@/src/components/Skeleton";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useLiveSessionStore } from "@/src/store/liveSessionsStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function LiveSessionsScreen() {
    const { isDark } = useTheme();
    const primaryColor = isDark ? "#818cf8" : "#4338F2";

    const {
        teacherLiveSessions,
        isGettingTeacherLiveSessions,
        getTeacherLiveSessions,
    } = useLiveSessionStore();
    const [filterTabs, setFilterTabs] = useState<string>("booked");

    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        getTeacherLiveSessions();
    }, [getTeacherLiveSessions]);

    const filteredSessions = teacherLiveSessions?.filter(
        (s) => s.status === filterTabs,
    );

    const filters = ["booked", "completed", "cancelled"];
    const filterLabels: Record<string, string> = {
        booked: "Scheduled",
        completed: "Completed",
        cancelled: "Cancelled",
    };

    const cards = [
        {
        id: 1,
        title: "Upcoming Sessions",
        value: teacherLiveSessions.filter(
            (session) => session.status === "booked",
        ).length,
        icon: "timer-outline",
        },
        {
        id: 2,
        title: "Completed Sessions",
        value: teacherLiveSessions.filter(
            (session) => session.status === "completed",
        ).length,
        icon: "checkmark-circle-outline",
        },
        {
        id: 3,
        title: "Today's Sessions",
        value: teacherLiveSessions.filter(
            (session) =>
            new Date(session.scheduled_date).toDateString() ===
            new Date().toDateString(),
        ).length,
        icon: "calendar",
        },
    ];

    const getStatusBadgeClasses = (status: string) => {
        switch (status) {
        case "booked":
            return "bg-blue-500/10 border border-blue-500/20";
        case "completed":
            return "bg-emerald-500/10 border border-emerald-500/20";
        case "cancelled":
            return "bg-red-500/10 border border-red-500/20";
        default:
            return "bg-gray-500/10 border border-gray-500/20";
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status) {
        case "booked":
            return "text-blue-500";
        case "completed":
            return "text-emerald-500";
        case "cancelled":
            return "text-red-500";
        default:
            return "text-gray-500";
        }
    };

    const getSessionBorderColor = (status: string) => {
        switch (status) {
        case "booked":
            return "border-l-blue-500";
        case "completed":
            return "border-l-emerald-500";
        case "cancelled":
            return "border-l-red-500";
        default:
            return "border-l-gray-500";
        }
    };

    if (isGettingTeacherLiveSessions) {
        return <LiveSessionsScreenSkeleton />;
    }

    return (
        <ScrollView
        ref={scrollRef}
        className="px-4 w-full"
        contentContainerStyle={{ paddingBottom: 100, gap: 16 }}
        showsVerticalScrollIndicator={false}
        >
        <View className="mt-4 flex-col gap-1">
            <Text className="text-3xl font-bold text-text-strong">
            Live Sessions
            </Text>
            <Text className="text-lg font-light text-text-weak">
            Keep your sessions organized and follow up with students instantly.
            </Text>
        </View>

        <ScrollView
            className="flex-row gap-2 w-full"
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
        >
            {cards.map((card) => (
            <View
                key={card.id}
                className="flex-1 flex-row items-center gap-3 rounded-2xl border border-border bg-bg-2 px-4 py-4"
            >
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Ionicons
                    name={card.icon as any}
                    size={18}
                    color={primaryColor}
                />
                </View>
                <View className="flex-1">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-weak">
                    {card.title}
                </Text>
                <Text className="text-xl font-bold text-text-strong">
                    {card.value}
                </Text>
                </View>
            </View>
            ))}
        </ScrollView>

        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
        >
            {filters.map((filter) => (
            <TouchableOpacity
                key={filter}
                activeOpacity={0.8}
                onPress={() => setFilterTabs(filter)}
                className={`min-w-[110px] items-center justify-center rounded-full border px-5 py-2 ${filter === filterTabs ? "border-primary bg-primary" : "border-border bg-bg-2"}`}
            >
                <Text
                className={`${filter === filterTabs ? "text-white" : "text-text-strong"} font-bold`}
                >
                {filterLabels[filter]}
                </Text>
            </TouchableOpacity>
            ))}
        </ScrollView>

        {filteredSessions?.length === 0 ? (
            <View className="flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-bg-2 py-20">
            <View className="items-center gap-4">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Ionicons
                    name="videocam-off-outline"
                    size={32}
                    color={primaryColor}
                />
                </View>
                <View className="items-center gap-1">
                <Text className="text-lg font-bold text-text-strong">
                    No {filterLabels[filterTabs]} Sessions
                </Text>
                <Text className="w-64 text-center text-text-weak">
                    {filterTabs === "booked"
                    ? "You do not have any scheduled sessions right now."
                    : `You don't have any ${filterLabels[filterTabs].toLowerCase()} sessions yet.`}
                </Text>
                </View>
            </View>
            </View>
        ) : (
            <View className="mt-2 flex-col gap-3">
            {filteredSessions?.map((session) => (
                <View
                key={session.id}
                className={`rounded-2xl border-l-4 bg-bg-2 p-4 ${getSessionBorderColor(session.status)}`}
                >
                <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1 flex-row gap-3">
                    {session.student?.user?.avatar_url ? (
                        <Image
                        source={{ uri: session.student.user.avatar_url }}
                        className="h-14 w-14 rounded-full"
                        resizeMode="cover"
                        />
                    ) : (
                        <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
                        <Text className="text-lg font-bold text-white">
                            {session.student?.user?.name?.[0] ?? "S"}
                        </Text>
                        </View>
                    )}
                    <View className="flex-1">
                        <Text className="text-base font-semibold text-text-strong">
                        {session.student?.user?.name ?? "Student"}
                        </Text>
                        <View className="mt-1 flex-row flex-wrap items-center gap-2">
                        <Text className="text-sm text-text-weak">
                            Subject:{" "}
                            <Text className="font-semibold text-primary">
                            {session.subject ?? "Live session"}
                            </Text>
                        </Text>
                        <View
                            className={`rounded-full px-2 py-1 ${getStatusBadgeClasses(session.status)}`}
                        >
                            <Text
                            className={`text-[10px] font-bold uppercase tracking-[0.2em] ${getStatusTextColor(session.status)}`}
                            >
                            {session.status}
                            </Text>
                        </View>
                        </View>
                    </View>
                    </View>
                </View>

                <View className="mt-4 flex-row flex-wrap items-center gap-4">
                    <View className="flex-row items-center gap-2">
                    <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                    <Text className="text-sm font-semibold text-text-weak">
                        {session.scheduled_day}, {session.scheduled_date}
                    </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                    <Ionicons name="time-outline" size={14} color="#9ca3af" />
                    <Text className="text-sm font-semibold text-text-weak">
                        {session.scheduled_time}
                    </Text>
                    </View>
                </View>

                {session.student_note ? (
                    <Text className="mt-3 text-sm leading-6 text-text-weak">
                    {session.student_note}
                    </Text>
                ) : (
                    <Text className="mt-3 text-sm leading-6 text-text-weak">
                    A great session is ready when you’re prepared and the student
                    is comfortable.
                    </Text>
                )}

                <View className="mt-4 flex-col gap-2">
                    {session.status === "booked" && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                router.push(`/(teacher)/(Library)/(Sessions)/${session.id}`)
                            }
                            className="flex-row items-center justify-center rounded-2xl border border-primary bg-bg-1 py-3"
                        >
                            <Ionicons name="videocam" size={18} color={primaryColor} />
                            <Text className="ml-2 text-base font-semibold text-primary">
                                Join Session
                            </Text>
                        </TouchableOpacity>
                    )}
                    {session.status === "completed" && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                            router.push(`/(teacher)/(Library)/(Sessions)/${session.id}`)
                        }
                        className="flex-row items-center justify-center rounded-2xl border border-emerald-500 bg-bg-1 py-3"
                    >
                        <Ionicons name="play-circle" size={18} color="#10b981" />
                        <Text className="ml-2 text-base font-semibold text-emerald-500">
                        View Details
                        </Text>
                    </TouchableOpacity>
                    )}
                    {session.student?.user && (
                    <View className="w-full">
                        <MessageButton
                        recieverUser={session.student.user as user}
                        />
                    </View>
                    )}
                </View>
                </View>
            ))}
            </View>
        )}
        </ScrollView>
    );
}

const LiveSessionsScreenSkeleton = () => {
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
        ]),
        ).start();
    }, [shimmer]);

    const animatedStyle = {
        opacity: shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 0.9],
        }),
    };

    return (
        <ScrollView
        className="px-4 w-full"
        contentContainerStyle={{ paddingBottom: 100, gap: 16 }}
        showsVerticalScrollIndicator={false}
        >
        <View className="mt-4 flex-col gap-2">
            <Skeleton
            className="h-8 w-48 rounded-lg"
            animatedStyle={animatedStyle}
            />
            <Skeleton
            className="h-5 w-72 rounded-md"
            animatedStyle={animatedStyle}
            />
        </View>

        <View className="flex-row gap-2 w-full">
            {[1, 2, 3].map((item) => (
            <View
                key={item}
                className="flex-1 flex-row items-center gap-3 rounded-2xl border border-border bg-bg-2 px-4 py-4"
            >
                <Skeleton
                className="h-10 w-10 rounded-xl"
                animatedStyle={animatedStyle}
                />
                <View className="flex-1 gap-2">
                <Skeleton
                    className="h-3 w-16 rounded-md"
                    animatedStyle={animatedStyle}
                />
                <Skeleton
                    className="h-6 w-10 rounded-md"
                    animatedStyle={animatedStyle}
                />
                </View>
            </View>
            ))}
        </View>

        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
        >
            {[1, 2, 3].map((item) => (
            <Skeleton
                key={item}
                className="h-9 w-24 rounded-full"
                animatedStyle={animatedStyle}
            />
            ))}
        </ScrollView>

        <View className="mt-2 flex-col gap-3">
            {[1, 2].map((item) => (
            <View
                key={item}
                className="rounded-2xl border-l-4 border-border bg-bg-2 p-4"
            >
                <View className="flex-row gap-3 items-center">
                <Skeleton
                    className="h-14 w-14 rounded-full"
                    animatedStyle={animatedStyle}
                />
                <View className="flex-1 gap-2">
                    <Skeleton
                    className="h-4 w-28 rounded-md"
                    animatedStyle={animatedStyle}
                    />
                    <Skeleton
                    className="h-4 w-36 rounded-md"
                    animatedStyle={animatedStyle}
                    />
                </View>
                </View>
                <View className="mt-4 flex-row gap-4">
                <Skeleton
                    className="h-4 w-36 rounded-md"
                    animatedStyle={animatedStyle}
                />
                <Skeleton
                    className="h-4 w-16 rounded-md"
                    animatedStyle={animatedStyle}
                />
                </View>
                <Skeleton
                className="h-12 w-full rounded-2xl mt-4"
                animatedStyle={animatedStyle}
                />
            </View>
            ))}
        </View>
        </ScrollView>
    );
};
