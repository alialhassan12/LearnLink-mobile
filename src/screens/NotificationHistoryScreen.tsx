import { ActivityIndicator, Animated, FlatList, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNotificationStore } from "../store/notificationStore";
import { useEffect, useRef } from "react";
import { useTheme } from "../providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Skeleton from "../components/Skeleton";
import type { Notification } from "../@types/notification";

// Helper to determine icon, colors, and badge indicator colors based on notification type
const getNotificationConfig = (type: string, isDark: boolean) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('booking') || t.includes('session') || t.includes('calendar')) {
        return {
            iconName: 'calendar' as const,
            bgClass: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
            indicatorClass: 'bg-blue-500',
            color: '#3b82f6',
        };
    }
    if (t.includes('course') || t.includes('material') || t.includes('enroll')) {
        return {
            iconName: 'book' as const,
            bgClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400',
            indicatorClass: 'bg-emerald-500',
            color: '#10b981',
        };
    }
    if (t.includes('upgrade') || t.includes('plan') || t.includes('payment') || t.includes('money')) {
        return {
            iconName: 'sparkles' as const,
            bgClass: 'bg-amber-500/10 border-amber-500/20 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400',
            indicatorClass: 'bg-amber-500',
            color: '#f59e0b',
        };
    }
    if (t.includes('ai') || t.includes('bot') || t.includes('token')) {
        return {
            iconName: 'hardware-chip' as const,
            bgClass: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500 dark:bg-cyan-500/20 dark:text-cyan-400',
            indicatorClass: 'bg-cyan-500',
            color: '#06b6d4',
        };
    }
    if (t.includes('chat') || t.includes('message')) {
        return {
            iconName: 'chatbubble-ellipses' as const,
            bgClass: 'bg-blue-500/10 border-blue-500/20 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400',
            indicatorClass: 'bg-blue-500',
            color: '#3b82f6',
        };
    }
    // Default system notification
    return {
        iconName: 'notifications' as const,
        bgClass: 'bg-zinc-500/10 border-zinc-500/20 text-text-strong dark:bg-zinc-500/20 dark:text-text-strong',
        indicatorClass: 'bg-primary',
        color: isDark ? '#3b82f6' : '#2563eb',
    };
};

// Relative date helper
const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 0 || diffInSeconds < 60) return 'Just now';
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
        return '';
    }
};

export default function NotificationHistoryScreen() {
    const { notifications, getNotifications, isGettingNotifications } = useNotificationStore();
    const { isDark } = useTheme();

    useEffect(() => {
        getNotifications();
    }, [getNotifications]);

    if (isGettingNotifications && notifications.length === 0) {
        return <NotificationHistorySkeleton />;
    }

    return (
        <SafeAreaView className="flex-1 bg-bg-1" edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-border bg-bg-2">
                <View className="flex-row items-center justify-center gap-3">
                    <TouchableOpacity onPress={() => router.back()} className="p-1 active:opacity-70">
                        <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#0f172a"} />
                    </TouchableOpacity>
                    <Text className="text-text-strong text-xl font-bold">Notifications</Text>
                </View>
            </View>

            {/* List */}
            <FlatList
                className="flex-1 px-4 mt-4"
                contentContainerStyle={{ paddingBottom: 40 }}
                data={notifications}
                keyExtractor={(item, index) => item.created_at || String(index)}
                refreshing={isGettingNotifications}
                onRefresh={getNotifications}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<NotificationEmptyState />}
                renderItem={({ item, index }) => {
                    const config = getNotificationConfig(item.type, isDark);
                    return (
                        <View 
                            className={`flex flex-row p-4 gap-3 border rounded-xl mb-3 items-start relative ${
                                item.is_read 
                                    ? 'bg-bg-2 border-border border' 
                                    : 'bg-blue-500/10 border-blue-500/20 '
                            }`}
                        >
                            {/* Icon container */}
                            <View className={`p-2.5 h-10 w-10 rounded-xl items-center justify-center border shadow-sm  ${config.bgClass}`}>
                                <Ionicons name={config.iconName} size={20} color={config.color} />
                            </View>

                            {/* Text content */}
                            <View className="flex-1 pr-4">
                                <Text className={`text-sm font-semibold mb-1 ${
                                    item.is_read ? 'text-text-strong' : 'text-primary'
                                }`}>
                                    {item.title}
                                </Text>
                                <Text className="text-xs text-text-weak leading-relaxed">
                                    {item.body}
                                </Text>
                                <Text className="text-[10px] text-text-weak mt-1 font-medium">
                                    {formatRelativeTime(item.created_at)}
                                </Text>
                            </View>
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
}

const NotificationEmptyState = () => {
    const { isDark } = useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";

    return (
        <View className="flex-1 justify-center items-center py-24 px-6">
            <View className="p-5 rounded-full bg-blue-500/20 mb-4">
                <Ionicons name="notifications-off-outline" size={44} color={primaryColor} />
            </View>
            <Text className="text-text-strong font-semibold text-lg text-center">All caught up!</Text>
            <Text className="text-text-weak text-sm text-center mt-2 max-w-[270px] leading-relaxed">
                You don't have any notifications at the moment. We'll let you know when something new arrives.
            </Text>
        </View>
    );
}

const NotificationHistorySkeleton = () => {
    const shimmer = useRef(new Animated.Value(0)).current;
    const { isDark } = useTheme();

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
        <SafeAreaView className="flex-1 bg-bg-1" edges={['top', 'left', 'right']}>
            {/* Header Skeleton */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-border bg-bg-2">
                <View className="flex-row items-center justify-center gap-3">
                    <TouchableOpacity onPress={() => router.back()} className="p-1 active:opacity-70">
                        <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#0f172a"} />
                    </TouchableOpacity>
                    <Text className="text-text-strong text-xl font-bold">Notifications</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <View key={i} className="flex flex-row p-4 border border-border rounded-xl mb-3 items-start bg-bg-2">
                        {/* Icon placeholder */}
                        <Skeleton className="w-10 h-10 rounded-xl mr-3.5" animatedStyle={animatedStyle} />

                        {/* Text block placeholder */}
                        <View className="flex-1 gap-2">
                            <Skeleton className="h-4 w-1/2 rounded-md" animatedStyle={animatedStyle} />
                            <Skeleton className="h-3 w-full rounded-md" animatedStyle={animatedStyle} />
                            <Skeleton className="h-3 w-3/4 rounded-md" animatedStyle={animatedStyle} />
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
