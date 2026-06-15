import Skeleton from "@/src/components/Skeleton";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useLiveSessionStore } from "@/src/store/liveSessionsStore";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, ScrollView, Text, View } from "react-native";

export default function LiveSessionsScreen(){
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#818cf8" : "#4338F2";
    const {studentLiveSessions,isGettingStudentLiveSessions,getStudentLiveSessions}=useLiveSessionStore();
    const [filterTabs,setFilterTabs]=useState<string>("booked");

    const scrollRef=useRef<ScrollView>(null);
    
    useEffect(()=>{
        getStudentLiveSessions();
    },[getStudentLiveSessions]);

    const nextSession=studentLiveSessions?.filter((s)=>s.status==="booked").sort((a,b)=>new Date(a.scheduled_date).getTime()-new Date(b.scheduled_date).getTime())[0];
    const filteredSessions=studentLiveSessions?.filter((s)=>s.status===filterTabs);

    const cards=[
        {
            title:"Scheduled",
            value:studentLiveSessions?.filter((s)=>s.status==="booked").length,
            icon:"calendar",
        },
        {
            title:"Completed",
            value:studentLiveSessions?.filter((s)=>s.status==="completed").length,
            icon:"calendar-check",
        }
    ];

    const filters=["booked","completed","cancelled"];
    const filterLabels:Record<string,string>={
        booked:"Scheduled",
        completed:"Completed",
        cancelled:"Cancelled",
    };

    const getStatusColor=(status:string)=>{
        switch(status){
            case "booked":
                return "blue-500";
            case "completed":
                return "emerald-500";
            case "cancelled":
                return "red-500";
            default:
                return "gray-500";
        }
    };

    const getSessionBorderColor=(status:string)=>{
        switch(status){
            case "booked":
                return "border-l-blue-500";
            case "completed":
                return "border-l-emerald-500";
            case "cancelled":
                return "border-l-red-500";
            default:
                return "border-l-gray-500";
        }
    };

    if(isGettingStudentLiveSessions){
        return <LiveSessionsSkeleton/>
    }

    return(
        <ScrollView
            ref={scrollRef}
            className="px-4 w-full" 
            contentContainerStyle={{paddingBottom:100,gap:16}}
            showsVerticalScrollIndicator={false}
        >
            <View className="flex flex-col justify-center gap-2 mt-4">
                <Text className="text-3xl font-bold text-text-strong">My Sessions</Text>
                <Text className="text-text-weak text-lg font-light">Manage your upcoming and past learning experiences.</Text>
            </View>

            {nextSession &&(
                <View className="rounded-[32px] overflow-hidden bg-[#1E1B7A]">
                    {/* Gradient Overlay */}
                    <View className="p-6">
                        {/* Badge */}
                        <View className="self-start flex-row items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10">
                            <FontAwesome5
                                name="stopwatch"
                                size={12}
                                color="rgba(255,255,255,0.8)"
                            />
                            <Text className="text-white/80 font-bold tracking-wide text-sm">
                                HAPPENING SOON
                            </Text>
                        </View>

                        {/* Title */}
                        <View className="mt-6">
                            <Text className="text-white text-[48px] leading-[52px] font-extrabold">
                                Next Session
                            </Text>

                            <Text className="text-white text-[48px] leading-[52px] font-extrabold">
                                {nextSession.subject} with{" "}
                                <Text className="text-cyan-300">
                                    {nextSession?.teacher?.user?.name}
                                </Text>
                            </Text>
                        </View>

                        {/* Session Info */}
                        <View className="flex-row gap-2 mt-8">
                            <View className="flex-row items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 border border-white/10">
                                <Ionicons
                                    name="calendar-outline"
                                    size={20}
                                    color="white"
                                />
                                <Text className="text-white font-semibold text-lg">
                                    {nextSession?.scheduled_day}, {nextSession?.scheduled_date}
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 border border-white/10">
                                <Ionicons
                                    name="time-outline"
                                    size={20}
                                    color="white"
                                />
                                <Text className="text-white font-semibold text-lg">
                                    {nextSession.scheduled_time}
                                </Text>
                            </View>
                        </View>

                        {/* Description */}
                        <Text className="mt-8 text-white/80 text-xl leading-8">
                            Get your materials ready and ensure your camera is
                            working. Your mentor is looking forward to seeing you!
                        </Text>

                        {/* CTA */}
                        <Pressable
                            onPress={()=>router.push(`/SessionDetails?sessionId=${nextSession?.id}`)}
                            className="mt-10 h-16 bg-[#4338F2] rounded-2xl flex-row items-center justify-center gap-3 active:opacity-90 active:scale-95 transition-all duration-200 ease-in-out"
                        >
                            <Text className="text-white text-xl font-bold">
                                Join Preparation Room
                            </Text>

                            <Ionicons
                                name="videocam"
                                size={22}
                                color="white"
                            />
                        </Pressable>
                    </View>
                </View>
            )}
            {!nextSession &&(
                <View className="flex flex-col items-center justify-center w-full h-[200px] bg-bg-2 rounded-lg border-2 border-dashed border-border">
                    <Text className="text-text-strong text-xl font-semibold">No upcoming sessions scheduled yet.</Text>
                </View>
            )}

            <View className="flex flex-row gap-2 w-full">
                {cards.map((card,index)=>{
                    return(
                        <View key={index} className="flex flex-row gap-4 items-center bg-bg-2 px-4 py-4 rounded-2xl w-1/2">
                            <FontAwesome5 name={card.icon} size={20} color={primaryColor}/>
                            <View className="flex flex-col">
                                <Text className="text-text-weak text-lg font-semeibold ">{card.title.toUpperCase()}</Text>
                                <Text className="text-text-strong text-2xl font-bold">{card.value}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Filter Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap:12}}
            >
                {filters.map((filter,index)=>{
                    return(
                        <Pressable
                            key={index}
                            className={`px-5 py-2 min-w-[100px] items-center justify-center rounded-full border bg-bg-2 border-border ${
                                filter===filterTabs ? "bg-primary" : ""
                            }`}
                            onPress={()=>setFilterTabs(filter)}
                        >
                            <Text className={`${filter===filterTabs?"text-white":"text-text-strong"} font-bold`}>
                                {filterLabels[filter]}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Sessions List */}
            {filteredSessions?.length===0?(
                <View className="flex-1 items-center justify-center border-2 border-dashed border-border rounded-2xl py-20 mt-2">
                    <View className="flex-col items-center gap-4">
                        <View className="w-16 h-16 items-center justify-center bg-gray-100 rounded-full">
                            <Ionicons name="videocam-off-outline" size={30} color="#9ca3af"/>
                        </View>
                        <Text className="text-text-strong text-lg font-bold">No {filterLabels[filterTabs]} Sessions</Text>
                        <Text className="text-text-weak text-center w-64">
                            {filterTabs==="booked"
                                ?"Book a session with a teacher to get started."
                                :`You don't have any ${filterLabels[filterTabs].toLowerCase()} sessions yet.`
                            }
                        </Text>
                    </View>
                </View>
            ):(
                <View className="flex-1 gap-3 mt-2">
                    {filteredSessions?.map((session,index)=>{
                        return(
                            <View 
                                key={index} 
                                className={`flex flex-col p-4 rounded-2xl border-l-4 ${getSessionBorderColor(session.status)} bg-bg-2`}
                            >
                                {/* Teacher Info Row */}
                                <View className="flex flex-row justify-between items-start">
                                    <View className="flex flex-row gap-3 items-center">
                                        {session?.teacher?.user?.avatar?(
                                            <Image
                                                source={{ uri: session?.teacher?.user?.avatar }}
                                                className="w-14 h-14 rounded-full"
                                                resizeMode="cover"
                                            />
                                        ):(
                                            <View className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                                                <Text className="text-white font-bold text-lg">{session?.teacher?.user?.name?.[0]}</Text>
                                            </View>
                                        )}
                                        <View className="flex flex-col justify-center gap-1">
                                            <Text className="text-text-strong font-semibold text-base">{session?.teacher?.user?.name}</Text>
                                            <View className="flex flex-row items-center gap-2">
                                                <Text className="text-sm text-text-weak">
                                                    Subject: <Text className="font-semibold text-primary">{session?.subject}</Text>
                                                </Text>
                                                <View className={`px-2 py-0.5 rounded-md bg-${getStatusColor(session.status)}/20 border border-${getStatusColor(session.status)}/30`}>
                                                    <Text className={`text-${getStatusColor(session.status)} text-[10px] font-bold tracking-wider`}>
                                                        {session?.status?.toUpperCase()}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Date & Time */}
                                <View className="flex flex-row gap-4 mt-4 items-center">
                                    <View className="flex flex-row items-center gap-2">
                                        <FontAwesome5 name="calendar" size={14} color="#9ca3af"/>
                                        <Text className="text-text-weak font-semibold text-sm">
                                            {session?.scheduled_day}, {session?.scheduled_date}
                                        </Text>
                                    </View>
                                    <View className="flex flex-row items-center gap-2">
                                        <FontAwesome5 name="clock" size={14} color="#9ca3af"/>
                                        <Text className="text-text-weak font-semibold text-sm">
                                            {session?.scheduled_time}
                                        </Text>
                                    </View>
                                </View>

                                {/* Action Button */}
                                {session.status==="booked" &&(
                                    <Pressable
                                        onPress={()=>router.push(`/SessionDetails?sessionId=${session?.id}`)}
                                        className="flex flex-row justify-center items-center rounded-2xl mt-4 bg-bg-1 py-3 w-full border border-primary active:bg-primary active:scale-95 transition-all duration-300 group"
                                    >
                                        <Ionicons name="videocam" size={18} color={primaryColor}/>
                                        <Text className="text-primary text-base font-semibold ml-2 group-active:text-white">Join Session</Text>
                                    </Pressable>
                                )}
                                {session.status==="completed" &&(
                                    <Pressable 
                                        onPress={()=>router.push(`/SessionDetails?sessionId=${session?.id}`)}
                                        className="flex flex-row justify-center items-center rounded-2xl mt-4 bg-bg-1 py-3 w-full border border-emerald-500 active:bg-emerald-500 active:scale-95 transition-all duration-300 group"
                                    >
                                        <Ionicons name="play-circle" size={18} color="#10b981"/>
                                        <Text className="text-emerald-500 text-base font-semibold ml-2 group-active:text-white">View Details</Text>
                                    </Pressable>
                                )}
                            </View>
                        );
                    })}
                </View>
            )}
        </ScrollView>
    );
}

const LiveSessionsSkeleton=()=>{
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
                <Skeleton className="h-8 w-48 rounded-lg" animatedStyle={animatedStyle}/>
                <Skeleton className="h-5 w-72 rounded-md" animatedStyle={animatedStyle}/>
            </View>

            {/* Next session hero skeleton */}
            <Skeleton className="h-80 w-full rounded-[32px]" animatedStyle={animatedStyle}/>

            {/* Stat cards skeleton */}
            <View className="flex flex-row gap-2 w-full">
                {[1, 2].map((i) => (
                    <View key={i} className="flex flex-row gap-4 items-center bg-bg-2 px-4 py-4 rounded-2xl w-1/2">
                        <Skeleton className="w-10 h-10 rounded-xl" animatedStyle={animatedStyle}/>
                        <View className="flex flex-col gap-2">
                            <Skeleton className="h-3 w-16 rounded-md" animatedStyle={animatedStyle}/>
                            <Skeleton className="h-6 w-10 rounded-md" animatedStyle={animatedStyle}/>
                        </View>
                    </View>
                ))}
            </View>

            {/* Filter tabs skeleton */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
            >
                {[1, 2, 3].map((i) => (
                    <Skeleton
                        key={i}
                        className="h-9 w-24 rounded-full"
                        animatedStyle={animatedStyle}
                    />
                ))}
            </ScrollView>

            {/* Session cards skeleton */}
            <View className="gap-3 mt-2">
                {[1, 2, 3].map((i) => (
                    <View
                        key={i}
                        className="p-4 rounded-2xl border-l-4 border-border bg-bg-2"
                    >
                        {/* Teacher row */}
                        <View className="flex-row gap-3 items-center">
                            <Skeleton
                                className="w-14 h-14 rounded-full"
                                animatedStyle={animatedStyle}
                            />
                            <View className="flex-col justify-center gap-2">
                                <Skeleton
                                    className="h-4 w-28 rounded-md"
                                    animatedStyle={animatedStyle}
                                />
                                <View className="flex-row items-center gap-2">
                                    <Skeleton
                                        className="h-4 w-32 rounded-md"
                                        animatedStyle={animatedStyle}
                                    />
                                    <Skeleton
                                        className="h-5 w-16 rounded-md"
                                        animatedStyle={animatedStyle}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Date/time row */}
                        <View className="flex-row gap-4 mt-4">
                            <Skeleton
                                className="h-4 w-36 rounded-md"
                                animatedStyle={animatedStyle}
                            />
                            <Skeleton
                                className="h-4 w-16 rounded-md"
                                animatedStyle={animatedStyle}
                            />
                        </View>

                        {/* Action button */}
                        <Skeleton
                            className="h-12 w-full rounded-2xl mt-4"
                            animatedStyle={animatedStyle}
                        />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}