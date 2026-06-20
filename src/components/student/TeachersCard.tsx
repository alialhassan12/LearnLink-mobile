import { Teacher } from "@/src/@types/teahcer";
import { useTheme } from "@/src/providers/ThemeProvider";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useState } from "react";
import { useBrowseStore } from "@/src/store/studentStores/browseStore";
import BookingCard from "./BookingCard";


export default function TeachersCard({teacher}:{teacher:Teacher}){
    const {isDark}=useTheme();
    const strongText = isDark ? "#f8fafc" : "#0f172a";
    const [selectedTeacher,setSelectedTeacher] = useState<Teacher | null>(null);
    const [openBookingCard,setOpenBookingCard]=useState<boolean>(false);

    const handleSetBookingState=(teacher:Teacher)=>{
        setSelectedTeacher(teacher);
        if(teacher){
            console.log("setting state");
            setOpenBookingCard(true);
            console.log("open card: ",openBookingCard);
            
        }else{
            console.log("setting state to false");
            setOpenBookingCard(false);
            setSelectedTeacher(null);
        }
    }

    return(
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
                        onPress={()=>router.push(`/TeacherProfile?id=${teacher.id}`)}
                        className="w-full border border-primary text-primary py-3 rounded-lg items-center active:bg-primary active:scale-95 transition-all duration-300 group"
                    >
                        <Text className="text-primary text-md font-bold group-active:text-text-strong transition-all duration-300">
                            View Profile
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={()=>handleSetBookingState(teacher)}
                        className="w-full bg-primary  text-white py-3 rounded-lg items-center active:bg-transparent active:scale-95 transition-all duration-300 group"
                    >
                        <Text className="text-white text-md font-bold group-active:text-primary">Book Session</Text>
                    </Pressable>
                </View>
            </View>
            {selectedTeacher &&(
                <BookingCard teacher={selectedTeacher!} open={openBookingCard} setOpen={setOpenBookingCard} isModal={true} />
            )}
        </View>
    );
}