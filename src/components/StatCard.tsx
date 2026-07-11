import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    value: number | string;
    label: string;
    color?: string;
}

export default function StatCard({ icon, value, label, color = "#2563eb" }: StatCardProps) {
    return (
        <View className="flex-1 bg-bg-2 border border-border rounded-2xl p-4 items-center gap-2">
            <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
            >
                <Ionicons name={icon} size={18} color={color} />
            </View>
            <Text className="text-text-strong text-xl font-bold">{value}</Text>
            <Text className="text-text-weak text-xs text-center">{label}</Text>
        </View>
    );
}
