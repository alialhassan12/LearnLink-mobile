import Skeleton from "@/src/components/Skeleton";
import { useTheme } from "@/src/providers/ThemeProvider";
import useBookingStore from "@/src/store/booking";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, Pressable, ScrollView, Text, View } from "react-native";

export default function MyBookingsScreen(){
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const {studentBookings,getStudentBookings,isGettingStudentBookings,studentBookingsPagination}=useBookingStore();
    const [filterTabs, setFilterTabs] = useState<string>("all");

    const scrollRef=useRef<ScrollView>(null);
    const handleScrollToTop=()=>{
        scrollRef.current?.scrollTo({
            y:0,
            animated:true
        });
    }

    useEffect(()=>{
        // if(studentBookings.length === 0){
            getStudentBookings();
        // }
    },[getStudentBookings]);

    const filteredBookings = studentBookings.filter((booking) =>
        filterTabs === "all" || booking.status === filterTabs
    );
    const filters=["all","pending","approved","rejected"];

    const stats = [
        {
            title: "Total Spent\n(per page)",
            value: `$${studentBookings.reduce((total,booking)=>booking.status==="approved"?total+Number(booking.price):total,0)}`,
            icon: "wallet",
            color: "#2563eb",
            bg: "bg-blue-100"
        },
        {
            title: "Approved ",
            value: studentBookings.filter(b => b.status === "approved").length,
            icon: "calendar-check",
            color: "#059669",
            bg: "bg-emerald-100"
        },
        {
            title: "Pending Requests",
            value: studentBookings.filter(b => b.status === "pending").length,
            icon: "clock",
            color: "#d97706",
            bg: "bg-amber-100"
        }
    ];
    const getBookingBorderColor=(status:string)=>{
        switch(status){
            case "pending":
                return "border-l-yellow-500";
            case "approved":
                return "border-l-emerald-500";
            case "rejected":
                return "border-l-red-500";
            default:
                return "border-l-gray-500";
        }
    }
    const getStatusColor=(status:string)=>{
        switch(status){
            case "pending":
                return "yellow-500";
            case "approved":
                return "emerald-500";
            case "rejected":
                return "red-500";
            default:
                return "gray-500";
        }
    }

    if(isGettingStudentBookings){
        return <BookingSkeleton/>;
    }

    return(
        <ScrollView
            ref={scrollRef}
            className="px-4 w-full" 
            contentContainerStyle={{paddingBottom:100,gap:16}}
            showsVerticalScrollIndicator={false}
        >
            {/* summary stats */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 16}}
            >
                {stats?.map((stat)=>{
                    return(
                        <View
                            key={stat.title}
                            className="flex flex-col justify-center gap-2 p-4 bg-bg-2 border border-border rounded-3xl min-w-[150px] max-h-[150px] active:opacity-90 transition-all duration-300 group"
                        >
                            <View className={`${stat.bg} p-2 w-11 h-11 items-center justify-center rounded-2xl group-active:scale-110 transition-all duration-300`}>
                                <FontAwesome5 name={stat.icon} size={24} color={stat.color} />
                            </View>
                            <Text className="text-text-weak uppercase font-semi-bold">{stat.title}</Text>
                            <Text className="text-text-strong font-bold text-2xl">{stat.value}</Text>
                        </View>
                    );
                })}
            </ScrollView>

            {/* filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 16}}
            >
                {filters.map((filter,index)=>{
                    return (
                        <Pressable
                            key={index}
                            className={`px-5 py-2 min-w-[100px] items-center justify-center rounded-full border-1 bg-bg-2 border-border ${
                                filter === filterTabs ? "bg-primary " : ""
                            }`}
                            onPress={()=>setFilterTabs(filter)}
                        >
                            <Text className={`${filter===filterTabs?"text-white":'text-text-strong'} font-bold`}>
                                {
                                filter.charAt(0).toUpperCase()+filter.slice(1)
                            }
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* list of bookings */}
            {
                filteredBookings.length===0?(
                    <View className="flex-1 items-center justify-center border-2 border-dashed border-border rounded-2xl py-20 mt-4">
                        <View className="flex-col items-center gap-4">
                            <View className="w-16 h-16 items-center justify-center bg-gray-100 rounded-full border-dashed">
                                <FontAwesome5 name="book" size={30} />
                            </View>
                            <Text className="text-text-strong text-lg font-bold">No Bookings Yet</Text>
                            <Text className="text-text-weak text-center w-64">Book your first class to get started</Text>
                            <Pressable className="mt-4 bg-primary px-6 py-3 rounded-full active:opacity-90 transition-opacity">
                                <Text className="text-white font-bold">Find a Teacher</Text>
                            </Pressable>
                        </View>
                    </View>
                ):(
                    <View className="flex-1 gap-2 mt-4">
                        {filteredBookings.map((booking,index)=>{
                            return(
                                <View 
                                    key={index} 
                                    className={`flex flex-col p-4 rounded-2xl border-l-4 ${getBookingBorderColor(booking.status as string)} bg-bg-2`}
                                >
                                    <View className="flex flex-row justify-between">
                                        {/* teacher info */}
                                        <View className="flex flex-row gap-2">
                                            {booking?.teacher?.user?.avatar?(
                                                <Image
                                                    source={{ uri: booking?.teacher?.user?.avatar }}
                                                    className="w-14 h-14 rounded-full"
                                                    resizeMode="cover"
                                                />
                                            ):(
                                                <View className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                                                    <Text className="text-white font-bold text-lg">{booking?.teacher?.user?.name?.[0]}</Text>
                                                </View>
                                            )}
                                            <View className="flex flex-col justify-center">
                                                <Text className="text-text-strong font-semibold">{booking?.teacher?.user?.name}</Text>
                                                <Text className="text-sm px-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-primary">
                                                    {booking?.subject}
                                                </Text>
                                            </View>
                                        </View>
                                        {/* price and status */}
                                        <View className="flex flex-col items-center">
                                            <Text className="text-text-strong font-bold">$ {booking?.price}</Text>
                                            <Text className={`text-${getStatusColor(booking?.status as string)}  bg-${getStatusColor(booking.status as string)}/20 text-sm px-2 rounded-lg font-semibold`}>
                                                {booking?.status?.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* booking info */}
                                    <View className="flex flex-row gap-4 mt-4 items-center justify-center">
                                        <View className="flex flex-row items-center justify-center gap-2">
                                            <FontAwesome5 name="calendar" size={16} color="gray" />
                                            <Text className="text-text-weak font-semibold">
                                                {booking?.scheduled_day}, {booking?.scheduled_date}
                                            </Text>
                                        </View>
                                        <View className="flex flex-row items-center justify-center gap-2">
                                            <FontAwesome5 name="clock" size={16} color="gray" />
                                            <Text className="text-text-weak font-semibold">
                                                {booking?.scheduled_time}
                                            </Text>
                                        </View>
                                    </View>
                                    <Pressable className="flex flex-row justify-center items-center rounded-2xl mt-4 bg-bg-1  py-3 w-full border border-primary active:bg-primary active:border-none active:scale-95 transition-all duration-300 group">
                                        <Ionicons name="chatbubble" size={16} color={primaryColor} />
                                        <Text className="text-primary text-lg font-light ml-2 group-active:text-white group-active:font-bold">Message Teacher</Text>
                                    </Pressable>
                                </View>
                            );
                        })}
                        {/* pagination */}
                        <View className="flex flex-row gap-2 items-center justify-center my-4">
                            {/* previous button */}
                            <Pressable
                                disabled={studentBookingsPagination?.current_page===1}
                                className="bg-bg-2 text-text-strong border border-border px-3 py-2 rounded-full active:scale-95"
                                onPress={() => {
                                    getStudentBookings(studentBookingsPagination!.current_page - 1);
                                    handleScrollToTop();
                                }}
                            >
                                <Text className="text-md text-text-strong font-bold flex flex-row items-center gap-2">
                                    <FontAwesome5 name="chevron-left" size={13} color={strongText}/>
                                </Text>
                            </Pressable>

                            {/* page numbers */}
                            {Array.from({length:studentBookingsPagination?.last_page!}).map((_,index)=>(
                                <Pressable
                                    key={index}
                                    className={`bg-bg-2 text-text-strong border border-border px-3 py-2 rounded-full active:scale-95 ${studentBookingsPagination?.current_page===index+1 ?"bg-primary text-white":""}`}
                                    disabled={studentBookingsPagination?.current_page===index+1}
                                    onPress={()=>{
                                        getStudentBookings(index+1);
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
                                disabled={studentBookingsPagination?.current_page===studentBookingsPagination?.last_page}
                                className="bg-bg-2 text-text-strong border border-border px-3 py-2 rounded-full active:scale-95"
                                onPress={() => {
                                    getStudentBookings(studentBookingsPagination!.current_page + 1);
                                    handleScrollToTop();
                                }}
                            >
                                <Text className="text-md text-text-strong font-bold flex flex-row items-center gap-2">
                                    <FontAwesome5 name="chevron-right" size={13} color={strongText}/>
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )
            }
        </ScrollView>
    );
}

const BookingSkeleton=()=>{
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
        {/* stat chips */}
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
        >
            {[1, 2, 3].map((i) => (
            <View
                key={i}
                className="p-4 bg-bg-2 border border-border rounded-3xl min-w-[150px] max-h-[150px] justify-between"
            >
                <Skeleton
                    className="w-11 h-11 rounded-2xl"
                    animatedStyle={animatedStyle}
                />
                <View className="gap-2 mt-2">
                <Skeleton
                    className="h-3 w-16 rounded-md"
                    animatedStyle={animatedStyle}
                />
                <Skeleton
                    className="h-6 w-12 rounded-md"
                    animatedStyle={animatedStyle}
                />
                </View>
            </View>
            ))}
        </ScrollView>

        {/* filter tabs */}
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
        >
            {[1, 2, 3].map((i) => (
            <Skeleton
                key={i}
                className="h-9 w-24 rounded-full"
                animatedStyle={animatedStyle}
            />
            ))}
        </ScrollView>

        {/* booking cards */}
        <View className="gap-2 mt-4">
            {[1,2,3].map((i) => (
                <View
                    key={i}
                    className="p-4 rounded-2xl border-l-4 border-border bg-bg-2"
                    style={{ opacity: 0.4 }}
                >
                    {/* teacher row */}
                    <View className="flex-row justify-between">
                        <View className="flex-row gap-2">
                            <Skeleton
                            className="w-14 h-14 rounded-full"
                            animatedStyle={animatedStyle}
                            />
                            <View className="justify-center gap-2">
                            <Skeleton
                                className="h-3 w-28 rounded-md"
                                animatedStyle={animatedStyle}
                            />
                            <Skeleton
                                className="h-5 w-20 rounded-lg"
                                animatedStyle={animatedStyle}
                            />
                            </View>
                        </View>
                        <View className="items-end gap-2">
                            <Skeleton
                            className="h-3 w-12 rounded-md"
                            animatedStyle={animatedStyle}
                            />
                            <Skeleton
                            className="h-5 w-20 rounded-lg"
                            animatedStyle={animatedStyle}
                            />
                        </View>
                    </View>

                    {/* date/time row */}
                    <View className="flex-row gap-4 mt-4 justify-center">
                        <Skeleton
                            className="h-3 w-36 rounded-md"
                            animatedStyle={animatedStyle}
                        />
                        <Skeleton
                            className="h-3 w-20 rounded-md"
                            animatedStyle={animatedStyle}
                        />
                    </View>

                    {/* message button */}
                    <Skeleton
                        className="h-12 w-full rounded-2xl mt-4"
                        animatedStyle={animatedStyle}
                    />
                </View>
            ))}

            {/* pagination */}
            <View className="flex-row gap-2 justify-center my-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton
                key={i}
                className="w-9 h-9 rounded-full"
                animatedStyle={animatedStyle}
                />
            ))}
            </View>
        </View>
        </ScrollView>
    );
}