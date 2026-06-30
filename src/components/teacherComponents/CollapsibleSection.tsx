import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CollapsibleSectionProps {
    section: {
        id?: number;
        title: string;
        materials?: { id?: number; title: string; type: string }[];
    };
    isLast: boolean;
    isDark: boolean;
}

export default function CollapsibleSection({ section, isLast, isDark }: CollapsibleSectionProps) {
    const [open, setOpen] = useState(false);
    const materials = section.materials ?? [];

    const getMaterialIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case "video": return "videocam-outline";
            case "pdf":   return "document-text-outline";
            case "audio": return "musical-notes-outline";
            case "image": return "image-outline";
            default:      return "attach-outline";
        }
    };

    return (
        <View className={!isLast ? "border-b border-border" : ""}>
            {/* Trigger */}
            <TouchableOpacity
                className="flex-row items-center justify-between px-4 py-4 active:bg-bg-1"
                onPress={() => setOpen((prev) => !prev)}
                activeOpacity={0.7}
            >
                <View className="flex-1 pr-3">
                    <Text className="text-text-strong text-sm font-semibold" numberOfLines={1}>
                        {section.title}
                    </Text>
                    <Text className="text-text-weak text-xs mt-0.5">
                        {materials.length} {materials.length === 1 ? "material" : "materials"}
                    </Text>
                </View>
                <Ionicons
                    name={open ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={isDark ? "#94a3b8" : "#64748b"}
                />
            </TouchableOpacity>

            {/* Content */}
            {open && (
                <View className="px-4 pb-4 flex flex-col gap-2">
                    {materials.length > 0 ? (
                        materials.map((material, idx) => (
                            <View
                                key={material.id ?? idx}
                                className="flex-row items-center gap-3 bg-bg-1 border border-border rounded-xl p-3"
                            >
                                <View className="w-8 h-8 rounded-lg bg-primary/10 items-center justify-center">
                                    <Ionicons
                                        name={getMaterialIcon(material.type) as any}
                                        size={16}
                                        color="#0ea5e9"
                                    />
                                </View>
                                <Text className="text-text-strong text-sm font-medium flex-1" numberOfLines={1}>
                                    {material.title}
                                </Text>
                                <View className="bg-bg-2 border border-border rounded-full px-2 py-0.5">
                                    <Text className="text-text-weak text-[10px] capitalize">
                                        {material.type}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="border border-dashed border-border rounded-xl p-4 items-center">
                            <Text className="text-text-weak text-xs">No materials in this section yet.</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}