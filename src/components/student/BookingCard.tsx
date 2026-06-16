import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useState } from "react";
import useBookingStore from "@/src/store/booking";
import { Teacher } from "@/src/@types/teahcer";
import Toast from "react-native-toast-message";

export default function BookingCard({teacher,open,setOpen,isModal}:{teacher:Teacher,open:boolean,setOpen:(value:boolean)=>void,isModal:boolean}){
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const {createBooking,isCreatingBooking}=useBookingStore();
    
    const day_of_week=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    
    const subjectsItems=(teacher?.subjects ?? []).map((subject)=>{
        return {
            label:subject,
            value:subject
        }
    });

    const defaultStyles = useDefaultStyles();
    const [selectedDate, setSelectedDate] = useState<DateType>();
    const [selectedTime,setSelectedTime] = useState<Date>(new Date(0,0));
    const [showTimePicker,setShowTimePicker]=useState<boolean>(false);
    const [openSubjectPicker,setOpenSubjectPicker]=useState<boolean>(false);
    const [selectedSubject,setSelectedSubject]=useState<string>("");
    const [studentNote,setStudentNote] = useState<string>("");

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
                        teacher_id:Number(teacher.id),
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

    return(
        <ScrollView
            className={`w-full px-3 pb-20 bg-bg-2 rounded-lg border border-border absolute z-10 mt-20 mx-auto ${open?"":"hidden"}`}
            contentContainerStyle={{flexGrow:1}}
            showsVerticalScrollIndicator={false}
        >
            {/* backdrop */}
            <View className="absolute w-full h-full z-20 top-0 left-0 right-0 bg-black/40 rounded-lg"></View>
            
            <View className="w-full flex flex-col gap-2">
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
                        // console.log(time.toTimeString());
                        // console.log(day_of_week[new Date(selectedDate).getDay()]);
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

                {isModal &&(
                    <Pressable 
                        className="absolute top-4 right-4 z-20"
                        onPress={()=>setOpen(false)}
                    >
                        <Text className="text-text-strong text-2xl font-bold">X</Text>
                    </Pressable>
                )}
            </View>
        </ScrollView>
    );
}
