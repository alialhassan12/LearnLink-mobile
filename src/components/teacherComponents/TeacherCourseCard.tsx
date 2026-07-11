import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Course } from "@/src/@types/course";

interface TeacherCourseCardProps {
    course: Course;
}

export default function TeacherCourseCard({ course }: TeacherCourseCardProps) {
    return (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: "/(teacher)/(Library)/(Courses)/[CourseId]",
                    params: { CourseId: course.id?.toString() as string },
                })
            }
            className="w-56 bg-bg-2 border border-border rounded-2xl overflow-hidden active:scale-95 transition-all duration-200"
        >
            <View className="w-full h-24">
                {course.thumbnail_url ? (
                    <Image source={{ uri: course.thumbnail_url }} className="w-full h-full" />
                ) : (
                    <View className="w-full h-full bg-primary/10 items-center justify-center">
                        <Ionicons name="book-outline" size={24} color="#64748b" />
                    </View>
                )}
            </View>

            <View className="p-3 gap-2">
                <Text className="text-text-strong font-semibold text-sm" numberOfLines={1}>
                    {course.title}
                </Text>

                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1">
                        <Ionicons name="people-outline" size={12} color="#64748b" />
                        <Text className="text-text-weak text-xs">
                            {course.enrollments_count ?? 0} students
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Ionicons name="star" size={10} color="#eab308" />
                        <Text className="text-text-weak text-xs">
                            {Number(course.course_reviews_avg_rating ?? 0).toFixed(1)}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-primary font-bold text-sm">${course.price}</Text>
                    <View className="px-2 py-0.5 rounded-full bg-primary/10">
                        <Text className="text-primary text-[10px] font-semibold">{course.status}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}
