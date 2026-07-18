import { useTheme } from "@/src/providers/ThemeProvider";
import useCategoryStore from "@/src/store/categoryStore";
import { useBrowseStore } from "@/src/store/studentStores/browseStore";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, TextInput } from "react-native";
import Modal from "react-native-modal";

interface CourseFilter {
    category_id?: number;
    price_range: [min: number, max: number];
    search_query?: string;
}

export function CoursesFilterSheet({
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
        courseFilters,
        setCourseFilters,
        clearCourseFilters,
        getCourses
    } = useBrowseStore();

    const { categories, getCategories, isGettingCategories } = useCategoryStore();

    // Local filter state to avoid premature network queries
    const [localFilter, setLocalFilter] = useState<CourseFilter>({
        category_id: undefined,
        price_range: [0, 100],
        search_query: ""
    });

    // Sync local state when the filter sheet opens
    useEffect(() => {
        if (visible) {
            setLocalFilter({
                category_id: courseFilters.category_id,
                price_range: courseFilters.price_range ?? [0, 100],
                search_query: courseFilters.search_query ?? ""
            });
        }
    }, [visible, courseFilters]);

    const handleCategorySelect = (categoryId: number) => {
        setLocalFilter({
            ...localFilter,
            category_id: localFilter.category_id === categoryId ? undefined : categoryId
        });
    };

    const handleApply = async () => {
        setCourseFilters(localFilter);
        onClose();
        await getCourses(1);
    };

    const handleReset = async () => {
        clearCourseFilters();
        setLocalFilter({
            category_id: undefined,
            price_range: [0, 100],
            search_query: ""
        });
        onClose();
        await getCourses(1);
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
            <View className="h-full w-[85%] bg-bg-1 p-5 flex-col justify-between border-l border-border">
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
                    {/* Categories Filter */}
                    <View className="flex flex-col gap-3 mb-6">
                        <Text className="text-xs font-bold text-text-strong uppercase tracking-wider">Categories</Text>
                        
                        {isGettingCategories ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <View key={i} className="flex-row items-center gap-2 py-1">
                                    <View className="h-4 w-4 bg-bg-2 rounded-full animate-pulse" />
                                    <View className="h-4 w-24 bg-bg-2 rounded animate-pulse" />
                                </View>
                            ))
                        ) : (
                            <ScrollView 
                                showsVerticalScrollIndicator={true}
                                className="flex flex-col gap-2" 
                                style={{ maxHeight: 250 }}
                            >
                                {categories.map((category, i) => {
                                    if (!category) return null;
                                    const isSelected = localFilter.category_id === category.id;
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => handleCategorySelect(category.id)}
                                            className="flex-row items-center gap-3 py-1.5"
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={isSelected ? "radio-button-on" : "radio-button-off"}
                                                size={20}
                                                color={isSelected ? primaryColor : weakColor}
                                            />
                                            <Text className={`text-sm ${isSelected ? "text-text-strong font-medium" : "text-text-weak"}`}>
                                                {category.title}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </View>

                    {/* Price Range Filter */}
                    <View className="flex flex-col gap-3">
                        <Text className="text-xs font-bold text-text-strong uppercase tracking-wider">Price Range</Text>
                        <View className="flex-row items-center gap-3">
                            {/* Min Input */}
                            <View className="flex-1 flex-row items-center bg-bg-2 border border-border rounded-xl px-3 h-12">
                                <Text className="text-text-weak mr-1.5">$</Text>
                                <TextInput
                                    className="flex-1 text-text-strong text-sm h-full p-0"
                                    placeholder="Min"
                                    placeholderTextColor={weakColor}
                                    keyboardType="numeric"
                                    value={localFilter.price_range[0] === 0 ? "" : String(localFilter.price_range[0])}
                                    onChangeText={(text) => {
                                        const sanitized = text.replace(/[^0-9]/g, '');
                                        const val = sanitized === "" ? 0 : Number(sanitized);
                                        setLocalFilter({
                                            ...localFilter,
                                            price_range: [val, localFilter.price_range[1]]
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
                                    value={localFilter.price_range[1] === 100 ? "" : String(localFilter.price_range[1])}
                                    onChangeText={(text) => {
                                        const sanitized = text.replace(/[^0-9]/g, '');
                                        const val = sanitized === "" ? 100 : Number(sanitized);
                                        setLocalFilter({
                                            ...localFilter,
                                            price_range: [localFilter.price_range[0], val]
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