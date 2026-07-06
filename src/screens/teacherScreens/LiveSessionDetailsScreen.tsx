import type { user } from "@/src/@types/user";
import MessageButton from "@/src/components/MessageButton";
import { useTheme } from "@/src/providers/ThemeProvider";
import useAuthStore from "@/src/store/authStore";
import { useLiveSessionStore } from "@/src/store/liveSessionsStore";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";

export default function LiveSessionDetailsScreen() {
    const { authUser } = useAuthStore();
    const { isDark } = useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const weakText = isDark ? "#94a3b8" : "#64748b";
    const cardBg = isDark ? "#1e293b" : "#ffffff";
    const borderColor = isDark ? "#334155" : "#e2e8f0";
    const mutedBg = isDark ? "#0f172a" : "#f8fafc";

    const { SessionId } = useLocalSearchParams();

    const {
        teacherSelectedSession,
        getTeacherSelectedSession,
        isGettingTeacherSelectedSession,
        sessionReview,
        getToken,
        isGettingToken,
    } = useLiveSessionStore();

    useEffect(() => {
        if (SessionId) {
            getTeacherSelectedSession(Number(SessionId));
        }
    }, [SessionId, getTeacherSelectedSession]);

    const handleStartSession=async()=>{
        if(SessionId){
            const roomName=`session-${SessionId}`;
            await getToken(roomName,Number(SessionId));
            const {token}=useLiveSessionStore.getState();
            if(token){
                router.replace('/SessionRoom');
            }
        }
    }

    if (isGettingTeacherSelectedSession) {
        return <LiveSessionDetailsScreenSkeleton />;
    }

    if (!teacherSelectedSession) {
        return (
            <View className="flex-1 items-center justify-center gap-4 bg-bg-1 px-8">
                <Ionicons name="calendar-outline" size={48} color={weakText} />
                <Text className="text-center text-xl font-bold text-text-strong">
                    Session not found
                </Text>
                <Text className="text-center text-sm text-text-weak">
                    We couldn&apos;t load the session details. Please go back and try again.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            className="w-full px-4"
            contentContainerStyle={{ paddingBottom: 100, gap: 16 }}
            showsVerticalScrollIndicator={false}
        >
            <View className="flex-col items-center justify-center gap-4 overflow-hidden rounded-[32px] bg-[#1E1B7A] p-6">
                <View className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10">
                    <FontAwesome5 name="video" size={32} color="white" solid />
                </View>

                <View className="flex-col gap-1">
                    <Text className="text-center text-3xl font-bold text-white">
                        Session Overview
                    </Text>
                    <Text className="text-center text-lg font-semibold text-text-weak">
                        {teacherSelectedSession?.scheduled_day?.substring(0, 3).toUpperCase()}, {teacherSelectedSession?.scheduled_date}
                    </Text>
                    <Text className="text-center text-lg font-semibold text-text-weak">
                        {teacherSelectedSession?.scheduled_time}
                    </Text>
                </View>

                <View className="w-full flex-col gap-2">
                    <Pressable 
                        className="flex h-16 flex-row items-center justify-center gap-3 rounded-2xl bg-[#4338F2] active:opacity-90 active:scale-95 transition-all duration-200 ease-in-out"
                        disabled={isGettingToken}
                        onPress={handleStartSession}
                    >
                        {isGettingToken?(
                            <ActivityIndicator size={32} color={"white"} />
                        ):(
                            <>
                                <Text className="text-white text-xl font-bold">
                                    Join Session
                                </Text>

                                <Ionicons
                                    name="arrow-forward"
                                    size={22}
                                    color="white"
                                />
                            </>
                        )}
                    </Pressable>
                    {teacherSelectedSession?.student?.user && (
                        <MessageButton recieverUser={teacherSelectedSession.student.user as user} />
                    )}
                </View>
            </View>

            <View className="flex flex-col rounded-3xl border border-border bg-bg-2 p-6">
                <View className="mb-5 border-b border-border pb-5">
                    <Text className="text-xl font-bold tracking-tight text-text-strong">
                        Details
                    </Text>
                </View>

                <View className="flex-row items-center justify-between rounded-xl border border-border bg-bg-1 p-3">
                    <Text className="text-sm font-medium text-text-weak">Type</Text>
                    <Text className="text-sm font-semibold text-text-strong">
                        1-on-1 Session
                    </Text>
                </View>

                <View className="mt-4 flex-row items-center gap-2 rounded-2xl border border-blue-500/10 bg-blue-500/10 p-3">
                    {authUser?.avatar_url ? (
                        <Image
                            source={{ uri: authUser.avatar_url }}
                            className="h-12 w-12 rounded-full"
                        />
                    ) : (
                        <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Ionicons name="person" size={24} color={primaryColor} />
                        </View>
                    )}
                    <View className="flex-1">
                        <Text className="truncate text-sm font-bold text-text-strong">
                            {authUser?.name?.toUpperCase() ?? "YOU"}
                        </Text>
                        <Text className="inline-flex w-10 items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                            YOU
                        </Text>
                    </View>
                </View>

                <View className="mt-4 flex-row items-center gap-4 rounded-2xl border border-border p-3">
                    {teacherSelectedSession?.student?.user?.avatar_url ? (
                        <Image
                            source={{ uri: teacherSelectedSession.student.user.avatar_url }}
                            className="h-12 w-12 rounded-full"
                        />
                    ) : (
                        <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Ionicons name="person" size={24} color={primaryColor} />
                        </View>
                    )}
                    <View className="min-w-0 flex-1">
                        <Text className="truncate text-sm font-bold text-text-strong">
                            {teacherSelectedSession?.student?.user?.name?.toUpperCase() ?? "STUDENT"}
                        </Text>
                        <Text className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-text-weak">
                            STUDENT
                        </Text>
                    </View>
                </View>
            </View>

            <View
                className="rounded-3xl border border-border p-6"
                style={{ backgroundColor: cardBg }}
            >
                <Text className="text-xl font-bold tracking-tight text-text-strong">
                    Session Review
                </Text>
                <Text className="mt-2 text-sm leading-6 text-text-weak">
                    {sessionReview
                        ? "Thank you for reviewing this live session. Your feedback helps us improve."
                        : "No review has been submitted for this session yet."}
                </Text>

                {sessionReview ? (
                    <View className="mt-4 gap-3">
                        <View className="flex-row items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons
                                    key={star}
                                    name={star <= sessionReview.rating ? "star" : "star-outline"}
                                    size={24}
                                    color={star <= sessionReview.rating ? "#f59e0b" : borderColor}
                                />
                            ))}
                            <Text className="text-sm font-semibold text-text-strong">
                                {sessionReview.rating} / 5
                            </Text>
                        </View>

                        {sessionReview.review ? (
                            <View
                                className="rounded-2xl border p-4"
                                style={{ backgroundColor: mutedBg, borderColor }}
                            >
                                <Text className="text-sm leading-6 text-text-strong">
                                    &quot;{sessionReview.review}&quot;
                                </Text>
                            </View>
                        ) : (
                            <Text className="text-sm text-text-weak">
                                No written comment provided.
                            </Text>
                        )}
                    </View>
                ) : (
                    <View className="mt-4 items-center justify-center rounded-2xl border border-dashed border-border bg-bg-1 py-8">
                        <Ionicons name="chatbubble-ellipses-outline" size={28} color={weakText} />
                        <Text className="mt-3 text-center text-sm font-medium text-text-weak">
                            There is no review for this session yet.
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const LiveSessionDetailsScreenSkeleton = () => {
    return (
        <View className="flex-1 items-center justify-center bg-bg-1">
            <Text className="text-center text-xl font-bold text-text-strong">
                Loading Session Details...
            </Text>
        </View>
    );
};