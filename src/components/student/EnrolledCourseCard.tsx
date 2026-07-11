import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Enrollment } from "@/src/@types/enrollments";

interface EnrolledCourseCardProps {
    enrollment: Enrollment;
}

export default function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
    const course = enrollment.course;
    const progress = enrollment.progress ?? 0;

    return (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: "/(student)/(Library)/Learnings/CourseLearning",
                    params: { courseId: course?.id?.toString() as string },
                })
            }
            className="w-56 bg-bg-2 border border-border rounded-2xl overflow-hidden active:scale-95 transition-all duration-200"
        >
            <View className="w-full h-24">
                {course?.thumbnail_url ? (
                    <Image source={{ uri: course.thumbnail_url }} className="w-full h-full" />
                ) : (
                    <View className="w-full h-full bg-primary/10 items-center justify-center">
                        <Ionicons name="book-outline" size={24} color="#64748b" />
                    </View>
                )}
            </View>

            <View className="p-3 gap-2">
                <Text className="text-text-strong font-semibold text-sm" numberOfLines={1}>
                    {course?.title}
                </Text>

                <View className="w-full bg-border rounded-full h-1.5">
                    <View
                        className="bg-primary rounded-full h-1.5"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </View>

                <Text className="text-text-weak text-xs">{Math.round(progress)}% complete</Text>
            </View>
        </Pressable>
    );
}
