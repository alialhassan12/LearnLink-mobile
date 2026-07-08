import useAuthStore from "@/src/store/authStore";
import { useSubscriptionStore } from "@/src/store/subscriptionStore";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SubscriptionPlansScreen() {
    const { authUser,setAuthUser } = useAuthStore();
    const {
        getActivePlans,
        activePlans,
        isGettingPlans,
        currentSubscription,
        setCurrentSubscription,
        upgradeSubscription,
        isUpgrading,
    } = useSubscriptionStore();

    useEffect(() => {
        const init = async () => {
            await getActivePlans();
            setCurrentSubscription(authUser?.subscription || null);
        };
        init();
    }, [authUser]);

    const handleUpgrade = async (planId: number) => {
        await upgradeSubscription(planId);
    };

    if (isGettingPlans) {
        return <SubscriptionPlansSkeleton />;
    }

    return (
        <ScrollView
            className="px-4 w-full"
            contentContainerStyle={{ paddingBottom: 100, gap: 24 }}
            showsVerticalScrollIndicator={false}
        >
            <View className="mt-4 flex-col gap-2">
                <Text className="text-3xl font-bold text-text-strong">
                    Subscription Plans
                </Text>
                <Text className="text-sm font-light text-text-weak leading-5">
                    Choose the plan that fits your teaching needs and unlock more
                    courses, scheduled live sessions, and AI helper tools.
                </Text>
            </View>

            {activePlans.length === 0 && (
                <View className="items-center py-12 border border-dashed border-border rounded-xl">
                    <Text className="text-text-weak font-medium">
                        No active subscription plans found.
                    </Text>
                </View>
            )}

            {activePlans.map((plan, index) => {
                const isCurrent =
                    currentSubscription?.plan_id === plan.id;

                return (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        isCurrent={isCurrent}
                        isUpgrading={isUpgrading}
                        onUpgrade={handleUpgrade}
                        index={index}
                    />
                );
            })}
        </ScrollView>
    );
}

