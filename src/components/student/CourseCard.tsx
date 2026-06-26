import { Course } from "@/src/@types/course";
import { useCourseEnrollmentStore } from "@/src/store/studentStores/courseEnrollmentStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, Image, Pressable } from "react-native";

export default function CourseCard({course}:{course:Course}){
    const {enrolledCoursesIds}=useCourseEnrollmentStore();

    return(
        <View className="flex flex-col gap-2 bg-bg-2 w-full rounded-lg border border-border overflow-hidden">
            {/* course thumbnail */}
            <View className="w-full h-40">
                <Image 
                    className="w-full h-full object-cover "
                    source={{uri:course.thumbnail_url as string}}
                />
            </View>

            <View className="flex flex-col gap-2 p-4">
                {/* category */}
                <Text className="text-text-weak font-semibold px-2 py-1 max-w-36 bg-blue-500/20 rounded-lg text-sm tracking-wider">
                    {course.category?.title}
                </Text>

                {/* course details */}
                <Text className="text-text-strong text-lg font-semibold">
                    {course.title}
                </Text>
                {/* teacher avatar and name */}
                <View className="flex flex-col gap-2  border-b border-border pb-4">
                    <View className="flex flex-row gap-2 items-center ">
                        {!course.teacher?.user?.avatar_url ? (
                            <View className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <Text className="text-white font-bold text-md">{course.teacher?.user?.name?.charAt(0).toUpperCase()}</Text>
                            </View>
                        ) : (
                            <View className="w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                    source={{uri:course.teacher?.user?.avatar_url as string}}
                                    className="w-full h-full rounded-full"
                                />
                            </View>
                        )}
                        <Text className="text-text-weak font-semibold text-md">{course.teacher?.user?.name}</Text>
                    </View>
                    <View className="flex flex-row items-center gap-1">
                        <FontAwesome5 name="star" size={12} color="#eab308"/>
                        <Text className="text-yellow-500 text-sm font-semibold ">{Number(course.course_reviews_avg_rating).toFixed(1)}</Text>
                        <Text className="text-sm text-text-weak">({course.course_reviews_count} reviews)</Text>
                    </View>
                </View>

                {/* price and enroll */}
                <View className="flex flex-row justify-between items-center mt-2">
                    <Text className="text-primary text-lg font-bold">${course.price}</Text>
                    {enrolledCoursesIds.includes(course?.id as number)?(
                        <Pressable
                            onPress={()=>{
                                router.replace({
                                    pathname:"/(student)/(Library)/Learnings/CourseLearning",
                                    params:{
                                        courseId:course?.id
                                    }
                                })
                            }}
                            className="bg-transparent border border-border rounded-lg px-4 py-2 active:scale-95 transition-all duration-300"
                        >
                            <Text className="text-text-strong font-bold">Go to course</Text>
                        </Pressable>
                    ):(
                        <Pressable
                            onPress={()=>{
                                router.push({
                                    pathname:"/(student)/(Courses)/[CourseId]",
                                    params:{
                                        CourseId:course.id?.toString() as string
                                    }
                                });
                            }}
                            className="bg-primary rounded-lg px-4 py-2 active:scale-95 transition-all duration-300"
                        >
                            <Text className="text-white font-bold">Enroll</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    );
}