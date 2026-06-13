import { useTheme } from "@/src/providers/ThemeProvider";
import { useBrowseStore } from "@/src/store/studentStores/browseStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";

export default function CoursesScreen(){
    const {isDark}=useTheme();
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const {courses,getCourses,isGettingCourses,coursesPaginationData}=useBrowseStore();

    const scrollRef=useRef<ScrollView>(null);

    useEffect(()=>{
        if(courses.length===0){
            getCourses(1);
        }
    },[getCourses])

    const handleScrollToTop=()=>{
        scrollRef.current?.scrollTo({
            y:0,
            animated:true
        });
    }

    return(
        <ScrollView
            ref={scrollRef}
            className="w-full px-4"
            contentContainerStyle={{flexGrow:1,paddingBottom:100}}
            showsVerticalScrollIndicator={false}
        >
            {/* top section with filters */}
            <View className="flex flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-text-strong">Explore Courses</Text>
                <Pressable
                    className="p-3 bg-bg-2 rounded-lg border border-border"
                >
                    <FontAwesome5 name="sliders-h" size={20} color={strongText}/>
                </Pressable>
            </View>

            {/* courses list */}
            <View className="mt-6">
                {isGettingCourses &&(
                    Array.from({length:4}).map((_,index)=>{
                        return (
                            <View key={index} className="w-full mb-4">
                                <CourseCardSkeleton/>
                            </View>
                        );
                    })
                )}

                {!isGettingCourses && courses.length===0 && (
                    <View className="flex justify-center items-center">
                        <Text className="text-text-strong">No courses found </Text>
                        <Text className="text-text-weak">try to adjust the filter settings or search again.</Text>
                    </View>
                )}

                {!isGettingCourses && courses.length>0 &&(
                    <View className="flex flex-col gap-4"> 
                        {courses.map((course,index)=>{
                            return(
                                <View key={index} className="flex flex-col gap-2 bg-bg-2 w-full rounded-lg border border-border overflow-hidden">
                                    {/* course thumbnail */}
                                    <View className="w-full h-40">
                                        <Image 
                                            className="w-full h-full object-cover "
                                            source={{uri:course.thumbnail as string}}
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
                                        <View className="flex flex-row gap-2 items-center border-b border-border pb-4">
                                            {!course.teacher?.user?.avatar ? (
                                                <View className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                                    <Text className="text-white font-bold text-md">{course.teacher?.user?.name?.charAt(0).toUpperCase()}</Text>
                                                </View>
                                            ) : (
                                                <View className="w-8 h-8 rounded-full overflow-hidden">
                                                    <Image
                                                        source={{uri:course.teacher?.user?.avatar as string}}
                                                        className="w-full h-full rounded-full"
                                                    />
                                                </View>
                                            )}
                                            <Text className="text-text-weak font-semibold text-md">{course.teacher?.user?.name}</Text>
                                        </View>

                                        {/* price and enroll */}
                                        <View className="flex flex-row justify-between items-center mt-2">
                                            <Text className="text-primary text-lg font-bold">${course.price}</Text>
                                            <Pressable
                                                className="bg-primary rounded-lg px-4 py-2 active:scale-95 transition-all duration-300"
                                            >
                                                <Text className="text-white font-bold">Enroll</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}

                        {/* paginations */}
                        <View className="flex flex-row gap-2 items-center justify-center my-4">
                            {/* previous button */}
                            <Pressable
                                disabled={coursesPaginationData?.current_page===1}
                                className="bg-bg-2 text-text-strong border border-border px-3 py-2 rounded-full active:scale-95"
                                onPress={() => {
                                    getCourses(coursesPaginationData!.current_page - 1);
                                    handleScrollToTop();
                                }}
                            >
                                <Text className="text-md text-text-strong font-bold flex flex-row items-center gap-2">
                                    <FontAwesome5 name="chevron-left" size={13} color={strongText}/>
                                </Text>
                            </Pressable>

                            {/* page numbers */}
                            {Array.from({length:coursesPaginationData?.last_page!}).map((_,index)=>(
                                <Pressable
                                    key={index}
                                    className={`bg-bg-2 text-text-strong border border-border px-3 py-2 rounded-full active:scale-95 ${coursesPaginationData?.current_page===index+1 ?"bg-primary text-white":""}`}
                                    disabled={coursesPaginationData?.current_page===index+1}
                                    onPress={()=>{
                                        getCourses(index+1);
                                        handleScrollToTop();
                                    }}
                                >
                                    <Text className="text-md text-text-strong font-bold flex flex-row items-center gap-2">
                                        {index+1}
                                    </Text>
                                </Pressable>
                            ))}

                            {/* next button */}
                            <Pressable
                                disabled={coursesPaginationData?.current_page===coursesPaginationData?.last_page}
                                className="bg-bg-2 text-text-strong border border-border px-3 py-2 rounded-full active:scale-95"
                                onPress={() => {
                                    getCourses(coursesPaginationData!.current_page + 1);
                                    handleScrollToTop();
                                }}
                            >
                                <Text className="text-md text-text-strong font-bold flex flex-row items-center gap-2">
                                    <FontAwesome5 name="chevron-right" size={13} color={strongText}/>
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
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