import { useTheme } from "@/src/providers/ThemeProvider";
import { useBrowseStore } from "@/src/store/studentStores/browseStore";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator,Image,Pressable,ScrollView, Text, TextInput, View } from "react-native";
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";
import useBookingStore from "@/src/store/booking";
import MessageButton from "@/src/components/MessageButton";
import { useCourseEnrollmentStore } from "@/src/store/studentStores/courseEnrollmentStore";

export default function TeacherProfile(){
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const {id}=useLocalSearchParams();
    const {teacher,isGettingTeacherById,getTeacherById}=useBrowseStore();
    const {createBooking,isCreatingBooking}=useBookingStore();
    const {enrolledCoursesIds}=useCourseEnrollmentStore();

    const day_of_week=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const defaultStyles = useDefaultStyles();
    const [selectedDate, setSelectedDate] = useState<DateType>();
    const [selectedTime,setSelectedTime] = useState<Date>(new Date(0,0));
    const [showTimePicker,setShowTimePicker]=useState<boolean>(false);
    const [openSubjectPicker,setOpenSubjectPicker]=useState<boolean>(false);
    const [selectedSubject,setSelectedSubject]=useState<string>("");
    const [studentNote,setStudentNote] = useState<string>("");

    const subjectsItems=(teacher?.subjects ?? []).map((subject)=>{
        return {
            label:subject,
            value:subject
        }
    });

    useEffect(()=>{
        getTeacherById(Number(id));
    },[getTeacherById,id]);

    const handleBooking= async()=>{
        if(!selectedDate || selectedTime===new Date(0,0) || !selectedSubject){
            Toast.show({
                type:'error',
                text1:'Please select a date, time, and subject',
            });
            return;
        }
        const day=day_of_week[new Date(selectedDate as Date).getDay()]
        const date=new Date(selectedDate as Date).toISOString().split('T')[0];
        const time=selectedTime.toTimeString().slice(0,5);

        if(date && time){
            if(teacher?.availabilities?.some((slot)=>{
                if(slot.day_of_week === day){
                    if(slot.start_time <= time && slot.end_time>=time){
                        return true;
                    }else{
                        return false;
                    }
                }
                return false;
            })){
                await createBooking({
                    teacher_id:Number(id),
                    scheduled_date:date,
                    scheduled_time:time,
                    scheduled_day:day,
                    subject:selectedSubject,
                    student_note:studentNote,
                    price:teacher?.hourly_rate,
                });

                setSelectedDate(undefined);
                setSelectedTime(new Date(0,0));
                setSelectedSubject("");
                setStudentNote("");

            }else{
                Toast.show({
                    type:'error',
                    text1:'Teacher is not available at the selected time or date',
                });
                return;
            }
        }

    }

    if(isGettingTeacherById){
        return <TeacherProfileSkeleton/>;
    }

    return (
        <ScrollView 
            className="px-4 w-full" 
            contentContainerStyle={{flexGrow:1,paddingBottom:100}}
            showsVerticalScrollIndicator={false}
        >
            <View className="justify-start items-start ">
                <Ionicons name="arrow-back" size={30} color={primaryColor} onPress={()=>{router.replace('/(student)/Teachers')}}/>
            </View>
            <View className="flex flex-col gap-4 justify-center items-center mt-12">
                {/* avatar */}
                <View className="w-52 h-52 rounded-full overflow-hidden border-4 border-primary">
                    {teacher?.user?.avatar_url ? (
                        <Image
                            source={{uri:teacher?.user?.avatar_url}}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-full flex items-center justify-center bg-bg-2">
                            <FontAwesome5 name="user" size={60} color={primaryColor}/>
                        </View>
                    )}
                </View>

                {/* name, headline */}
                <View className="flex flex-col gap-2">
                    <Text className="text-text-strong text-3xl font-bold text-center">{teacher?.user?.name}</Text>
                    <Text className="text-primary text-lg font-light text-center">{teacher?.headline? teacher.headline : "No headline available."}</Text>
                </View>
                {/* rating */}
                <View className="flex flex-row items-center gap-1">
                    <FontAwesome5 name="star" size={12} color="#eab308"/>
                    <Text className="text-yellow-500 text-sm font-semibold ">{Number(teacher?.avg_rating).toFixed(1)}</Text>
                    <Text className="text-sm text-text-weak">({teacher?.review_count} reviews)</Text>
                </View>

                {/* languages, location */}
                <View className="flex flex-row gap-2">
                    <View className="flex flex-row items-center font-semibold px-2 py-1 bg-blue-500/20 rounded-lg">
                        <FontAwesome5 name="globe" className="mr-2" size={16} color={primaryColor}/>
                        {!teacher?.languages && (
                            <Text className="text-text-weak">No languages set</Text>
                        ) }
                        {teacher?.languages && teacher?.languages?.map((lang,index)=>{
                            return (
                                <Text key={index} className="text-text-weak">
                                    {index>=teacher.languages.length-1 ? lang : `${lang}, `}
                                </Text>
                            );
                        })}
                    </View>
                    <View className="flex flex-row items-center font-semibold px-2 py-1 bg-blue-500/20 rounded-lg">
                        <FontAwesome5 name="map-pin" className="mr-2" size={16} color={primaryColor}/>
                        {teacher?.location?(
                            <Text className="text-text-weak">{teacher?.location}</Text>
                        ):(
                            <Text className="text-text-weak">No location set</Text>
                        )}
                    </View>
                </View>

                {/* hourly-rate, message-btn */}
                <View className="flex flex-col justify-center items-center p-4 rounded-xl w-full bg-blue-500/20 mt-8">
                    {/* hourly-rate */}
                    <View className="flex flex-row justify-center items-center ">
                        <FontAwesome5 name="dollar-sign" size={16} color={primaryColor}/>
                        <Text className="text-text-strong text-lg font-semibold ml-2">{teacher?.hourly_rate}</Text>
                        <Text className="text-text-weak text-lg font-light">/hour</Text>
                    </View>

                    <MessageButton recieverUser={teacher?.user!} />

                </View>

                {/* about */}
                <View className="w-full flex flex-col gap-4 p-4 bg-bg-2 rounded-2xl">
                    <Text className="text-text-strong text-2xl font-bold">About {teacher?.user?.name}</Text>
                    {teacher?.bio?(
                        <Text className="text-text-weak text-lg font-light text-start">{teacher?.bio}</Text>
                    ):(
                        <Text className="text-text-weak text-lg font-light text-start">No bio set</Text>
                    )}
                </View>

                {/* subjects */}
                <View className="w-full flex flex-col gap-4 p-4 bg-bg-2 rounded-2xl">
                    <Text className="text-text-strong text-2xl font-bold">Subjects & Expertise</Text>
                    <View className="flex flex-row flex-wrap gap-2">
                        {!teacher?.subjects && (
                            <Text className="text-text-weak text-lg font-light text-start">No subjects set</Text>
                        )}
                        {teacher?.subjects && teacher.subjects.map((subject,index)=>{
                            return (
                                <Text key={index} className="text-text-weak font-semibold px-2 py-1 bg-blue-500/20 rounded-lg h-8">{subject}</Text>
                            );
                        })}
                    </View>
                </View>

                {/* weekly availability */}
                <View className="w-full flex flex-col gap-4 p-4">
                    <Text className="text-text-strong text-2xl font-bold">Weekly Availability</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={{ gap:10 }}
                    >
                        {day_of_week.map((day,index)=>{
                            const day_availability=teacher?.availabilities?.find(availability=>availability.day_of_week === day);
                            let start_time="---";
                            let end_time="---";
                            if(day_availability){
                                start_time=day_availability.start_time;
                                end_time=day_availability.end_time;
                            }
                            return (
                                <View key={index} className={`flex flex-col items-center justify-between gap-2 min-w-[150px] min-h-[150px] p-3 rounded-xl ${day_availability? 'bg-blue-500/20 border border-blue-500/20' : 'bg-blue-500/10'}`}>
                                    <Text className={`text-2xl font-bold ${day_availability? 'text-blue-500' : 'text-text-weak'}`}>
                                        {day.substring(0,3)}
                                    </Text>
                                    <View className="flex flex-col gap-1.5 w-full">
                                        <Text className={`text-lg font-bold rounded-lg py-1.5 text-center ${day_availability ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-muted text-text-weak'}`}>
                                            {start_time}
                                        </Text>
                                        <Text className={`text-lg font-bold rounded-lg py-1.5 text-center ${day_availability ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-muted text-text-weak'}`}>
                                            {end_time}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Book session card */}
                <View className="w-full flex flex-col gap-2 p-4 bg-bg-2 rounded-lg">
                    <Text className="text-text-strong text-2xl font-bold">Book a Session</Text>
                    <Text className="text-text-weak text-lg font-light">Select your preferred slot based on teacher availability</Text>
                    {/* calendar */}
                    <Text className="text-text-strong text-xl font-bold mt-4">Pick a Date</Text>
                    <DateTimePicker
                        mode="single"
                        timeZone="UTC"
                        date={selectedDate}
                        onChange={({date})=>setSelectedDate(date)}
                        styles={defaultStyles}
                    />

                    {/* time picker */}
                    <Text className="text-text-strong text-xl font-bold">Pick a time</Text>
                    <Pressable 
                        onPress={()=>{
                            setShowTimePicker(true);
                        }}
                        className="flex flex-row justify-center items-center gap-2 bg-blue-500/20 py-2 px-4 rounded-xl border border-blue-500 active:scale-95 transition-transform duration-200"
                    >
                        <Text className="text-text-strong text-xl font-bold">{selectedTime.toTimeString().slice(0,5)}</Text>
                    </Pressable>

                    <DateTimePickerModal
                        isVisible={showTimePicker}
                        mode="time"
                        onConfirm={(time)=>{
                            setSelectedTime(time);
                            setShowTimePicker(false);
                        }}
                        onCancel={()=>{
                            setShowTimePicker(false);
                        }}
                    />
                    
                    <Text className="text-text-strong text-xl font-bold mt-4">Select Session Subject</Text>
                    <DropDownPicker    
                        open={openSubjectPicker}
                        setOpen={setOpenSubjectPicker}
                        items={subjectsItems}
                        value={selectedSubject}
                        setValue={setSelectedSubject}
                        listMode="SCROLLVIEW"
                        style={{
                            marginBottom:10,
                            paddingVertical:8,
                            paddingHorizontal:12,
                            borderRadius:12,
                            borderWidth:1,
                            borderColor:primaryColor,
                            backgroundColor:"#3B82F633",
                        }}
                        textStyle={{
                            color:isDark ? "#fff" : "#1e293b",
                        }}
                        dropDownContainerStyle={{
                            backgroundColor:isDark ? "#1e293b" : "#fff",
                            borderColor:primaryColor
                        }}
                    />

                    {/* student Note */}

                    <View className="flex flex-row items-center gap-2 mt-4">
                        <Text className="text-text-strong text-xl font-bold ">Student Note</Text>
                        <Text className="text-text-weak text-lg font-light">(Optional)</Text>
                    </View>
                    <TextInput
                        value={studentNote}
                        onChangeText={setStudentNote}
                        placeholder="Enter your note..."
                        placeholderTextColor={isDark ? "#94a3b8" : "#64748b"}
                        multiline
                        className="text-text-strong text-lg font-light bg-blue-500/20 rounded-lg border border-primary"
                    />

                    <Pressable
                        className="bg-primary py-4 px-8 rounded-xl mt-8 mb-4 active:scale-95 transition-transform duration-200"
                        onPress={handleBooking}
                    >
                        {
                            isCreatingBooking?(
                                <ActivityIndicator color={isDark ? "#1e293b" : "#fff"} />
                            ):(

                                <Text className="text-text-strong text-lg font-bold text-center">Book Session</Text>
                            )
                        }
                    </Pressable>
                </View>

                {/* Courses by */}
                <View className="w-full flex flex-col gap-4 p-4">
                    <Text className="text-text-strong text-2xl font-bold">Courses by {teacher?.user?.name}</Text>
                    <View>
                        {!teacher?.published_courses?.length && (
                            <Text className="text-text-weak text-lg font-bold">No courses published yet</Text>
                        )}
                        {teacher?.published_courses?.map((course,index)=>{
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

                                            {/* course details */}
                                            <Text className="text-text-strong text-lg font-semibold">
                                                {course.title}
                                            </Text>

                                            {/* price and enroll */}
                                            <View className="flex flex-row justify-between items-center mt-2">
                                                <Text className="text-primary text-lg font-bold">${course.price}</Text>
                                                {enrolledCoursesIds.includes(course?.id as number)?(
                                                    <Pressable
                                                        onPress={()=>{
                                                            router.replace({
                                                                pathname:"/(student)/(Library)/Learnings/CourseLearning",
                                                                params:{
                                                                    courseId:course?.id
                                                                }
                                                            })
                                                        }}
                                                        className="bg-transparent border border-border rounded-lg px-4 py-2 active:scale-95 transition-all duration-300"
                                                    >
                                                        <Text className="text-text-strong font-bold">Go to course</Text>
                                                    </Pressable>
                                                ):(
                                                    <Pressable
                                                        onPress={()=>{
                                                            router.push({
                                                                pathname:"/(student)/(Courses)/[CourseId]",
                                                                params:{
                                                                    CourseId:course.id?.toString() as string
                                                                }
                                                            });
                                                        }}
                                                        className="bg-primary rounded-lg px-4 py-2 active:scale-95 transition-all duration-300"
                                                    >
                                                        <Text className="text-white font-bold">Enroll</Text>
                                                    </Pressable>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                            )
                        })}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const TeacherProfileSkeleton=()=>{
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={primaryColor}/>
        </View>
    )
}