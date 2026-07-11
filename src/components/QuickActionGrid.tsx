import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface QuickAction {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    route: string;
    params?: Record<string, string>;
}

interface QuickActionGridProps {
    actions: QuickAction[];
}

export default function QuickActionGrid({ actions }: QuickActionGridProps) {
    const router = useRouter();

    return (
        <View className="flex-row flex-wrap gap-3">
            {actions.map((action, index) => (
                <Pressable
                    key={index}
                    onPress={() =>
                        router.push({ pathname: action.route as any, params: action.params } as any)
                    }
                    className="w-[48%] bg-bg-2 border border-border rounded-2xl p-4 items-center gap-2 active:scale-95 transition-all duration-200"
                >
                    <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                        <Ionicons name={action.icon} size={22} color="#2563eb" />
                    </View>
                    <Text className="text-text-strong text-sm font-semibold text-center">
                        {action.label}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}
