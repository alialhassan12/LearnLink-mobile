import { useCourseStore } from "@/src/store/courseStore";
import { useLocalSearchParams } from "expo-router/build/hooks";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/providers/ThemeProvider";
import CollapsibleSection from "@/src/components/teacherComponents/CollapsibleSection";

export default function TeacherCourseDetailsScreen() {
    const { CourseId } = useLocalSearchParams();
    const {
        courseWithMaterials,
        isGettingCourseWithMaterialsById,
        getCourseWithMaterialsById,
        courseReviews,
        isChangingCourseStatus,
        changeCourseStatus
    } = useCourseStore();

    const { isDark } = useTheme();

    useFocusEffect(
        useCallback(() => {
            getCourseWithMaterialsById(Number(CourseId));
        }, [CourseId])
    );

    if (isGettingCourseWithMaterialsById) {
        return <CourseDetailsSkeleton />;
    }

    const course = courseWithMaterials;

    return (
        <ScrollView
            className="flex-1 bg-bg-1"
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            {/* ── Header banner ── */}
            <View className="relative h-40">

                {/* Thumbnail overlapping */}
                {course?.thumbnail_url ? (
                    <Image
                        source={{ uri: course.thumbnail_url }}
                        className="w-full h-full rounded-xl "
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-full rounded-xl bg-bg-2 border-2 border-border items-center justify-center">
                        <Ionicons name="book-outline" size={32} color={isDark ? "#94a3b8" : "#64748b"} />
                    </View>
                )}

                {/* Status badge on banner top-right */}
                <View className="absolute top-4 right-4">
                    {course?.status === "draft" ? (
                        <View style={{backgroundColor:"#fecaca",borderColor:"#fecaca"}} className="rounded-full px-3 py-1">
                            <Text style={{color:"#ef4444"}} className=" text-xs font-bold uppercase tracking-widest">Draft</Text>
                        </View>
                    ) : (
                        <View style={{backgroundColor:"#bbf7d0" ,borderColor:"#bbf7d0"}} className="rounded-full px-3 py-1">
                            <Text style={{color:"#22c55e"}} className=" text-xs font-bold uppercase tracking-widest">Published</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* ── Course title & description ── */}
            <View className="px-5 mt-4">
                <Text className="text-text-strong text-xl font-bold leading-tight" numberOfLines={2}>
                    {course?.title || "Untitled Course"}
                </Text>
                {course?.description ? (
                    <Text className="text-text-weak text-sm mt-1 leading-relaxed" numberOfLines={3}>
                        {course.description}
                    </Text>
                ) : null}

                {/* Meta row */}
                <View className="flex-row flex-wrap gap-3 mt-3">
                    {course?.language ? (
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="language-outline" size={14} color={isDark ? "#94a3b8" : "#64748b"} />
                            <Text className="text-text-weak text-xs capitalize">{course.language}</Text>
                        </View>
                    ) : null}
                    {course?.category?.title ? (
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="grid-outline" size={14} color={isDark ? "#94a3b8" : "#64748b"} />
                            <Text className="text-text-weak text-xs">{course.category.title}</Text>
                        </View>
                    ) : null}
                    {course?.price !== undefined ? (
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="pricetag-outline" size={14} color={isDark ? "#94a3b8" : "#64748b"} />
                            <Text className="text-text-weak text-xs">
                                {course.price === 0 ? "Free" : `$${course.price}`}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>

            {/* ── Action buttons ── */}
            <View className="px-5 mt-5 flex-row gap-3">
                {/* Edit */}
                <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center gap-2 bg-bg-2 border border-border rounded-xl py-3 active:opacity-70"
                    disabled={isChangingCourseStatus}
                    onPress={() => {
                        router.push({
                            pathname:"/EditCourse/[CourseId]",
                            params:{CourseId:String(CourseId)}
                        });
                    }}
                >
                    <Ionicons name="pencil-outline" size={16} color={isDark ? "#94a3b8" : "#64748b"} />
                    <Text className="text-text-strong text-sm font-semibold">Edit</Text>
                </TouchableOpacity>

                {/* Publish / Unpublish */}
                {course?.status === "draft" ? (
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center gap-2 bg-primary rounded-xl py-3 active:opacity-70"
                        disabled={isChangingCourseStatus}
                        onPress={async() => {
                            await changeCourseStatus('published',Number(CourseId));
                            router.back();
                        }}
                    >
                        {isChangingCourseStatus?(
                            <ActivityIndicator/>
                        ):(
                            <>
                                <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
                                <Text className="text-white text-sm font-bold">Publish</Text>
                            </>
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center gap-2 bg-bg-2 border border-red-500 rounded-xl py-3 active:opacity-70"
                        disabled={isChangingCourseStatus}
                        onPress={async() => {
                            await changeCourseStatus('draft',Number(CourseId));
                            router.back();
                        }}
                    >
                        {isChangingCourseStatus?(
                            <ActivityIndicator color={"#ef4444"}/>
                        ):(
                            <>
                                <Ionicons name="archive-outline" size={16} color="#ef4444" />
                                <Text className="text-red-500 text-sm font-bold">Unpublish</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* ── Stats card ── */}
            <View className="px-5 mt-5">
                <View className="bg-bg-2 border border-border rounded-2xl p-4 flex-row items-center gap-4">
                    <View className="w-12 h-12 rounded-xl bg-primary/15 items-center justify-center">
                        <Ionicons name="people-outline" size={22} color="#0ea5e9" />
                    </View>
                    <View>
                        <Text className="text-text-weak text-xs font-medium">Total Enrollments</Text>
                        <Text className="text-text-strong text-2xl font-bold mt-0.5">
                            {course?.enrollments_count ?? 0}
                        </Text>
                    </View>
                </View>
            </View>

            {/* ── Course Sections ── */}
            <View className="px-5 mt-6">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-text-strong text-base font-bold">Course Sections</Text>
                    <View className="bg-bg-2 border border-border rounded-full px-3 py-1">
                        <Text className="text-text-weak text-xs font-medium">
                            {course?.sections?.length ?? 0} sections
                        </Text>
                    </View>
                </View>

                <View className="bg-bg-2 border border-border rounded-2xl overflow-hidden">
                    {course?.sections && course.sections.length > 0 ? (
                        course.sections.map((section, index) => (
                            <CollapsibleSection
                                key={section.id ?? index}
                                section={section}
                                isLast={index === (course.sections?.length ?? 0) - 1}
                                isDark={isDark}
                            />
                        ))
                    ) : (
                        <View className="p-8 items-center justify-center">
                            <View className="w-12 h-12 rounded-full bg-bg-1 border border-dashed border-border items-center justify-center mb-3">
                                <Ionicons name="folder-open-outline" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
                            </View>
                            <Text className="text-text-strong text-sm font-semibold">No Sections Yet</Text>
                            <Text className="text-text-weak text-xs mt-1 text-center">
                                No sections have been added to this course.
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* ── Reviews ── */}
            <View className="px-5 mt-6">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-text-strong text-base font-bold">Course Reviews</Text>
                    <View className="bg-bg-2 border border-border rounded-full px-3 py-1">
                        <Text className="text-text-weak text-xs font-medium">
                            {courseReviews?.length ?? 0} reviews
                        </Text>
                    </View>
                </View>

                {courseReviews && courseReviews.length > 0 ? (
                    <View className="flex flex-col gap-3">
                        {courseReviews.map((review) => {
                            const reviewerName = review.student?.user?.name || "Student";
                            const initials = reviewerName.slice(0, 2).toUpperCase();
                            const avatarUrl = review.student?.user?.avatar_url;

                            return (
                                <View
                                    key={review.id}
                                    className="bg-bg-2 border border-border rounded-2xl p-4 gap-3"
                                >
                                    {/* Reviewer row */}
                                    <View className="flex-row items-center gap-3">
                                        {avatarUrl ? (
                                            <Image
                                                source={{ uri: avatarUrl }}
                                                className="w-10 h-10 rounded-full border border-border"
                                            />
                                        ) : (
                                            <View className="w-10 h-10 rounded-full bg-primary/15 border border-border items-center justify-center">
                                                <Text className="text-primary text-xs font-bold">{initials}</Text>
                                            </View>
                                        )}
                                        <View className="flex-1">
                                            <Text className="text-text-strong text-sm font-bold" numberOfLines={1}>
                                                {reviewerName}
                                            </Text>
                                            <Text className="text-text-weak text-[11px]">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Stars */}
                                    <View className="flex-row items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Ionicons
                                                key={star}
                                                name={star <= review.rating ? "star" : "star-outline"}
                                                size={15}
                                                color={star <= review.rating ? "#f59e0b" : isDark ? "#334155" : "#cbd5e1"}
                                            />
                                        ))}
                                        <Text className="text-text-weak text-xs font-semibold ml-1.5">
                                            {review.rating} / 5
                                        </Text>
                                    </View>

                                    {/* Review text */}
                                    {review.review ? (
                                        <View className="bg-bg-1 border border-border/60 rounded-xl p-3">
                                            <Text className="text-text-strong text-xs leading-relaxed italic">
                                                "{review.review}"
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text className="text-text-weak text-xs italic">
                                            No written comment provided.
                                        </Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <View className="bg-bg-2 border border-border rounded-2xl p-6 items-center justify-center">
                        <View className="w-12 h-12 rounded-full bg-bg-1 border border-dashed border-border items-center justify-center mb-3">
                            <Ionicons name="star-outline" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
                        </View>
                        <Text className="text-text-strong text-sm font-semibold">No Reviews Yet</Text>
                        <Text className="text-text-weak text-xs mt-1 text-center max-w-[200px]">
                            Enrolled students haven't submitted any reviews yet.
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

/* ─────────────────────────────────────────
    Skeleton
───────────────────────────────────────── */
const CourseDetailsSkeleton = () => {
    return (
        <ScrollView className="flex-1 bg-bg-1" contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Banner skeleton */}
            <View className="h-36 bg-bg-2 animate-pulse" />

            <View className="px-5 mt-4 gap-3">
                {/* Title */}
                <View className="h-6 w-3/4 bg-bg-2 rounded-lg animate-pulse" />
                <View className="h-4 w-full bg-bg-2 rounded-md animate-pulse" />
                <View className="h-4 w-2/3 bg-bg-2 rounded-md animate-pulse" />

                {/* Buttons */}
                <View className="flex-row gap-3 mt-2">
                    <View className="flex-1 h-12 bg-bg-2 rounded-xl animate-pulse" />
                    <View className="flex-1 h-12 bg-bg-2 rounded-xl animate-pulse" />
                </View>

                {/* Stat card */}
                <View className="h-20 w-full bg-bg-2 rounded-2xl animate-pulse mt-1" />

                {/* Sections */}
                <View className="mt-2 gap-2">
                    <View className="h-5 w-36 bg-bg-2 rounded-md animate-pulse" />
                    <View className="h-16 w-full bg-bg-2 rounded-2xl animate-pulse" />
                    <View className="h-16 w-full bg-bg-2 rounded-2xl animate-pulse" />
                </View>

                {/* Reviews */}
                <View className="mt-2 gap-2">
                    <View className="h-5 w-36 bg-bg-2 rounded-md animate-pulse" />
                    <View className="h-24 w-full bg-bg-2 rounded-2xl animate-pulse" />
                </View>
            </View>
        </ScrollView>
    );
};