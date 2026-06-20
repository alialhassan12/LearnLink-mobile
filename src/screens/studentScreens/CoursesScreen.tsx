import CourseCard from "@/src/components/student/CourseCard";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useBrowseStore } from "@/src/store/studentStores/browseStore";
import { useCourseEnrollmentStore } from "@/src/store/studentStores/courseEnrollmentStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { RelativePathString, router } from "expo-router";
import { useEffect, useRef } from "react";
import { View, Text, ScrollView, Pressable, Image, FlatList } from "react-native";

export default function CoursesScreen(){
    const {isDark}=useTheme();
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const {courses,getCourses,isGettingCourses,coursesPaginationData}=useBrowseStore();
    const {enrolledCoursesIds}=useCourseEnrollmentStore();

    const scrollRef=useRef<FlatList>(null);

    useEffect(()=>{
        if(courses.length===0){
            getCourses(1);
        }
    },[getCourses])

    const handleScrollToTop=()=>{
        scrollRef.current?.scrollToOffset({
            offset:0,
            animated:true
        });
    }

    const loadMoreCourses=async()=>{
        if(isGettingCourses) return;
        if(coursesPaginationData?.current_page===coursesPaginationData?.last_page) return;
        
        const nextPage=coursesPaginationData?.current_page!+1;
        if(nextPage <= coursesPaginationData?.last_page!){
            await getCourses(nextPage);
        }
    }

    return(
        <View className="w-full px-4">
            {/* top section with filters */}
            <View className="flex flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold text-text-strong">Explore Courses</Text>
                <Pressable
                    className="p-3 bg-bg-2 rounded-lg border border-border"
                >
                    <FontAwesome5 name="sliders-h" size={20} color={strongText}/>
                </Pressable>
            </View>

            {/* flatlist for courses */}
            {isGettingCourses?(
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{marginBottom:140}}
                    data={[...Array(6)]}
                    keyExtractor={(item,idx)=>String(idx)}
                    renderItem={()=>(
                        <View className="w-full mb-2">
                            <CourseCardSkeleton />
                        </View>
                    )}
                />
            ):(
                <FlatList
                    ref={scrollRef}
                    data={courses}
                    style={{marginBottom:140}}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item})=>(
                        <View className="w-full mb-2">
                            <CourseCard course={item}/>
                        </View>
                    )}
                    refreshing={isGettingCourses}
                    onRefresh={()=>{getCourses(1);handleScrollToTop();}}
                    onEndReached={loadMoreCourses}
                    onEndReachedThreshold={0.5}
                    keyExtractor={(item)=>String(item.id)}
                    ListEmptyComponent={
                        <View className="flex justify-center items-center">
                            <Text className="text-text-strong">No courses found </Text>
                            <Text className="text-text-weak">try to adjust the filter settings or search again.</Text>
                        </View>
                    }
                />
            )}
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