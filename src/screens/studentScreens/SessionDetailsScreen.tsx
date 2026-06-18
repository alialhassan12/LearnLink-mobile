import { useTheme } from "@/src/providers/ThemeProvider";
import useAuthStore from "@/src/store/authStore";
import { useLiveSessionStore } from "@/src/store/liveSessionsStore";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import {File,Paths} from "expo-file-system";
import * as Sharing from "expo-sharing";
import { router } from "expo-router";

export default function SessionDetailsScreen(){
    const {authUser}=useAuthStore();
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const searchParams=useSearchParams();
    const sessionId=searchParams.get("sessionId");
    const {studentSelectedSession,getStudentSelectedSession,isGettingStudentSelectedSession,getToken,isGettingToken}=useLiveSessionStore();
    
    const scrollRef=useRef<ScrollView>(null);
    const [downloading, setDownloading] = useState<boolean>(false);
    const [selectedFile,setSelectedFile]=useState<number|null>(null);
    
    useEffect(()=>{
        if(sessionId){
            getStudentSelectedSession(Number(sessionId));
        }
    },[getStudentSelectedSession,sessionId]);

    // handle start session
    const handleStartSession=async()=>{
        if(sessionId){
            const roomName=`session-${sessionId}`;
            await getToken(roomName,Number(sessionId));
            const {token}=useLiveSessionStore.getState();
            if(token){
                router.replace('/SessionRoom');
            }
        }
    }

    const downloadFile=async(fileUrl:string,fileName:string)=>{
        try{
            setDownloading(true);

            const filename=new Date().toISOString() + "-" + fileName;

            const file = new File(Paths.document, filename);

            await File.downloadFileAsync(fileUrl, file);

            await Sharing.shareAsync(file.uri);

            setDownloading(false);
        }catch(error){
            setDownloading(false);
            console.log(error);
        }
    };

    if(isGettingStudentSelectedSession){
        return <SessionDetailsSkeleton/>;
    }

    return(
        <ScrollView 
            ref={scrollRef}
            className="px-4 w-full" 
            contentContainerStyle={{paddingBottom:100,gap:16}}
            showsVerticalScrollIndicator={false}
        >
            <View
                className="flex-col justify-center items-center gap-4 rounded-[32px] p-6 overflow-hidden bg-[#1E1B7A]"
            >
                <View 
                    className="w-20 h-20 flex-1 items-center justify-center rounded-xl"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                    }}
                >
                    <FontAwesome5 name="video" size={32} color={"white"} solid></FontAwesome5>
                </View>

                <View className="flex-1 flex-col gap-1">
                    <Text className="text-3xl font-bold text-white text-center">Join the Classroom</Text>
                    <Text className="text-text-weak text-lg text-center font-semibold">
                        {studentSelectedSession?.scheduled_day.substring(0,3).toUpperCase()}, {studentSelectedSession?.scheduled_date}
                    </Text>
                    <Text className="text-text-weak text-lg text-center font-semibold">
                        {studentSelectedSession?.scheduled_time}
                    </Text>
                </View>

                <View className="flex-col w-full gap-2">
                    <Pressable
                        onPress={()=>handleStartSession()}
                        className="h-16 bg-[#4338F2] rounded-2xl flex-row items-center justify-center gap-3 active:opacity-90 active:scale-95 transition-all duration-200 ease-in-out"
                    >
                        {isGettingToken?(
                            <ActivityIndicator size={32} color={"white"} />
                        ):(
                            <>
                                <Text className="text-white text-xl font-bold">
                                    Join Session
                                </Text>

                                <Ionicons
                                    name="arrow-forward"
                                    size={22}
                                    color="white"
                                />
                            </>
                        )}
                    </Pressable>
                    <Pressable className="flex flex-row justify-center items-center rounded-2xl bg-bg-1  py-3 w-full border border-primary active:bg-primary active:border-none active:scale-95 transition-all duration-300 group">
                        <Ionicons name="chatbubble" size={16} color={primaryColor} />
                        <Text className="text-primary text-lg font-light ml-2 group-active:text-white group-active:font-bold">Message Teacher</Text>
                    </Pressable>
                </View>
            </View>

            {/* details card */}
            <View className="flex flex-col p-6 bg-bg-2 border border-border rounded-3xl">
                <View className="border-b border-border pb-5 mb-5">
                    <Text className="text-text-strong text-xl font-bold tracking-tight">Details</Text>
                </View>

                <View className="space-y-4">
                    <View className="flex-row justify-between items-center bg-bg-1 p-3 rounded-xl border border-border">
                        <Text className="text-text-weak text-sm font-medium">Type</Text>
                        <Text className="text-text-strong text-sm font-semibold">1-on-1 Session</Text>
                    </View>
                </View>
                
                {/* User */}
                <View className="flex flex-row items-center gap-2 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/10 mt-4">
                    {!authUser?.avatar_url?(
                        <View
                            className="w-12 h-12 rounded-full  justify-center items-center"
                        >
                            <Ionicons
                                name="person"
                                size={24}
                                color={primaryColor}
                            />
                        </View>
                    ):(
                        <View
                            className="w-12 h-12 rounded-full  justify-center items-center"
                        >
                            <Image
                                source={{ uri: authUser.avatar_url }}
                                className="w-12 h-12 rounded-full"
                            />
                        </View>
                    )}
                    <View className="flex-1">
                        <Text className="text-text-strong font-bold text-sm truncate">{authUser?.name.toUpperCase()}</Text>
                        <Text className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] w-10 font-bold bg-blue-500/20 text-primary">YOU</Text>
                    </View>
                </View>
                {/* Teacher */}
                <View className="flex-row items-center gap-4 p-3 rounded-2xl border border-border mt-4">
                    {!studentSelectedSession?.teacher?.user?.avatar?(
                        <View
                            className="w-12 h-12 rounded-full justify-center items-center"
                        >
                            <Ionicons
                                name="person"
                                size={24}
                                color={primaryColor}
                            />
                        </View>
                    ):(
                        <View
                            className="w-12 h-12 rounded-full justify-center items-center"
                        >
                            <Image
                                source={{ uri: studentSelectedSession?.teacher?.user?.avatar }}
                                className="w-12 h-12 rounded-full"
                            />
                        </View>
                    )}
                    <View className="flex-1 min-w-0">
                        <Text className="text-text-strong font-bold text-sm truncate">{studentSelectedSession?.teacher?.user?.name.toUpperCase()}</Text>
                        <Text className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-text-weak">TEACHER</Text>
                    </View>
                </View>
            </View>

            {/* session materials */}
            <View className="flex flex-col p-6 bg-bg-2 border border-border rounded-3xl">
                <View className="flex-row justify-between items-center border-b border-border pb-5 mb-5">
                    <Text className="text-text-strong text-xl font-bold tracking-tight">Session materials</Text>
                    <Text className="text-primary text-sm font-medium cursor-pointer hover:underline transition-colors duration-200">
                        {studentSelectedSession?.session_materials?.length || 0} Files
                    </Text>
                </View>
                {/* material list */}
                {studentSelectedSession?.session_materials?.length === 0 && (
                    <View className="flex-1 flex-col items-center justify-center py-8 border-dashed border-border border rounded-2xl">
                        <FontAwesome5 name="folder" size={24} color={strongText} className="mb-4"/>
                        <Text className="text-text-weak font-medium">No materials shared for this session yet.</Text>
                    </View>
                )}
                {
                    studentSelectedSession?.session_materials &&(
                        studentSelectedSession?.session_materials?.map((material)=>(
                            <View key={material.id} className="flex-row items-center justify-between p-3 mb-3 border border-border rounded-2xl">
                                <View className="flex-row items-center gap-3">
                                    <FontAwesome5 name="file" size={24} color={primaryColor}/>
                                    <View className="flex-1 min-w-0">
                                        <Text className="text-text-weak text-sm font-medium truncate">{material.title}</Text>
                                        <Text className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-text-weak">{material.file_type}</Text>
                                    </View>
                                    <Pressable 
                                        disabled={downloading}
                                        className="px-2 py-2 z-10 rounded-lg bg-blue-500/20 active:opacity-75 transition-colors duration-200"
                                        onPress={async()=>{
                                            setSelectedFile(material.id);
                                            await downloadFile(material.file_url,material.title);
                                            setSelectedFile(null);
                                        }}
                                    >
                                        {
                                            selectedFile===material.id?(
                                                    <ActivityIndicator size="small" color={primaryColor}/>
                                                ):(
                                                    <Ionicons name="download-outline" size={20} color={primaryColor}/>
                                                )
                                        }
                                    </Pressable>
                                </View>
                            </View>
                        ))
                    )
                }
            </View>
        </ScrollView>
    );
}

const SessionDetailsSkeleton=()=>{
    return(
        <View className="flex-1 bg-bg-1 items-center justify-center">
            <Text className="text-text-strong text-2xl font-bold">Session Loading...</Text>
        </View>
    );
}