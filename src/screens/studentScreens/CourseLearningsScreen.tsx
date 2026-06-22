import React, { useEffect, useState, useRef } from "react";
import {
    Text,
    View,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Animated,
    StyleSheet,
    Image
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCourseStore } from "@/src/store/courseStore";
import { useTheme } from "@/src/providers/ThemeProvider";
import { CourseMaterial } from "@/src/@types/courseMaterials";
import { useVideoPlayer, VideoView } from "expo-video";
import {File,Paths} from "expo-file-system";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";
import Skeleton from "@/src/components/Skeleton";

// Custom component to handle inline video playback for a specific source
const CustomVideoPlayer = ({ sourceUrl }: { sourceUrl: string }) => {
    const player = useVideoPlayer(sourceUrl, (p) => {
        p.loop = false;
        p.play();
    });

    return (
        <VideoView
            style={styles.videoPlayer}
            player={player}
            nativeControls={true}
            allowsPictureInPicture
        />
    );
};

export default function CourseLearningsScreen() {
    const { courseId } = useLocalSearchParams();
    const { isDark } = useTheme();

  // Colors based on theme
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const weakText = isDark ? "#94a3b8" : "#64748b";
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const borderColor = isDark ? "#334155" : "#e2e8f0";
    const cardBg = isDark ? "#1e293b" : "#ffffff";
    const accentColor = isDark ? "#1e3a8a" : "#eff6ff";

  // Store state
    const {
        courseWithMaterials,
        isGettingCourseWithMaterialsById,
        getCourseWithMaterialsById,
    } = useCourseStore();

  // Local state
    const [selectedMaterial, setSelectedMaterial] = useState<CourseMaterial | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
    const [activeTab, setActiveTab] = useState<"syllabus" | "overview" | "instructor">("syllabus");
    const [isDownloading, setIsDownloading] = useState(false);

  // Fetch course content on mount
    useEffect(() => {
        if (courseId) {
            getCourseWithMaterialsById(Number(courseId));
        }
    }, [courseId]);

  // Expand all sections by default and select first material when course data loads
    useEffect(() => {
        if (courseWithMaterials?.sections) {
            const initialExpanded: Record<number, boolean> = {};
            courseWithMaterials.sections.forEach((section) => {
                if (section.id) {
                    initialExpanded[section.id] = true;
                }
            });
            setExpandedSections(initialExpanded);

            // Select first material of first section with materials
            const sorted = [...courseWithMaterials.sections].sort(
                (a, b) => (a.order || 0) - (b.order || 0)
            );
            const firstSectionWithMaterials = sorted.find(
                (sec) => sec.materials && sec.materials.length > 0
            );
            if (
                firstSectionWithMaterials &&
                firstSectionWithMaterials.materials &&
                firstSectionWithMaterials.materials.length > 0
            ) {
                setSelectedMaterial(firstSectionWithMaterials.materials[0]);
            }
        }
    }, [courseWithMaterials]);

  // Sort sections by order
    const sortedSections = [...(courseWithMaterials?.sections || [])].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
    );

  // Flatten all materials to calculate lesson numbers and previous/next states
    const allMaterials = sortedSections.reduce<CourseMaterial[]>((acc, section) => {
        return acc.concat(section.materials || []);
    }, []);

    const currentIndex = allMaterials.findIndex((m) => m.id === selectedMaterial?.id);
    const prevMaterial = currentIndex > 0 ? allMaterials[currentIndex - 1] : null;
    const nextMaterial =
        currentIndex !== -1 && currentIndex < allMaterials.length - 1
        ? allMaterials[currentIndex + 1]
        : null;

  // Accordion toggle
    const toggleSection = (sectionId: number) => {
        setExpandedSections((prev) => ({
        ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

  // Material type checks and icons
    const getMaterialIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("video") || lowerType === "mp4" || lowerType === "mov") {
        return <Ionicons name="play-circle" size={20} color="#3b82f6" />;
    }
    if (
        lowerType.includes("pdf") ||
        lowerType.includes("doc") ||
        lowerType.includes("text") ||
        lowerType === "pdf" ||
        lowerType === "docx"
    ) {
        return <Ionicons name="document-text" size={20} color="#f97316" />;
    }
    if (
        lowerType.includes("image") ||
        lowerType === "png" ||
        lowerType === "jpg" ||
        lowerType === "jpeg" ||
        lowerType === "webp"
    ) {
        return <Ionicons name="image" size={20} color="#10b981" />;
    }
    return <Ionicons name="download" size={20} color="#8b5cf6" />;
    };

  // Handle local file download & share using Expo FileSystem
    const handleDownloadMaterial = async (
        fileTitle: string,
        fileUrl:string
    ) => {
        setIsDownloading(true);
        try {
            const filename=new Date().toISOString() + "-" + fileTitle;
            
            const file = new File(Paths.document, filename);
            
            await File.downloadFileAsync(fileUrl, file);
            
            await Sharing.shareAsync(file.uri);
            
        } catch (error) {
            console.error("Error downloading file:", error);
            Toast.show({
                type: "error",
                text1: "Download failed",
                text2: "Could not fetch this document from the server.",
                position: "bottom",
            });
        } finally {
            setIsDownloading(false);
        }
    };

    // Render content in the top preview viewer box
    const renderMaterialContent = (material: CourseMaterial) => {
        const lowerType = material.type.toLowerCase();
        const path = material.path || "";

        // Video viewer (Inline using expo-video)
        if (lowerType.includes("video") || lowerType === "mp4" || lowerType === "mov") {
            return (
                <View className="flex-1 w-full  ">
                    {path ? (
                        <CustomVideoPlayer key={material.id} sourceUrl={path} />
                    ) : (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-white text-xs font-semibold">Video URL missing</Text>
                        </View>
                    )}
                </View>
            );
        }

        // Image viewer (Inline using expo-image)
        if (
            lowerType.includes("image") ||
            lowerType === "png" ||
            lowerType === "jpg" ||
            lowerType === "jpeg" ||
            lowerType === "webp"
        ) {
            return (
                <View className="flex-1 bg-slate-900 rounded-2xl overflow-hidden border border-border">
                    <Image
                        className="object-contain"
                        source={{ uri: path }}
                        style={styles.imageViewer}
                    />
                </View>
            );
        }

        // Other documents (PDF, Word, etc.)
        return (
            <View
                className="w-full h-full rounded-2xl border border-dashed border-border flex-col justify-center items-center p-6 text-center"
                style={{ backgroundColor: cardBg }}
            >
                <View className="p-4 bg-orange-100 dark:bg-orange-950/40 rounded-full mb-3">
                <Ionicons
                    name="document-text"
                    size={36}
                    color={isDark ? "#f97316" : "#ea580c"}
                />
                </View>
                <Text className="text-text-strong font-bold text-base text-center px-4 mb-1" numberOfLines={2}>
                    {material.title}
                </Text>
                <Text className="text-text-weak text-xs text-center mb-4">
                    Type: {material.type.toUpperCase()} •{" "}
                    {material.size ? (material.size / 1024 / 1024).toFixed(2) : "0"} MB
                </Text>

                <Pressable
                    onPress={() => handleDownloadMaterial(material.title,material?.path !)}
                    disabled={isDownloading}
                    className="flex-row items-center justify-center bg-primary px-5 py-2.5 rounded-full active:opacity-90 transition-opacity"
                >
                {isDownloading ? (
                    <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
                ) : (
                    <Ionicons name="share-outline" size={16} color="#ffffff" className="mr-2" />
                )}
                <Text className="text-white text-xs font-bold">
                    {isDownloading ? "Downloading..." : "Open / Share File"}
                </Text>
                </Pressable>
            </View>
        );
    };

    // Welcome state when no materials are available or selected
    const renderEmptyViewer = () => {
        return (
        <View
            className="flex-1 rounded-2xl border border-dashed border-border flex-col justify-center items-center p-6 text-center"
            style={{ backgroundColor: cardBg }}
        >
            <View className="p-4 bg-primary/10 rounded-full mb-3">
            <Ionicons name="book" size={36} color={primaryColor} />
            </View>
            <Text className="text-text-strong font-bold text-base text-center mb-1">
            Welcome to your Course!
            </Text>
            <Text className="text-text-weak text-xs text-center px-4 leading-5">
            Select any section material or lecture from the syllabus tab below to start learning.
            </Text>
        </View>
        );
    };

    if (isGettingCourseWithMaterialsById) {
        return <CourseLearningSkeleton isDark={isDark} />;
    }

    //main component
    return (
        <ScrollView             
            className="w-full" 
            contentContainerStyle={{paddingBottom:100,gap:16}}
            showsVerticalScrollIndicator={false}
        >
        {/* Top Header */}
        <View
            className="flex-row items-center px-4 py-3 border-b border-border"
            style={{ backgroundColor: cardBg }}
        >
            <Pressable
                onPress={() => router.replace({pathname:"/(student)/(Library)"})}
                className="p-1 rounded-full active:bg-bg-1 mr-3"
            >
                <Ionicons name="arrow-back" size={24} color={strongText} />
            </Pressable>
            <View className="flex-1">
                <Text className="text-text-strong font-bold text-lg" numberOfLines={1}>
                    {courseWithMaterials?.title || "Course Material"}
                </Text>
                <Text className="text-text-weak text-[11px]" numberOfLines={1}>
                    {selectedMaterial?.title || "Syllabus Overview"}
            </Text>
            </View>
        </View>

        {/* Main Material Viewer Card (Fixed Height Area) */}
        <View className="px-4 pt-4 pb-2">
            <View
            style={styles.viewerContainer}
            className="shadow-sm overflow-hidden rounded-2xl border border-border"
            >
            {selectedMaterial ? renderMaterialContent(selectedMaterial) : renderEmptyViewer()}
            </View>
        </View>

        {/* Content Area */}
        <ScrollView
            className="flex-1 px-4"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Navigation Control Bar */}
            <View
            className="flex-row justify-between items-center p-3.5 border border-border rounded-xl shadow-xs mb-4"
            style={{ backgroundColor: cardBg }}
            >
            <Pressable
                disabled={!prevMaterial}
                onPress={() => prevMaterial && setSelectedMaterial(prevMaterial)}
                className={`flex-row items-center px-3 py-2 rounded-lg border border-border active:scale-95 transition-all ${
                !prevMaterial ? "opacity-40" : ""
                }`}
                style={{ backgroundColor: cardBg }}
            >
                <Ionicons name="chevron-back" size={16} color={strongText} />
                <Text
                style={{ color: strongText }}
                className="text-xs font-semibold ml-1"
                >
                Prev
                </Text>
            </Pressable>

            <Text className="text-text-weak text-[11px] font-medium text-center">
                {selectedMaterial && allMaterials.length > 0
                ? `Lesson ${currentIndex + 1} of ${allMaterials.length}`
                : `Select a Lesson`}
            </Text>

            <Pressable
                disabled={!nextMaterial}
                onPress={() => nextMaterial && setSelectedMaterial(nextMaterial)}
                className={`flex-row items-center px-3 py-2 rounded-lg border border-border active:scale-95 transition-all ${
                !nextMaterial ? "opacity-40" : ""
                }`}
                style={{ backgroundColor: cardBg }}
            >
                <Text
                style={{ color: strongText }}
                className="text-xs font-semibold mr-1"
                >
                Next
                </Text>
                <Ionicons name="chevron-forward" size={16} color={strongText} />
            </Pressable>
            </View>

            {/* Tab Headers (Segmented Controls) */}
            <View
            className="flex-row border border-border rounded-xl p-1.5 mb-4 justify-between"
            style={{ backgroundColor: cardBg }}
            >
            {(
                [
                { key: "syllabus", label: "Syllabus", icon: "book" },
                { key: "overview", label: "Overview", icon: "information-circle" },
                { key: "instructor", label: "Instructor", icon: "person" },
                ] as const
            ).map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                <Pressable
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key)}
                    className="flex-1 flex-row items-center justify-center py-2.5 rounded-lg transition-colors"
                    style={{
                    backgroundColor: isActive ? primaryColor : "transparent",
                    }}
                >
                    <Ionicons
                    name={tab.icon as any}
                    size={15}
                    color={isActive ? "#ffffff" : weakText}
                    style={{ marginRight: 6 }}
                    />
                    <Text
                    className={`text-xs font-bold ${
                        isActive ? "text-white" : "text-text-weak"
                    }`}
                    style={{ color: isActive ? "#ffffff" : weakText }}
                    >
                    {tab.label}
                    </Text>
                </Pressable>
                );
            })}
            </View>

            {/* Active Tab Panel */}
            {activeTab === "syllabus" && (
            <View className="space-y-3">
                {sortedSections.map((section, sIndex) => {
                const isExpanded = expandedSections[section.id || 0];
                const sectionMaterials = section.materials || [];

                return (
                    <View
                    key={section.id}
                    className="border border-border rounded-2xl overflow-hidden shadow-xs mb-3"
                    style={{ backgroundColor: cardBg }}
                    >
                    {/* Section Title Header */}
                    <Pressable
                        onPress={() => section.id && toggleSection(section.id)}
                        className="flex-row items-center justify-between p-4 border-none"
                        style={({ pressed }) => [
                        { opacity: pressed ? 0.9 : 1 },
                        ]}
                    >
                        <View className="flex-1 pr-2">
                        <Text className="text-text-weak text-[10px] uppercase tracking-wider font-bold">
                            Section {sIndex + 1}
                        </Text>
                        <Text className="text-text-strong font-bold text-sm mt-0.5" numberOfLines={1}>
                            {section.title}
                        </Text>
                        </View>

                        <View className="flex-row items-center gap-2">
                        <View className="px-2 py-0.5 rounded-full bg-bg-1 border border-border">
                            <Text className="text-[10px] font-semibold text-text-weak">
                            {sectionMaterials.length}{" "}
                            {sectionMaterials.length === 1 ? "item" : "items"}
                            </Text>
                        </View>
                        <Ionicons
                            name={isExpanded ? "chevron-down" : "chevron-forward"}
                            size={16}
                            color={weakText}
                        />
                        </View>
                    </Pressable>

                    {/* Section Materials List */}
                    {isExpanded && (
                        <View
                        className="border-t border-border/60"
                        style={{ backgroundColor: isDark ? "#0f172a" : "#fafafa" }}
                        >
                        {sectionMaterials.length === 0 ? (
                            <View className="p-4 items-center">
                            <Text className="text-text-weak text-xs">
                                No materials uploaded for this section.
                            </Text>
                            </View>
                        ) : (
                            sectionMaterials.map((material) => {
                            const isSelected = selectedMaterial?.id === material.id;
                            return (
                                <Pressable
                                key={material.id}
                                onPress={() => setSelectedMaterial(material)}
                                className="flex-row items-start p-3.5 border-b border-border/40 last:border-b-0 active:bg-bg-1"
                                style={{
                                    borderLeftWidth: isSelected ? 4 : 0,
                                    borderLeftColor: primaryColor,
                                    backgroundColor: isSelected ? accentColor : "transparent",
                                }}
                                >
                                <View className="mt-0.5 mr-3 shrink-0">
                                    {getMaterialIcon(material.type)}
                                </View>
                                <View className="flex-1">
                                    <Text
                                    className={`text-xs leading-snug font-medium ${
                                        isSelected ? "text-primary font-bold" : "text-text-strong"
                                    }`}
                                    numberOfLines={2}
                                    >
                                    {material.title}
                                    </Text>
                                    <Text className="text-text-weak text-[9px] uppercase mt-1">
                                    {material.type} •{" "}
                                    {material.size
                                        ? (material.size / 1024 / 1024).toFixed(2)
                                        : "0"}{" "}
                                    MB
                                    </Text>
                                </View>
                                </Pressable>
                            );
                            })
                        )}
                        </View>
                    )}
                    </View>
                );
                })}
            </View>
            )}

            {activeTab === "overview" && (
            <View
                className="border border-border p-5 rounded-2xl space-y-4"
                style={{ backgroundColor: cardBg }}
            >
                <Text className="text-text-strong font-bold text-base mb-2">
                About This Course
                </Text>
                <Text className="text-text-strong text-xs leading-5">
                {courseWithMaterials?.description ||
                    "No overview description details available for this course."}
                </Text>

                {/* Stats row */}
                <View className="flex-row pt-4 border-t border-border mt-4 justify-between">
                <View className="flex-1 flex-row items-center">
                    <View className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg mr-2">
                    <Ionicons name="globe-outline" size={16} color={primaryColor} />
                    </View>
                    <View>
                    <Text className="text-text-weak text-[10px]">Language</Text>
                    <Text className="text-text-strong font-bold text-xs" numberOfLines={1}>
                        {courseWithMaterials?.language || "English"}
                    </Text>
                    </View>
                </View>

                <View className="flex-1 flex-row items-center px-1">
                    <View className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg mr-2">
                    <Ionicons name="book-outline" size={16} color={primaryColor} />
                    </View>
                    <View>
                    <Text className="text-text-weak text-[10px]">Syllabus</Text>
                    <Text className="text-text-strong font-bold text-xs" numberOfLines={1}>
                        {courseWithMaterials?.sections?.length || 0} Sections
                    </Text>
                    </View>
                </View>

                <View className="flex-1 flex-row items-center">
                    <View className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg mr-2">
                    <Ionicons name="cash-outline" size={16} color={primaryColor} />
                    </View>
                    <View>
                    <Text className="text-text-weak text-[10px]">Access</Text>
                    <Text className="text-text-strong font-bold text-xs" numberOfLines={1}>
                        {courseWithMaterials?.price && courseWithMaterials.price > 0
                        ? `$${courseWithMaterials.price}`
                        : "Free Access"}
                    </Text>
                    </View>
                </View>
                </View>
            </View>
            )}

            {activeTab === "instructor" && (
            <View
                className="border border-border p-5 rounded-2xl flex-col items-center shadow-xs"
                style={{ backgroundColor: cardBg }}
            >
                {courseWithMaterials?.teacher?.user?.avatar_url ? (
                <Image
                    source={{ uri: courseWithMaterials?.teacher?.user?.avatar_url || '' }}
                    style={styles.avatar}
                    className="border-2 border-border mb-3"
                />
                ) : (
                <View
                    style={styles.avatarFallback}
                    className="border-2 border-border bg-bg-1 justify-center items-center mb-3"
                >
                    <Text className="text-text-strong font-extrabold text-2xl">
                    {courseWithMaterials?.teacher?.user?.name?.charAt(0).toUpperCase() || "I"}
                    </Text>
                </View>
                )}

                <Text className="text-text-strong font-bold text-base text-center">
                Dr. {courseWithMaterials?.teacher?.user?.name || "Instructor"}
                </Text>
                <Text className="text-primary text-[10px] uppercase font-bold tracking-wider mb-3">
                Instructor on LearnLink
                </Text>

                <View className="w-full border-t border-border pt-4 mt-2">
                <Text className="text-text-strong text-xs text-center leading-5 px-3">
                    {courseWithMaterials?.teacher?.bio ||
                    "Qualified instructor specializing in academic coursework. Contact via the internal message board for live sessions and Q&A scheduling."}
                </Text>
                </View>
            </View>
            )}
        </ScrollView>
        </ScrollView>
    );
}

