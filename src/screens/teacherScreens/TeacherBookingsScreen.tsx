import BookingCard from "@/src/components/teacherComponents/BookingCard";
import { useTheme } from "@/src/providers/ThemeProvider";
import useBookingStore from "@/src/store/booking";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Skeleton from "@/src/components/Skeleton";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeacherBookingsScreen(){
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    
    const {
        teacherBookings,
        teacherBookingsPagination,
        isGettingTeacherBookings,
        getTeacherBookings,
        getTeacherBookingsWithNoLoading,
        max_live_sessions,
        current_live_sessions,
    }=useBookingStore();
    const [filterTab,setFilterTab]=useState<string>('all');
    const [isLoadingMore,setIsLoadingMore]=useState<boolean>(false);

    const filterTabs=[
        {id:0,label:'all',},
        {id:1,label:'pending',},
        {id:2,label:'approved',},
        {id:3,label:'rejected',}
    ];
    const scrollRef=useRef<FlatList>(null);

    const filteredBookings=teacherBookings.filter((booking)=> filterTab ==="all" || booking.status ===filterTab);

    useEffect(()=>{
        getTeacherBookings();
    },[]);



    const handleScrollToTop=()=>{
        scrollRef.current?.scrollToOffset({
            offset:0,
            animated:true
        });
    };

    const handleLoadMore=async ()=>{
        if(isGettingTeacherBookings) return;
        if(teacherBookingsPagination?.current_page === teacherBookingsPagination?.last_page) return;
        const nextPage=teacherBookingsPagination?.current_page! +1;

        if(nextPage <= teacherBookingsPagination?.last_page!){
            setIsLoadingMore(true);
            await getTeacherBookingsWithNoLoading(nextPage)
            handleScrollToTop();
            setIsLoadingMore(false);
        }
    }

    if(isGettingTeacherBookings){
        return <TeacherBookingsSkeleton/>
    }
    

    return (
        <SafeAreaView
            className="flex-1 bg-bg-1 px-4"
            edges={['top', 'left', 'right','bottom']}
        >
            {teacherBookings.length === 0 &&(
                <TeacherBookingsEmptyState/>
            )}

            {teacherBookings.length > 0 &&(
                <View className="flex flex-col items-center gap-4 mb-4">
                    {/* Live Session Tracker */}
                    <View className="flex flex-col gap-4 w-full items-center border-b border-border pb-5">
                        <View className="flex-row items-center gap-2">
                            <FontAwesome5 name="calendar" size={20} color={primaryColor} />
                            <Text className="text-text-strong font-medium">Live Sessions Tracker: {current_live_sessions} / {max_live_sessions} per month</Text>
                        </View>
                        <View className="w-full bg-blue-500/20 rounded-full h-4 overflow-hidden">
                            <View className="bg-primary h-4 rounded-full" style={{width: `${(current_live_sessions/max_live_sessions)*100}%`}}/>
                        </View>
                    </View>

                    {/* filters */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="w-full mt-2"
                        contentContainerStyle={{gap:12}}
                    >
                        {filterTabs.map((tab)=>{
                            const isActive=filterTab===tab.label;
                            return(
                                <TouchableOpacity
                                    key={tab.id}
                                    onPress={()=>setFilterTab(tab.label)}
                                    className={`rounded-full px-6 py-3 border-2 mb-5 h-14 ${
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
                    </ScrollView>

                    <FlatList
                        ref={scrollRef}
                        className="w-full"
                        style={{marginBottom:410}}
                        contentContainerStyle={{gap:12}}
                        data={filteredBookings}
                        renderItem={({item})=><BookingCard booking={item}/>}
                        keyExtractor={(item)=>String(item.id)}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<EmptyList/>}
                        refreshing={isGettingTeacherBookings}
                        onRefresh={()=>{
                            getTeacherBookings(1);
                            handleScrollToTop();
                        }}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            ()=>{
                                if(isLoadingMore){
                                    return(
                                        <View className="flex justify-center items-center py-4">
                                            <ActivityIndicator size="large" color={primaryColor} />
                                        </View>
                                    )
                                }
                            }
                        }
                    />
                </View>
            )}
        </SafeAreaView>
    );
}


const EmptyList=()=>{
    return (
        <View className="flex justify-center items-center w-full border-2 border-dashed border-border rounded-xl p-6 h-40 mt-5">
            <Text className="text-text-strong font-medium text-lg">No bookings found for this filter</Text>
        </View>
    );
}

const TeacherBookingsEmptyState=()=>{
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";

    const emptyCards=[
        {id:0,label:'Total Bookings',value:0},
        {id:1,label:'Total Earnings',value:"$ 0"},
        {id:2,label:'Upcomming',value:0}
    ];

    return(
        <View className="justify-center items-center ">
            <View className="flex-col gap-2 items-center justify-center w-full mt-8">
                <View className="w-32 h-32 bg-bg-2 rounded-full flex justify-center items-center border border-border">
                    <FontAwesome5 name="calendar" size={46} color={primaryColor} />
                </View>
                <Text className="font-bold text-text-strong text-2xl text-center">No Bookings Yet</Text>
                <Text className="font-semibold text-text-weak text-md text-center">You're all caught up. Check back later when students start booking lessons with you.</Text>
                <View className="flex-col gap-2 items-center w-full mt-4">
                    {emptyCards.map((card)=>{
                        return(
                            <View 
                                key={card.id}
                                className="flex-col gap-2 p-5 bg-bg-2 rounded-xl border border-border w-full"
                            >
                                <Text className="text-text-weak text-xl font-semibold">{card.label}</Text>
                                <Text className="text-text-strong text-3xl font-bold">{card.value}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const TeacherBookingsSkeleton=()=>{
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
            {/* Live Session Tracker Skeleton */}
            <View className="flex flex-col gap-4 w-full items-center border-b border-border pb-5 mt-2">
                <View className="flex-row items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" animatedStyle={animatedStyle} />
                    <Skeleton className="h-5 w-64 rounded-md" animatedStyle={animatedStyle} />
                </View>
                <Skeleton className="w-full h-4 rounded-full" animatedStyle={animatedStyle} />
            </View>

            {/* Filter Tabs Skeleton */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="w-full mt-2"
                contentContainerStyle={{ gap: 12 }}
            >
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                        key={i}
                        className="rounded-full px-6 py-3 border-2 border-border mb-5 h-14 w-28"
                        animatedStyle={animatedStyle}
                    />
                ))}
            </ScrollView>

            {/* Booking Cards List Skeleton */}
            <View className="w-full gap-3">
                {[1, 2, 3].map((i) => (
                    <View
                        key={i}
                        className="flex flex-col bg-bg-2 border border-border rounded-2xl w-full p-4 border-l-4 border-l-border"
                        style={{ opacity: 0.8 }}
                    >
                        {/* Header info row skeleton */}
                        <View className="flex-row items-center justify-between w-full">
                            <View className="flex-row items-center gap-3 flex-1">
                                {/* avatar */}
                                <Skeleton className="w-12 h-12 rounded-full" animatedStyle={animatedStyle} />

                                {/* Name & Subject */}
                                <View className="flex-1 justify-center gap-2">
                                    <Skeleton className="h-4 w-32 rounded-md" animatedStyle={animatedStyle} />
                                    <Skeleton className="h-4 w-20 rounded-full" animatedStyle={animatedStyle} />
                                </View>
                            </View>

                            {/* Price and Status Badge */}
                            <View className="items-end ml-2 gap-2">
                                <Skeleton className="h-5 w-12 rounded-md" animatedStyle={animatedStyle} />
                                <Skeleton className="h-6 w-20 rounded-full" animatedStyle={animatedStyle} />
                            </View>
                        </View>

                        {/* Separator line */}
                        <View className="h-[1px] bg-border my-3" />

                        {/* Date and Time Info */}
                        <View className="flex-row items-center gap-2">
                            <Skeleton className="h-8 w-36 rounded-xl" animatedStyle={animatedStyle} />
                            <Skeleton className="h-8 w-24 rounded-xl" animatedStyle={animatedStyle} />
                        </View>

                        {/* Note Skeleton */}
                        <View className="mt-3">
                            <Skeleton className="h-12 w-full rounded-xl" animatedStyle={animatedStyle} />
                        </View>

                        {/* Message Button Skeleton */}
                        <Skeleton className="h-12 w-full rounded-2xl mt-4" animatedStyle={animatedStyle} />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}