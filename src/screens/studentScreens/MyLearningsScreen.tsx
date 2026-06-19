import Input from "@/src/components/Input";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useCourseEnrollmentStore } from "@/src/store/studentStores/courseEnrollmentStore";
import Skeleton from "@/src/components/Skeleton";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, ScrollView, Text, View } from "react-native";

export default function MyLearningsScreen(){
    const {isDark}=useTheme();
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const weakColor= isDark ? "#64748b" : "#94a3b8";

    const {enrollments,getEnrollments,isGettingEnrollments,enrollmentsPagination}=useCourseEnrollmentStore();
    const [searchInp,setSearchInp]=useState<string>('');
    const scrollRef=useRef<ScrollView>(null);
    
    const [filterTab,setFilterTab]=useState<'all' | 'completed' | 'in_progress'>('all');
    const filters=['all','in_progress','completed'];

    useEffect(()=>{
        getEnrollments();
    },[]);

    const filteredEnrollments=enrollments.filter((enrollment)=>{
        const matchTab=(()=>{
            if(filterTab === "all") return true;
            if(filterTab === "in_progress" && enrollment.progress < 100) return true;
            if(filterTab === "completed" && enrollment.progress === 100) return true;
            return false;
        })();
        const matchSearch=enrollment.course?.title.toLowerCase().includes(searchInp.toLowerCase());
        return matchTab && matchSearch;
    });
    
    const cards = [
        {
            id: 0,
            title: "Course Enrolled",
            value: enrollments?.length || 0,
            icon:"book-open"
        },
        {
            id: 1,
            title: "Course Completed",
            value: enrollments?.filter((enrollment) => enrollment.progress === 100)?.length || 0,
            icon:"book-reader"
        }
    ];

    const handleScrollToTop=()=>{
        scrollRef.current?.scrollTo({
            y:0,
            animated:true
        });
    };

    if(isGettingEnrollments){
        return <LearningsSkeleton/>;
    }

    return(
        <ScrollView
            ref={scrollRef}
            className="px-4 w-full" 
            contentContainerStyle={{paddingBottom:100,gap:16}}
            showsVerticalScrollIndicator={false}
        >
            <View className="flex flex-col justify-center gap-2 mt-4">
                <Text className="text-3xl font-bold text-text-strong">My Learnings</Text>
                <Text className="text-text-weak text-lg font-light">Continue your courses and track your progress.</Text>
            </View>
            {/* cards */}
            <View className="flex-row gap-2 items-center">
                {cards.map(card=>{
                    return(
                        <View
                            key={card.id}
                            className="flex flex-col justify-center gap-2 p-4 bg-bg-2 border border-border rounded-3xl min-w-[150px] max-h-[150px] active:opacity-90 transition-all duration-300 group"
                        >
                            <View className={` bg-primary p-2 w-11 h-11 items-center justify-center rounded-2xl group-active:scale-110 transition-all duration-300`}>
                                <FontAwesome5 name={card.icon} size={24} color="#fff" />
                            </View>
                            <Text className="text-text-weak uppercase font-semi-bold">{card.title}</Text>
                            <Text className="text-text-strong font-bold text-2xl">{card.value}</Text>
                        </View>
                    );
                })}
            </View>

            {/* search bar */}
            <View className="relative">
                <FontAwesome5 className="absolute top-4 left-4 z-10" name="search" size={18} color={weakColor}/>
                <Input
                    value={searchInp}
                    onChangeText={setSearchInp}
                    placeholderTextColor={weakColor}
                    placeholder="Search courses"
                    className="pl-12 rounded-full"
                />
            </View>

            {/* filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 8}}
            >
                {filters.map((filter,index)=>{
                    return (
                        <Pressable
                            key={index}
                            className={`px-5 py-2 min-w-[100px] items-center justify-center rounded-full border bg-bg-2 border-border ${
                                filter === filterTab ? "bg-primary " : ""
                            }`}
                            onPress={()=>setFilterTab(filter as 'all' | 'in_progress' | 'completed')}
                        >
                            <Text className={`${filter===filterTab?"text-white":'text-text-strong'} font-bold`}>
                                {
                                filter.charAt(0).toUpperCase()+filter.slice(1)
                            }
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* list of courses */}
            {
                filteredEnrollments.length ===0?(
                    <View className="flex-1 items-center justify-center border-2 border-dashed border-border rounded-2xl py-20 mt-4">
                        <View className="flex-col items-center gap-4">
                            <View className="w-16 h-16 items-center justify-center bg-gray-100 rounded-full border-dashed">
                                <FontAwesome5 name="book" size={30} />
                            </View>
                            <Text className="text-text-strong text-lg font-bold">No Courses Found!</Text>
                            <Text className="text-text-weak text-center w-64">Adjust filters or enroll in courses now to get started</Text>
                            <Pressable 
                                onPress={()=>router.push("/(student)/(Courses)")}
                                className="mt-4 bg-primary px-6 py-3 rounded-full active:opacity-90 transition-opacity">
                                <Text className="text-white font-bold">Find a Course</Text>
                            </Pressable>
                        </View>
                    </View>
                ):(
                    filteredEnrollments.map((enrollment,index)=>{
                        return(
                            <View 
                                key={index} 
                                className="flex flex-col justify-start items-center bg-bg-2 border border-border rounded-lg overflow-hidden group "
                            >
                                <Image
                                    source={{uri:enrollment.course?.thumbnail_url}}
                                    className="w-full h-48 object-cover"
                                />
                                <View className="flex flex-col gap-2 p-4 w-full">
                                    {/* teacher */}
                                    <View className="flex-row items-center gap-2">
                                        {enrollment.course?.teacher?.user?.avatar_url ? (
                                            <Image
                                                source={{uri:enrollment.course.teacher.user.avatar_url}}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <View className="w-8 h-8 rounded-full border border-border bg-bg-1 flex items-center justify-center">
                                                <Text className="text-text-weak font-bold">{enrollment.course?.teacher?.user?.name[0].toUpperCase()}</Text>
                                            </View>
                                        )}
                                        <Text className="text-md font-medium text-text-weak">{enrollment.course?.teacher?.user?.name}</Text>
                                    </View>

                                    <Text className="text-xl font-bold text-text-strong">
                                        {enrollment.course?.title}
                                    </Text>

                                    {/* progress bar */}
                                    <View className="flex flex-col gap-2 mt-2">
                                        <Text className="text-text-weak text-sm font-semi-bold">
                                            Progress: {enrollment.progress}%
                                        </Text>
                                        <View className="w-full bg-bg-1 border border-border rounded-full h-5">
                                            <View
                                                className="bg-primary h-full rounded-full"
                                                style={{ width: `${enrollment.progress}%` }}
                                            />
                                        </View>
                                    </View>

                                    <Pressable
                                        className="flex-row items-center gap-2 bg-primary p-3 rounded-full justify-center mt-2 active:opacity-90 active:scale-95 ease-out transition-all"
                                        // onPress={()=>router.push(`/Courses/${enrollment.course?.id}`)}
                                    >
                                        <Text className="text-white font-semi-bold">Continue Learning</Text>
                                        <FontAwesome5 name="arrow-right" size={12} color="white" />
                                    </Pressable>
                                </View>
                            </View>
                        );
                    })
                )
            }

            {/* pagination */}
            {enrollmentsPagination && enrollmentsPagination.last_page > 1 && (
                        <View className="flex flex-row gap-2 items-center justify-center my-4">
                            {/* previous button */}
                            <Pressable
                                disabled={enrollmentsPagination?.current_page===1}
                                className="bg-bg-2 text-text-strong border border-border px-3 py-2 rounded-full active:scale-95"
                                onPress={() => {
                                    getEnrollments(enrollmentsPagination!.current_page - 1);
                                    handleScrollToTop();
                                }}
                            >
                                <Text className="text-md text-text-strong font-bold flex flex-row items-center gap-2">
                                    <FontAwesome5 name="chevron-left" size={13} color={strongText}/>
                                </Text>
                            </Pressable>

                            {/* page numbers */}
                            {Array.from({length:enrollmentsPagination?.last_page!}).map((_,index)=>(
                                <Pressable
                                    key={index}
                                    className={`bg-bg-2 text-text-strong border border-border px-3 py-2 rounded-full active:scale-95 ${enrollmentsPagination?.current_page===index+1 ?"bg-primary text-white":""}`}
                                    disabled={enrollmentsPagination?.current_page===index+1}
                                    onPress={()=>{
                                        getEnrollments(index+1);
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
                                disabled={enrollmentsPagination?.current_page===enrollmentsPagination?.last_page}
                                className="bg-bg-2 text-text-strong border border-border px-3 py-2 rounded-full active:scale-95"
                                onPress={() => {
                                    getEnrollments(enrollmentsPagination!.current_page + 1);
                                    handleScrollToTop();
                                }}
                            >
                                <Text className="text-md text-text-strong font-bold flex flex-row items-center gap-2">
                                    <FontAwesome5 name="chevron-right" size={13} color={strongText}/>
                                </Text>
                            </Pressable>
                        </View>
            )}
        </ScrollView>
    );
}

const LearningsSkeleton = () => {
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

    return (
        <ScrollView
            className="px-4 w-full"
            contentContainerStyle={{ paddingBottom: 100, gap: 16 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header skeleton */}
            <View className="flex flex-col gap-2 mt-4">
                <Skeleton className="h-8 w-48 rounded-lg" animatedStyle={animatedStyle} />
                <Skeleton className="h-5 w-72 rounded-md" animatedStyle={animatedStyle} />
            </View>

            {/* Stats Cards skeleton */}
            <View className="flex-row gap-2 items-center">
                {[1, 2].map((i) => (
                    <View
                        key={i}
                        className="flex flex-col justify-center gap-2 p-4 bg-bg-2 border border-border rounded-3xl min-w-[150px] max-h-[150px] w-[150px]"
                    >
                        <Skeleton className="w-11 h-11 rounded-2xl" animatedStyle={animatedStyle} />
                        <Skeleton className="h-3 w-20 rounded-md" animatedStyle={animatedStyle} />
                        <Skeleton className="h-6 w-10 rounded-md" animatedStyle={animatedStyle} />
                    </View>
                ))}
            </View>

            {/* Search bar skeleton */}
            <Skeleton className="h-12 w-full rounded-full" animatedStyle={animatedStyle} />

            {/* Filters skeleton */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
            >
                {[1, 2, 3].map((i) => (
                    <Skeleton
                        key={i}
                        className="h-9 w-24 rounded-full"
                        animatedStyle={animatedStyle}
                    />
                ))}
            </ScrollView>

            {/* Course card list skeleton */}
            <View className="gap-4">
                {[1, 2].map((i) => (
                    <View
                        key={i}
                        className="flex flex-col justify-start items-center bg-bg-2 border border-border rounded-lg overflow-hidden"
                    >
                        {/* Course Image skeleton */}
                        <Skeleton className="w-full h-48" animatedStyle={animatedStyle} />
                        
                        {/* Content container skeleton */}
                        <View className="flex flex-col gap-3 p-4 w-full">
                            {/* Teacher row */}
                            <View className="flex-row items-center gap-2">
                                <Skeleton className="w-8 h-8 rounded-full" animatedStyle={animatedStyle} />
                                <Skeleton className="h-4 w-32 rounded-md" animatedStyle={animatedStyle} />
                            </View>

                            {/* Title */}
                            <Skeleton className="h-6 w-3/4 rounded-md" animatedStyle={animatedStyle} />

                            {/* Progress bar */}
                            <View className="flex flex-col gap-2 mt-2">
                                <Skeleton className="h-3 w-24 rounded-md" animatedStyle={animatedStyle} />
                                <Skeleton className="w-full h-5 rounded-full" animatedStyle={animatedStyle} />
                            </View>

                            {/* Action Button */}
                            <Skeleton className="h-12 w-full rounded-full mt-2" animatedStyle={animatedStyle} />
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}