// Mobile Skeleton component for a premium layout loading state
const CourseLearningSkeleton = ({ isDark }: { isDark: boolean }) => {
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
        ])
        ).start();
    }, []);

    const animatedStyle = {
        opacity: shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 0.9],
        }),
    };

    const cardBgStyle = {
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        borderColor: isDark ? "#334155" : "#e2e8f0",
    };

    return (
        <View className="flex-1 bg-bg-1">
        {/* Header bar skeleton */}
        <View
            className="flex-row items-center px-4 py-3 border-b border-border"
            style={cardBgStyle}
        >
            <Skeleton className="w-8 h-8 rounded-full mr-3" animatedStyle={animatedStyle} />
            <View className="flex-1 gap-1.5">
            <Skeleton className="w-3/4 h-5 rounded-md" animatedStyle={animatedStyle} />
            <Skeleton className="w-1/2 h-3.5 rounded-md" animatedStyle={animatedStyle} />
            </View>
        </View>

        {/* Main viewer skeleton */}
        <View className="px-4 pt-4 pb-2">
            <Skeleton className="w-full aspect-video rounded-2xl" animatedStyle={animatedStyle} />
        </View>

        <ScrollView className="flex-1 px-4 mt-2" contentContainerStyle={{ gap: 16 }}>
            {/* Navigation control skeleton */}
            <View
            className="flex-row justify-between items-center p-3.5 border rounded-xl"
            style={cardBgStyle}
            >
            <Skeleton className="w-16 h-8 rounded-lg" animatedStyle={animatedStyle} />
            <Skeleton className="w-24 h-4 rounded-md" animatedStyle={animatedStyle} />
            <Skeleton className="w-16 h-8 rounded-lg" animatedStyle={animatedStyle} />
            </View>

            {/* Tab headers skeleton */}
            <View
            className="flex-row border rounded-xl p-1.5 justify-between"
            style={cardBgStyle}
            >
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="flex-1 h-9 rounded-lg mx-1" animatedStyle={animatedStyle} />
            ))}
            </View>

            {/* List items skeleton */}
            <View className="gap-3">
            {[1, 2].map((i) => (
                <View
                key={i}
                className="border p-4 rounded-2xl"
                style={cardBgStyle}
                >
                <Skeleton className="w-1/2 h-5 rounded-md mb-3" animatedStyle={animatedStyle} />
                <View className="gap-2 pl-2">
                    <Skeleton className="w-full h-10 rounded-xl" animatedStyle={animatedStyle} />
                    <Skeleton className="w-full h-10 rounded-xl" animatedStyle={animatedStyle} />
                </View>
                </View>
            ))}
            </View>
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    viewerContainer: {
        width: "100%",
        aspectRatio: 16 / 9,
    },
    videoPlayer: {
        flex: 1,
        alignSelf: "stretch",
    },
    imageViewer: {
        flex: 1,
        alignSelf: "stretch",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarFallback: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
});