function PlanCard({
    plan,
    isCurrent,
    isUpgrading,
    onUpgrade,
    index,
}: {
    plan: any;
    isCurrent: boolean;
    isUpgrading: boolean;
    onUpgrade: (planId: number) => void;
    index: number;
}) {
    const { isDark } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            delay: index * 150,
            useNativeDriver: true,
        }).start();
        Animated.timing(translateAnim, {
            toValue: 0,
            duration: 400,
            delay: index * 150,
            useNativeDriver: true,
        }).start();
    }, []);

    const formatDuration = (days: number | null) => {
        if (days === 30) return "month";
        if (days === 365) return "year";
        if (days !== null) return `${days} days`;
        return "life time";
    };

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: translateAnim }],
            }}
            className={`rounded-2xl border overflow-hidden ${
                isCurrent
                    ? "border-primary bg-bg-2"
                    : "border-border bg-bg-2"
            }`}
        >
            {isCurrent && (
                <View className="absolute top-3 right-3 z-10 bg-primary px-3 py-1 rounded-full">
                    <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                        Current Plan
                    </Text>
                </View>
            )}

            <View className="p-5">
                <Text className="text-xl font-bold text-text-strong">
                    {plan.title}
                </Text>

                <View className="flex-row items-baseline gap-1 mt-3">
                    <Text className="text-3xl font-extrabold text-text-strong">
                        ${plan.price}
                    </Text>
                    <Text className="text-xs text-text-weak font-medium">
                        /{formatDuration(plan.duration_days)}
                    </Text>
                </View>

                <Text className="text-xs text-text-weak mt-2 leading-5">
                    {plan.description}
                </Text>
            </View>

            <View className="border-t border-border/40 px-5 pt-4 pb-2">
                <Text className="text-[11px] font-bold text-text-weak uppercase tracking-wider mb-4">
                    Features Included:
                </Text>

                <FeatureRow
                    icon="book-outline"
                    value={
                        <Text className="text-xs text-text-strong">
                            Up to{" "}
                            <Text className="font-semibold">
                                {plan.features.max_courses}
                            </Text>{" "}
                            published courses
                        </Text>
                    }
                />

                <FeatureRow
                    icon="videocam-outline"
                    value={
                        <Text className="text-xs text-text-strong">
                            <Text className="font-semibold">
                                {plan.features.sessions_per_month}
                            </Text>{" "}
                            live sessions / month
                        </Text>
                    }
                />

                <FeatureRow
                    icon="sparkles-outline"
                    value={
                        <Text className="text-xs text-text-strong">
                            <Text className="font-semibold">
                                {plan.features.ai_tokens_per_month.toLocaleString()}
                            </Text>{" "}
                            AI tokens / month
                        </Text>
                    }
                />

                <FeatureRow
                    icon="trending-up-outline"
                    value={
                        <View className="flex-row items-center gap-1.5">
                            <Text className="text-xs text-text-strong">
                                {plan.features.search_priority
                                    ? "Priority search visibility"
                                    : "Standard search visibility"}
                            </Text>
                            <Ionicons
                                name={
                                    plan.features.search_priority
                                        ? "checkmark-circle"
                                        : "close-circle"
                                }
                                size={16}
                                color={
                                    plan.features.search_priority
                                        ? "#10b981"
                                        : "#f43f5e"
                                }
                            />
                        </View>
                    }
                />
            </View>

            <View className="px-5 pt-2 pb-5">
                {isCurrent ? (
                    <View className="w-full items-center py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <Text className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                            Currently Active Plan
                        </Text>
                    </View>
                ) : plan.is_free ? (
                    <View className="w-full items-center py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <Text className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                            Auto-downgrade when upgraded plan expires
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={() => onUpgrade(plan.id)}
                        disabled={isUpgrading}
                        className="w-full h-11 bg-primary rounded-xl items-center justify-center active:scale-95 transition-all duration-200"
                    >
                        {isUpgrading ? (
                            <View className="flex-row items-center gap-2">
                                <ActivityIndicator size="small" color="#fff" />
                                <Text className="text-white font-bold text-sm">
                                    Processing...
                                </Text>
                            </View>
                        ) : (
                            <Text className="text-white font-bold text-sm">
                                Upgrade Plan
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );
}

function FeatureRow({
    icon,
    value,
}: {
    icon: string;
    value: React.ReactNode;
}) {
    const { isDark } = useTheme();
    const primaryColor = isDark ? "#818cf8" : "#4338F2";

    return (
        <View className="flex-row items-center gap-3 mb-3.5">
            <View
                className="p-1 rounded-full"
                style={{ backgroundColor: `${primaryColor}1A` }}
            >
                <Ionicons name={icon as any} size={14} color={primaryColor} />
            </View>
            {typeof value === "string" ? (
                <Text className="text-xs text-text-strong">{value}</Text>
            ) : (
                value
            )}
        </View>
    );
}

const SubscriptionPlansSkeleton = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
        );
        animation.start();
        return () => animation.stop();
    }, []);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const SkeletonBlock = ({ className }: { className: string }) => (
        <Animated.View
            style={{ opacity }}
            className={`bg-bg-2 rounded-md ${className}`}
        />
    );

    return (
        <ScrollView
            className="px-4 w-full"
            contentContainerStyle={{ paddingBottom: 100, gap: 24 }}
            showsVerticalScrollIndicator={false}
        >
            <View className="mt-4 flex-col gap-3">
                <SkeletonBlock className="h-9 w-48" />
                <SkeletonBlock className="h-4 w-72" />
            </View>

            {[...Array(3)].map((_, i) => (
                <View
                    key={i}
                    className="rounded-2xl border border-border bg-bg-2 p-5 gap-4"
                >
                    <View className="flex-col gap-2">
                        <SkeletonBlock className="h-6 w-24" />
                        <SkeletonBlock className="h-8 w-32" />
                    </View>
                    <SkeletonBlock className="h-4 w-full" />
                    <SkeletonBlock className="h-4 w-5/6" />

                    <View className="border-t border-border/30 pt-4 gap-3.5">
                        {[...Array(4)].map((_, idx) => (
                            <View
                                key={idx}
                                className="flex-row items-center gap-3"
                            >
                                <SkeletonBlock className="h-5 w-5 rounded-full" />
                                <SkeletonBlock className="h-4 w-40" />
                            </View>
                        ))}
                    </View>

                    <SkeletonBlock className="h-11 w-full rounded-xl" />
                </View>
            ))}
        </ScrollView>
    );
};
