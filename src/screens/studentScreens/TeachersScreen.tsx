import { Teacher } from "@/src/@types/teahcer";
import Input from "@/src/components/Input";
import BookingCard from "@/src/components/student/BookingCard";
import TeachersCard from "@/src/components/student/TeachersCard";
import { TeachersFilterSheet } from "@/src/components/student/TeachersFilterSheet";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useBrowseStore } from "@/src/store/studentStores/browseStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";

export default function TeachersScreen(){
    const {isDark}=useTheme();
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const {teachers,isGettingTeachers,getTeachers,teachersPaginationData,getLanguages,getSubjects,isGettingFilters,setIsGettingFilters,teacherFilter,setTeacherFilter,clearTeacherFilter}=useBrowseStore();

    const scrollRef=useRef<FlatList>(null);

    const [showFilterSheet,setShowFilterSheet]=useState<boolean>(false);

    useEffect(()=>{
        if(teachers.length===0){
            getTeachers(1);
        }
    },[getTeachers]);

    useEffect(()=>{
        getFilters();
    },[]);

    const getFilters=async()=>{
        setIsGettingFilters(true);
        await getLanguages();
        await getSubjects();
        setIsGettingFilters(false);
    }

    const handleScrollToTop=()=>{
        scrollRef.current?.scrollToOffset({
            offset:0,
            animated:true
        });
    }

    const loadMoreTeachers=async()=>{
        if(isGettingTeachers) return;
        if(teachersPaginationData?.current_page === teachersPaginationData?.last_page) return;
        
        const nextPage = teachersPaginationData?.current_page! + 1;
        if(nextPage <= teachersPaginationData?.last_page!){
            await getTeachers(nextPage);
        }
    }

    const isLoadingTeachersWithFilters=isGettingTeachers || isGettingFilters;

    return(
        <View style={{ flex: 1 }}>
            <View 
                className="px-4 w-full" 
            >
                {/* top section with filters */}
                <View className="flex flex-row justify-between items-center">
                    <Text className="text-2xl font-bold text-text-strong">Find Teachers</Text>
                    <Pressable
                        onPress={() => setShowFilterSheet(true)}
                        className="p-3 bg-bg-2 rounded-lg border border-border"
                    >
                        <FontAwesome5 name="sliders-h" size={20} color={strongText}/>
                    </Pressable>
                </View>

                {/* searchbar */}
                <View className="relative mt-4 mb-4">
                    <FontAwesome5 className="absolute top-4 left-4 z-10" name="search" size={18} color={strongText}/>
                    <Input
                        placeholder="Search by subject, name..."
                        placeholderTextColor={strongText}
                        className="pl-12 rounded-lg"
                        value={teacherFilter.search_query}
                        onChangeText={(text) => setTeacherFilter({ ...teacherFilter, search_query: text })}
                        onSubmitEditing={() => getTeachers(1)}
                        returnKeyType="search"
                    />
                </View>

                {/* teachers list */}
                {isLoadingTeachersWithFilters || isGettingTeachers?(
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{marginBottom:200}}
                        data={[...Array(6)]}
                        keyExtractor={(item,idx)=>String(idx)}
                        renderItem={()=>(
                            <View className="w-full mb-2">
                                <TeacherCardSkeleton />
                            </View>
                        )}
                    />
                ):(
                    <FlatList
                        ref={scrollRef}
                        data={teachers}
                        renderItem={({item})=>(
                            <View className="w-full mb-2">
                                <TeachersCard teacher={item}/>
                            </View>
                        )}
                        keyExtractor={(item)=>String(item.id)}
                        refreshing={isGettingTeachers}
                        onRefresh={()=>{
                            getTeachers(1);
                            handleScrollToTop();
                        }}
                        onEndReached={loadMoreTeachers}
                        onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
                        style={{marginBottom:200}}
                        ListEmptyComponent={
                            <View className="flex justify-center items-center mt-6">
                                <Text className="text-text-strong">No teachers found </Text>
                                <Text className="text-text-weak">Try adjusting the filter settings or search again.</Text>
                                <Pressable
                                    onPress={()=>{
                                        clearTeacherFilter();
                                        getTeachers(1);
                                    }}
                                    className="px-4 py-2 bg-bg-2 rounded-lg border border-border mt-4"
                                >
                                    <Text className="text-text-strong">Clear Filters</Text>
                                </Pressable>
                            </View>
                        }
                    />
                )}
            </View>
            <TeachersFilterSheet
                visible={showFilterSheet}
                onClose={() => setShowFilterSheet(false)}
            />
        </View>
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