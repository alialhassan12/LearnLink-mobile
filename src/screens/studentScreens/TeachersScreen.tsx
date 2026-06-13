import Input from "@/src/components/Input";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useBrowseStore } from "@/src/store/studentStores/browseStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function TeachersScreen(){
    const {isDark}=useTheme();
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const {teachers,isGettingTeachers,getTeachers,teachersPaginationData}=useBrowseStore();

    const scrollRef=useRef<ScrollView>(null);

    useEffect(()=>{
        if(teachers.length===0){
            getTeachers(1);
        }
    },[getTeachers]);

    const handleScrollToTop=()=>{
        scrollRef.current?.scrollTo({
            y:0,
            animated:true
        });
    }

    return(
        <ScrollView 
            ref={scrollRef}
            className="px-4 w-full" 
            contentContainerStyle={{flexGrow:1,paddingBottom:100}}
            showsVerticalScrollIndicator={false}
        >
            {/* top section with filters */}
            <View className="flex flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-text-strong">Find Teachers</Text>
                <Pressable
                    className="p-3 bg-bg-2 rounded-lg border border-border"
                >
                    <FontAwesome5 name="sliders-h" size={20} color={strongText}/>
                </Pressable>
            </View>

            {/* searchbar */}
            <View className="relative mt-4">
                <FontAwesome5 className="absolute top-4 left-4 z-10" name="search" size={18} color={strongText}/>
                <Input
                    placeholder="Search by subject, name..."
                    placeholderTextColor={strongText}
                    className="pl-12"
                />
            </View>

            {/* teachers list */}
            <View className="mt-6">
                {isGettingTeachers &&(
                    Array.from({length:4}).map((_,index)=>{
                        return(
                            <View key={index} className="w-full mb-4">
                                <TeacherCardSkeleton/>
                            </View>
                        );
                    })
                )}

                {!isGettingTeachers && teachers.length===0 && (
                    <View className="flex justify-center items-center">
                        <Text className="text-text-strong">No teachers found </Text>
                        <Text className="text-text-weak">try to adjust the filter settings or search again.</Text>
                    </View>
                )}

                {!isGettingTeachers && teachers.length>0 && (
                    <View className="flex flex-col gap-4">
                        {teachers.map((teacher)=>{
                            return (
                                <View 
                                    key={teacher.id}
                                    className="flex flex-col gap-4 p-4 bg-bg-2 w-full rounded-lg border border-border"
                                >
                                    {/* avatar */}
                                    <View className="w-full h-40 bg-bg-1 rounded-lg">
                                        {teacher.avatar ? (
                                            <Image
                                                source={{uri:teacher.avatar}}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <View className="w-full h-full flex items-center justify-center">
                                                <FontAwesome5 name="user" size={40} color={strongText}/>
                                            </View>
                                        )}
                                    </View>
                                    <View className="w-full">
                                        <Text className="text-text-strong text-2xl font-bold">{teacher.name}</Text>
                                        <View className="flex flex-row justify-between w-full ">
                                            <Text className="text-primary text-wrap line-clamp-1 w-3/4">
                                                {teacher.headline?teacher.headline:"No headline available."}
                                            </Text>
                                            <Text className="text-text-strong">
                                                ${teacher.hourly_rate}/hr
                                            </Text>
                                        </View>
                                        {/* subjects tags */}
                                        <View className="flex flex-row flex-wrap gap-1 mt-2 mb-3">
                                            {!teacher?.subjects &&(
                                                <Text className="text-text-weak font-semibold px-2 py-1 bg-blue-500/20 rounded-lg">No subjects available</Text>
                                            )}
                                            {teacher?.subjects?.map((subject,index)=>{
                                                return (
                                                    <Text key={index} className="text-text-weak font-semibold px-2 py-1 bg-blue-500/20 rounded-lg h-8">{subject}</Text>
                                                );
                                            })}
                                        </View>

                                        {/* bio */}
                                        <View className="border-b border-border pb-4">
                                            <Text className="text-text-weak text-md font-semibold line-clamp-4">
                                                {teacher.bio?teacher.bio:"No bio available."}
                                            </Text>
                                        </View>

                                        {/* buttons */}
                                        <View className="w-full mt-4 gap-2">
                                            <Pressable
                                                className="w-full border border-primary text-primary py-3 rounded-lg items-center active:bg-primary active:scale-95 transition-all duration-300 group"
                                            >
                                                <Text className="text-primary text-md font-bold group-active:text-text-strong transition-all duration-300">View Profile</Text>
                                            </Pressable>
                                            <Pressable
                                                className="w-full bg-primary  text-white py-3 rounded-lg items-center active:bg-transparent active:scale-95 transition-all duration-300 group"
                                            >
                                                <Text className="text-white text-md font-bold group-active:text-primary">Book Session</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}

                        {/* pagination */}
                        <View className="flex flex-row gap-2 items-center justify-center my-4">
                            {/* previous button */}
                            <Pressable
                                disabled={teachersPaginationData?.current_page===1}
                                className="bg-bg-2 text-text-strong border border-border px-3 py-2 rounded-full active:scale-95"
                                onPress={() => {
                                    getTeachers(teachersPaginationData!.current_page - 1);
                                    handleScrollToTop();
                                }}
                            >
                                <Text className="text-md text-text-strong font-bold flex flex-row items-center gap-2">
                                    <FontAwesome5 name="chevron-left" size={13} color={strongText}/>
                                </Text>
                            </Pressable>

                            {/* page numbers */}
                            {Array.from({length:teachersPaginationData?.last_page!}).map((_,index)=>(
                                <Pressable
                                    key={index}
                                    className={`bg-bg-2 text-text-strong border border-border px-3 py-2 rounded-full active:scale-95 ${teachersPaginationData?.current_page===index+1 ?"bg-primary text-white":""}`}
                                    disabled={teachersPaginationData?.current_page===index+1}
                                    onPress={()=>{
                                        getTeachers(index+1);
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
                                disabled={teachersPaginationData?.current_page===teachersPaginationData?.last_page}
                                className="bg-bg-2 text-text-strong border border-border px-3 py-2 rounded-full active:scale-95"
                                onPress={() => {
                                    getTeachers(teachersPaginationData!.current_page + 1);
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

const TeacherCardSkeleton=()=>{
    return(
        <View className="flex flex-col gap-4 p-4 bg-bg-2 w-full rounded-lg border border-border">
            {/* Avatar */}
            <View className="w-full h-40 bg-bg-1 rounded-lg animate-pulse" />

            <View className="w-full">
                {/* Name */}
                <View className="h-8 w-2/3 bg-bg-1 rounded-md animate-pulse mb-3" />

                {/* Headline + Rate */}
                <View className="flex-row justify-between items-center mb-3">
                    <View className="h-4 w-1/2 bg-bg-1 rounded-md animate-pulse" />
                    <View className="h-4 w-16 bg-bg-1 rounded-md animate-pulse" />
                </View>

                {/* Subjects */}
                <View className="flex-row flex-wrap gap-2 mb-3">
                    <View className="h-8 w-20 bg-bg-1 rounded-lg animate-pulse" />
                    <View className="h-8 w-24 bg-bg-1 rounded-lg animate-pulse" />
                    <View className="h-8 w-16 bg-bg-1 rounded-lg animate-pulse" />
                </View>

                {/* Bio */}
                <View className="gap-2 mb-4">
                    <View className="h-4 w-full bg-bg-1 rounded-md animate-pulse" />
                    <View className="h-4 w-full bg-bg-1 rounded-md animate-pulse" />
                    <View className="h-4 w-3/4 bg-bg-1 rounded-md animate-pulse" />
                </View>

                {/* Buttons */}
                <View className="gap-2">
                    <View className="h-12 w-full bg-bg-1 rounded-lg animate-pulse" />
                    <View className="h-12 w-full bg-bg-1 rounded-lg animate-pulse" />
                </View>
            </View>
        </View>
    );
}