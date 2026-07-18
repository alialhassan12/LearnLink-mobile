import { useTheme } from "@/src/providers/ThemeProvider";
import { useBrowseStore } from "@/src/store/studentStores/browseStore";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, TextInput } from "react-native";
import Modal from "react-native-modal";

interface TeacherFilter {
    subjects?: string[];
    language?: string;
    hourlyRate: [min: number, max: number];
    search_query?: string;
    rating?: number | null;
}

export function TeachersFilterSheet({
    visible,
    onClose
}: {
    visible: boolean;
    onClose: () => void;
}) {
    const { isDark } = useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const strongColor = isDark ? "#f8fafc" : "#0f172a";
    const weakColor = isDark ? "#94a3b8" : "#64748b";

    const {
        languages,
        subjects,
        isGettingFilters,
        teacherFilter,
        setTeacherFilter,
        clearTeacherFilter,
        getTeachers
    } = useBrowseStore();

    // Local filter state to avoid lag or premature queries
    const [localFilter, setLocalFilter] = useState<TeacherFilter>({
        subjects: [],
        language: "all",
        hourlyRate: [0, 2000],
        search_query: "",
        rating: 0
    });

    // Sync local state with global store when sheet is opened
    useEffect(() => {
        if (visible) {
            setLocalFilter({
                subjects: teacherFilter.subjects ?? [],
                language: teacherFilter.language ?? "all",
                hourlyRate: teacherFilter.hourlyRate ?? [0, 2000],
                search_query: teacherFilter.search_query ?? "",
                rating: teacherFilter.rating ?? 0
            });
        }
    }, [visible, teacherFilter]);

    const handleApply = async () => {
        setTeacherFilter(localFilter);
        onClose();
        await getTeachers(1);
    };

    const handleReset = async () => {
        clearTeacherFilter();
        setLocalFilter({
            subjects: [],
            language: "all",
            hourlyRate: [0, 2000],
            search_query: "",
            rating: 0
        });
        onClose();
        await getTeachers(1);
    };

    return (
        <Modal
            animationIn="slideInRight"
            animationOut="slideOutRight"
            isVisible={visible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            swipeDirection={["right"]}
            style={{ margin: 0, alignItems: "flex-end" }}
            statusBarTranslucent
        >
            <View className="h-full w-[85%] bg-bg-1 p-5 flex-col justify-between border-l border-border ">
                {/* Header */}
                <View className="mb-6 mt-10 flex-row items-center justify-between border-b border-border pb-4">
                    <Text className="text-xl font-bold text-text-strong">Filters</Text>

                    <View className="flex-row items-center gap-4">
                        <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
                            <Text className="text-primary font-semibold text-sm">Reset All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} activeOpacity={0.7} className="p-1">
                            <Ionicons name="close" size={24} color={strongColor} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <ScrollView 
                    className="flex-1" 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                >
                    {/* Subjects Filter */}
                    <View className="flex flex-col gap-3 mb-6">
                        <Text className="text-xs font-bold text-text-strong uppercase tracking-wider">Subjects</Text>
                        
                        {isGettingFilters ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <View key={i} className="flex-row items-center gap-2 py-1">
                                    <View className="h-4 w-4 bg-bg-2 rounded animate-pulse" />
                                    <View className="h-4 w-24 bg-bg-2 rounded animate-pulse" />
                                </View>
                            ))
                        ) : (
                            <ScrollView 
                                showsVerticalScrollIndicator={true}
                                className="flex flex-col gap-2" 
                                style={{maxHeight:200}}
                            >
                                {subjects.map((subject, i) => {
                                    if (!subject) return null;
                                    const isSelected = (localFilter.subjects ?? []).includes(subject);
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => {
                                                const newSubjects = isSelected
                                                    ? (localFilter.subjects ?? []).filter((s) => s !== subject)
                                                    : [...(localFilter.subjects ?? []), subject];
                                                setLocalFilter({
                                                    ...localFilter,
                                                    subjects: newSubjects
                                                });
                                            }}
                                            className="flex-row items-center gap-3 py-1.5"
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={isSelected ? "checkbox" : "square-outline"}
                                                size={20}
                                                color={isSelected ? primaryColor : weakColor}
                                            />
                                            <Text className={`text-sm ${isSelected ? "text-text-strong font-medium" : "text-text-weak"}`}>
                                                {subject}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </View>

                    {/* Languages Filter */}
                    <View className="flex flex-col gap-3 mb-6">
                        <Text className="text-xs font-bold text-text-strong uppercase tracking-wider">Languages</Text>
                        
                        {isGettingFilters ? (
                            <View className="flex-row flex-wrap gap-2">
                                <View className="h-8 w-20 bg-bg-2 rounded-full animate-pulse" />
                                <View className="h-8 w-24 bg-bg-2 rounded-full animate-pulse" />
                            </View>
                        ) : (
                            <View className="flex-row flex-wrap gap-2">
                                <TouchableOpacity
                                    onPress={() => setLocalFilter({ ...localFilter, language: "all" })}
                                    className={`px-3 py-1.5 rounded-full border ${
                                        localFilter.language === "all"
                                            ? "bg-primary/10 border-primary"
                                            : "bg-bg-2 border-border"
                                    }`}
                                    activeOpacity={0.7}
                                >
                                    <Text className={`text-xs ${
                                        localFilter.language === "all"
                                            ? "text-primary font-semibold"
                                            : "text-text-weak"
                                    }`}>
                                        All Languages
                                    </Text>
                                </TouchableOpacity>
                                {languages.map((language, i) => {
                                    if (!language) return null;
                                    const isSelected = localFilter.language === language;
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => setLocalFilter({ ...localFilter, language })}
                                            className={`px-3 py-1.5 rounded-full border ${
                                                isSelected
                                                    ? "bg-primary/10 border-primary"
                                                    : "bg-bg-2 border-border"
                                            }`}
                                            activeOpacity={0.7}
                                        >
                                            <Text className={`text-xs ${
                                                isSelected
                                                    ? "text-primary font-semibold"
                                                    : "text-text-weak"
                                            }`}>
                                                {language}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </View>

                    {/* Hourly Rate Filter */}
                    <View className="flex flex-col gap-3">
                        <Text className="text-xs font-bold text-text-strong uppercase tracking-wider">Hourly Rate</Text>
                        <View className="flex-row items-center gap-3">
                            {/* Min Input */}
                            <View className="flex-1 flex-row items-center bg-bg-2 border border-border rounded-xl px-3 h-12">
                                <Text className="text-text-weak mr-1.5">$</Text>
                                <TextInput
                                    className="flex-1 text-text-strong text-sm h-full p-0"
                                    placeholder="Min"
                                    placeholderTextColor={weakColor}
                                    keyboardType="numeric"
                                    value={localFilter.hourlyRate[0] === 0 ? "" : String(localFilter.hourlyRate[0])}
                                    onChangeText={(text) => {
                                        const sanitized = text.replace(/[^0-9]/g, '');
                                        const val = sanitized === "" ? 0 : Number(sanitized);
                                        setLocalFilter({
                                            ...localFilter,
                                            hourlyRate: [val, localFilter.hourlyRate[1]]
                                        });
                                    }}
                                />
                            </View>

                            <Text className="text-text-weak">-</Text>

                            {/* Max Input */}
                            <View className="flex-1 flex-row items-center bg-bg-2 border border-border rounded-xl px-3 h-12">
                                <Text className="text-text-weak mr-1.5">$</Text>
                                <TextInput
                                    className="flex-1 text-text-strong text-sm h-full p-0"
                                    placeholder="Max"
                                    placeholderTextColor={weakColor}
                                    keyboardType="numeric"
                                    value={localFilter.hourlyRate[1] === 2000 ? "" : String(localFilter.hourlyRate[1])}
                                    onChangeText={(text) => {
                                        const sanitized = text.replace(/[^0-9]/g, '');
                                        const val = sanitized === "" ? 2000 : Number(sanitized);
                                        setLocalFilter({
                                            ...localFilter,
                                            hourlyRate: [localFilter.hourlyRate[0], val]
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Buttons */}
                <View className="border-t border-border pt-4 mt-2">
                    <TouchableOpacity
                        onPress={handleApply}
                        className="w-full bg-primary py-2 rounded-xl items-center justify-center active:scale-95 transition-all duration-200"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-base font-bold">Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
