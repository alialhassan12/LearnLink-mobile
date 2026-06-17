import { useCourseStore } from "@/src/store/courseStore";
import { useTheme } from "@/src/providers/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, View,Image, Dimensions, Pressable } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useCourseEnrollmentStore } from "@/src/store/studentStores/courseEnrollmentStore";

export default function CourseDetailsScreen(){
    const {CourseId}=useLocalSearchParams();
    const {course,getCourse,isGettingCourse}=useCourseStore();
    const {enroll,isEnrolling,enrolledCoursesIds}=useCourseEnrollmentStore();
    const {isDark}=useTheme();

    const primaryColor = isDark ? "#3b82f6" : "#2563eb";

    useEffect(()=>{
        if(CourseId){
            getCourse(Number(CourseId));
        }
    },[CourseId,getCourse]);

    if(false){
        return(
            <View className="flex justify-center items-center w-full h-full">
                <ActivityIndicator size={"large"} color={primaryColor}/>
            </View>
        );
    }

    return(
        <ScrollView
            className="px-4 w-full" 
            contentContainerStyle={{flexGrow:1,paddingBottom:100}}
            showsVerticalScrollIndicator={false}
        >
            <View className="flex flex-col gap-4 justify-center items-center mt-8 px-2 py-1">
                {/* course thumbnail */}
                <View className="relative w-full h-48 rounded-2xl overflow-hidden">
                    {true?(
                        <Image
                            source={{uri:course?.thumbnail as string}}
                            className="w-full h-full" />
                    ):(
                        <View className="w-full h-full flex justify-center items-center bg-b-2 border border-border">
                            <Text className={`text-2xl font-bold text-text-strong`}>No Thumbnail</Text>
                        </View>
                    )}
                    <View className="absolute bottom-0 left-0">
                        <Text className="text-white px-3 py-1 text-sm font-semibold bg-primary rounded-r-2xl">{course?.category?.title}</Text>
                    </View>
                </View>
                <View className="w-full px-2 flex flex-col gap-2">
                    <Text className="text-3xl font-bold text-text-strong">{course?.title}</Text>
                    <Text className="text-3xl text-primary">$ {course?.price}</Text>
                </View>

                <View className="flex-col gap-2 mt-4 w-full">
                    <Text className="text-2xl font-bold text-text-strong">About this course</Text>
                    <View className="w-full bg-bg-2 border border-border rounded-xl p-6">
                        <Text className="text-lg text-text-weak">{course?.description}</Text>
                    </View>
                </View>
                <View className="flex-col gap-2 mt-4 w-full">
                    <Text className="text-2xl font-bold text-text-strong">Course Curriculum</Text>
                    <View className="flex-col gap-3 mt-3">
                        {course?.sections?.map((section,index)=>{
                            return(
                                <View 
                                    key={index}
                                    className="w-full flex-row justify-between items-center border border-border rounded-2xl p-4 bg-bg-2"
                                >
                                    <View className="flex-row justify-center items-center gap-3">
                                        <View className="p-2 bg-bg-1 rounded-full">
                                            <FontAwesome5 name="play-circle" size={24} color={primaryColor} />
                                        </View>
                                        <Text className="text-text-strong text-lg font-bold">Section {index+1}: {section.title}</Text>
                                    </View>
                                    <Text className="text-text-weak text-sm font-semibold">set of materials</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
                <View className="flex-col gap-2 mt-4 w-full">
                    <Text className="text-2xl font-bold text-text-strong">Meet Your Instructor</Text>
                    <View className="flex flex-col gap-3 p-3 border border-border rounded-2xl bg-bg-2 mt-3">
                        <View className="flex-row gap-2 items-center">
                            {course?.teacher?.user?.avatar?(
                                <View className="w-16 h-16 rounded-2xl overflow-hidden">
                                    <Image
                                        source={{uri:course?.teacher?.user?.avatar as string}}
                                        className="w-full h-full"
                                    />
                                </View>
                            ):(
                                <View className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-bg-1">
                                    <Text className="text-xl font-bold text-primary">{course?.teacher?.user?.name.charAt(0).toUpperCase()}</Text>
                                </View>
                            )}
                            <View>
                                <Text className="text-xl font-bold text-text-strong">{course?.teacher?.user?.name}</Text>
                                <Text className="text-sm font-semibold text-primary line-clamp-1 overflow-hidden w-1/2" >{course?.teacher?.headline}</Text>
                            </View>
                        </View>
                        <View>
                            <Text className="text-md text-text-weak text-semibold text-start line-clamp-4">{course?.teacher?.bio}</Text>
                        </View>
                        <Pressable
                            onPress={()=>router.replace({
                                pathname:"/(student)/(Teachers)/TeacherProfile",
                                params:{
                                    id:course?.teacher?.id?.toString()
                                }
                            })}
                            className="flex flex-row justify-center items-center py-2 px-4 rounded-2xl border border-border bg-transparent w-full active:scale-95 transition-all duration-200"
                        >
                            <Text className="text-text-strong text-lg font-bold">View Profile</Text>
                        </Pressable>
                    </View>
                    {/* enroll course*/}
                    {enrolledCoursesIds.includes(Number(CourseId))?(
                        <Pressable
                            onPress={()=>{}}
                            className="flex flex-row justify-center items-center py-2 px-4 mt-2 rounded-2xl border border-border bg-transparent w-full active:scale-95 transition-all duration-200"
                        >
                            <View className="flex flex-row gap-3 justify-center items-center">
                                <Text className="text-text-strong text-lg font-bold">Go to course</Text>
                                <Ionicons name="arrow-forward" size={30} color={primaryColor}/>
                            </View>
                        </Pressable>
                    ):(
                        <Pressable
                        disabled={isEnrolling}
                        onPress={()=>enroll(Number(CourseId))}
                        className="flex flex-row justify-center items-center py-2 px-4 mt-2 rounded-2xl border border-border bg-transparent w-full active:scale-95 transition-all duration-200"
                    >
                        {isEnrolling?(
                            <View className="flex-row justify-center items-center gap-2">
                                <ActivityIndicator size={"small"} color={primaryColor}/>
                                <Text className="text-text-weak text-lg font-bold">Enrolling...</Text>
                            </View>
                        ):(
                            <View className="flex-row justify-center items-center gap-1">
                                <View className="flex flex-col justify-center items-center">
                                    <View className="text-text-strong text-lg font-bold flex flex-row">
                                        <Text className="text-text-strong text-lg font-bold">Enroll now for </Text>
                                        <Text className="text-primary text-lg font-bold">${course?.price}</Text>
                                    </View>
                                    <Text className="text-text-weak text-sm font-semibold">Get lifetime access to this course</Text>
                                </View>
                                <View>
                                    <Ionicons name="arrow-forward" size={30} color={primaryColor}/>
                                </View>
                            </View>
                        )}
                    </Pressable>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}