import CourseCard from "@/src/components/teacherComponents/CourseCard";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useCourseStore } from "@/src/store/courseStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function CoursesIndexScreen(){
    const { isDark } = useTheme();
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const {teacherCourses,getTeacherCourses,maxCoursesAllowed,isGettingTeacherCourses}=useCourseStore();
    
    const [filterTab,setFilterTab]=useState<string>('all');
    const scrollRef = useRef<FlatList>(null);

    useEffect(()=>{
        getTeacherCourses();
    },[getTeacherCourses]);

    const filteredCourses=teacherCourses.filter((course)=>filterTab === "all" || course.status===filterTab);
    const filtertabs=[
        {id:0,label:'all'},
        {id:1,label:'published'},
        {id:2,label:'draft'}
    ];

    const coursesPublishedCount=teacherCourses.filter((course)=>course.status==="published").length;

    const handleScrollToTop=()=>{
        scrollRef.current?.scrollToOffset({
            offset:0,
            animated:true
        });
    };

    return(
        <View
            className="flex-1 px-4 w-full"
        >
            <View className="flex flex-col gap-2 mt-6">
                <Text className="text-text-strong text-2xl font-semibold">My Courses</Text>
                <Text className="text-text-weak text-sm font-semibold">Manage your courses and track their performance.</Text>
            </View>
            <Pressable
                className="w-full p-4 mt-4 bg-primary rounded-xl active:scale-95 transition-all duration-300"
                onPress={()=>router.push('/CreateCourse/Step1')}
            >
                <View className="flex flex-row items-center justify-center gap-2">
                    <Ionicons name="add-circle" size={24} color={strongText}/>
                    <Text className="text-text-strong text-lg font-semibold">Create Course</Text>
                </View>
            </Pressable>
            
            <View className="mt-4">
                {isGettingTeacherCourses?(
                    <Text className="text-text-weak text-sm">Loading...</Text>
                ):(
                    <View >
                        <Text className={`text-sm ${coursesPublishedCount>=maxCoursesAllowed && maxCoursesAllowed!==-1?"text-red-500":"text-text-weak"}`}>
                            {`${coursesPublishedCount}/${maxCoursesAllowed===-1?"Unlimited":maxCoursesAllowed} courses published`}
                        </Text>
                        {coursesPublishedCount>=maxCoursesAllowed && maxCoursesAllowed!==-1 &&(
                            <Text className="text-red-500 line-clamp-2">Upgrade your subscription to publish more courses. You can still save courses as draft.</Text>
                        )}
                    </View>
                )}
            </View>
            
            {/* filters */}
            <View className="w-full mt-2 flex flex-row items-center justify-center gap-2">
                {filtertabs.map((tab)=>{
                    const isActive=filterTab===tab.label;
                    return(
                        <TouchableOpacity
                            key={tab.id}
                            onPress={()=>setFilterTab(tab.label)}
                            className={`rounded-full px-6 py-3 border-2 mb-5 ${
                                isActive ? 'bg-primary border-primary' : 'border-border bg-bg-2'
                            }`}
                        >
                            <Text className={`font-semibold text-base ${
                                isActive ? 'text-white' : 'text-text-strong'
                            }`}>
                                {tab.label.charAt(0).toUpperCase() + tab.label.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {isGettingTeacherCourses?(
                <FlatList
                    data={[1,2,3]}
                    className="w-full"
                    style={{marginBottom:90}}
                    contentContainerStyle={{gap:12}}
                    keyExtractor={(item)=>item.toString()}
                    renderItem={()=>(<CourseCardSkeleton/>)}
                    showsVerticalScrollIndicator={false}
                />
            ):(
                <FlatList
                    ref={scrollRef}
                    data={filteredCourses}
                    className="w-full"
                    style={{marginBottom:90}}
                    contentContainerStyle={{gap:12}}
                    keyExtractor={(item)=>item.id.toString()}
                    renderItem={({item})=>(
                        <CourseCard course={item}/>
                    )}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<EmptyList/>}
                    refreshing={isGettingTeacherCourses}
                    onRefresh={getTeacherCourses}
                    
                />
            )}
        </View>
    );
}

const EmptyList=()=>{
    return (
        <View className="flex justify-center items-center w-full border-2 border-dashed border-border rounded-xl p-6 h-40 mt-5">
            <Text className="text-text-strong font-medium text-lg">No courses found for this filter</Text>
        </View>
    );
}

const CourseCardSkeleton=()=>{
    return (
        <View className="flex flex-col gap-2 bg-bg-2 w-full rounded-lg border border-border overflow-hidden">
            {/* Thumbnail */}
            <View className="w-full h-40 bg-bg-1 animate-pulse" />

            <View className="flex flex-col gap-3 p-4">
                {/* Category */}
                <View className="h-7 w-24 bg-bg-1 rounded-lg animate-pulse" />

                {/* Title */}
                <View className="gap-2">
                    <View className="h-6 w-full bg-bg-1 rounded-md animate-pulse" />
                    <View className="h-6 w-3/4 bg-bg-1 rounded-md animate-pulse" />
                </View>

                {/* Teacher */}
                <View className="flex-row gap-2 items-center border-b border-border pb-4">
                    <View className="w-8 h-8 rounded-full bg-bg-1 animate-pulse" />
                    <View className="h-4 w-32 bg-bg-1 rounded-md animate-pulse" />
                </View>

                {/* Price and Button */}
                <View className="flex-row justify-between items-center mt-2">
                    <View className="h-6 w-16 bg-bg-1 rounded-md animate-pulse" />

                    <View className="h-10 w-24 bg-bg-1 rounded-lg animate-pulse" />
                </View>
            </View>
        </View>
    )
}