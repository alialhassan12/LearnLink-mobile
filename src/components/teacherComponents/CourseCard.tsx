import { Course } from "@/src/@types/course";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export default function CourseCard({ course }: { course: Course }) {
    const isPublished = course.status === "published";
    const isDraft = course.status === "draft";

    const statusColor = isPublished
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        : isDraft
        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
        : "bg-slate-500/20 text-slate-400 border border-slate-500/30";

    const statusDot = isPublished
        ? "bg-emerald-400"
        : isDraft
        ? "bg-amber-400"
        : "bg-slate-400";

    const handleViewCourse = () => {
        router.push({
            pathname:"/[CourseId]",
            params:{CourseId:String(course.id)}
        });
    };

    return (
        <View className="w-full bg-bg-2 rounded-2xl border border-border overflow-hidden">
            {/* Thumbnail */}
            <View className="relative w-full h-44">
                <Image
                    source={{ uri: course.thumbnail_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                {/* Gradient overlay */}
                <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Status badge — top-left */}
                <View className="absolute top-3 left-3">
                    <View className={`flex flex-row items-center gap-1.5 px-3 py-1 rounded-full ${statusColor}`}>
                        <View className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                        <Text className={`text-xs font-semibold capitalize ${statusColor.split(" ")[1]}`}>
                            {course.status ?? "unknown"}
                        </Text>
                    </View>
                </View>

                {/* Category — bottom-left over image */}
                {course.category?.title && (
                    <View className="absolute bottom-3 left-3 bg-black/50 px-2.5 py-1 rounded-lg">
                        <Text className="text-white text-xs font-semibold tracking-wide">
                            {course.category.title}
                        </Text>
                    </View>
                )}
            </View>

            {/* Body */}
            <View className="flex flex-col gap-3 p-4">
                {/* Title */}
                <Text
                    className="text-text-strong text-lg font-bold leading-tight"
                    numberOfLines={2}
                >
                    {course.title}
                </Text>

                {/* Description */}
                <Text
                    className="text-text-weak text-sm leading-relaxed"
                    numberOfLines={2}
                >
                    {course.description}
                </Text>

                {/* Divider */}
                <View className="border-t border-border" />

                {/* Meta row */}
                <View className="flex flex-row items-center justify-between">
                    {/* Price */}
                    <View className="flex flex-row items-center gap-1">
                        <Ionicons name="pricetag-outline" size={14} color="#6366f1" />
                        <Text className="text-primary font-bold text-base">
                            ${Number(course.price).toFixed(2)}
                        </Text>
                    </View>

                    {/* Rating (if available) */}
                    {course.course_reviews_avg_rating !== undefined && (
                        <View className="flex flex-row items-center gap-1">
                            <Ionicons name="star" size={13} color="#eab308" />
                            <Text className="text-yellow-500 font-semibold text-sm">
                                {Number(course.course_reviews_avg_rating).toFixed(1)}
                            </Text>
                            <Text className="text-text-weak text-xs">
                                ({course.course_reviews_count ?? 0})
                            </Text>
                        </View>
                    )}
                </View>

                {/* View Course Button */}
                <Pressable
                    onPress={handleViewCourse}
                    className="w-full mt-1 bg-primary rounded-xl py-3 flex flex-row items-center justify-center gap-2 active:opacity-80"
                >
                    <Ionicons name="eye-outline" size={18} color="white" />
                    <Text className="text-white font-bold text-base">View Course</Text>
                </Pressable>
            </View>
        </View>
    );
}