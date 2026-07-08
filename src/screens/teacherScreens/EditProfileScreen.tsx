import useAuthStore from "@/src/store/authStore";
import { MobileFile } from "@/src/store/chatStore";
import { useTeacherStore } from "@/src/store/teacherStore";
import { useState } from "react";
import { Text, View, ScrollView, Image, Pressable, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/src/providers/ThemeProvider";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Input from "@/src/components/Input";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from "react-native-dropdown-picker";

export default function EditProfileScreen(){
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const strongText=isDark?"#fff":"#000";
    const borderColor=isDark?"#334155":"#e2e8f0";

    const {authUser,setAuthUser}=useAuthStore();
    const {teacher,updateTeacher,isUpdatingTeacher}=useTeacherStore();
    
    const [formData, setFormData]=useState<{
        name:string,
        headline:string,
        avatar:MobileFile | string,
        avatar_url:string,
        location:string,
        bio:string,
        subjects:string[],
        languages:string[],
        hourlyRate:number,
        availability:Array<{day_of_week:string, start_time:string, end_time:string}>,
    }>({
        name:teacher?.user?.name || '',
        headline:teacher?.headline || '',
        avatar:teacher?.user?.avatar || '',
        avatar_url:teacher?.user?.avatar_url || '',
        location:teacher?.location || '',
        bio:teacher?.bio || '',
        subjects:teacher?.subjects || [],
        languages:teacher?.languages || [],
        hourlyRate:teacher?.hourly_rate || 0,
        availability:teacher?.availabilities || [],
    });

    const [addSubjectField,setAddSubjectField]=useState<string>("");
    const [addLanguageField,setAddLanguageField]=useState<string>("");
    
    const [newSlot, setNewSlot] = useState({
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '10:00'
    });

    // Time picker states
    const [showStartTimePicker,setShowStartTimePicker]=useState(false);
    const [showEndTimePicker,setShowEndTimePicker]=useState(false);

    // Day picker state
    const [openDayPicker,setOpenDayPicker]=useState(false);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayItems = days.map(d => ({ label: d, value: d }));

    // handlers
    const uploadAvatar=async()=>{
        const result=await ImagePicker.launchImageLibraryAsync({
            mediaTypes:["images"],
            allowsEditing:true,
            quality:1
        });

        if(!result.canceled){
            const asset=result.assets?.[0];
            setFormData({
                ...formData,
                avatar_url:asset?.uri || "",
                avatar:{
                    uri:asset?.uri || "",
                    name:asset?.fileName || `avatar.${asset?.uri?.split('.').pop()}` || "",
                    type:asset?.mimeType || 'image/jpeg',
                    size:asset?.fileSize || 0
                }
            });
        }
    };

    const removeAvatar=()=>{
        setFormData({
            ...formData,
            avatar:'',
            avatar_url:""
        });
    };

    const handleAddSubject=()=>{
        if(formData.subjects.includes(addSubjectField.trim()))return;
        if(!addSubjectField.trim())return;
        setFormData((prev)=>({...prev,subjects:[...prev.subjects,addSubjectField.toLocaleLowerCase().trim()]}));
        setAddSubjectField("");
    };
    const handleRemoveSubject=(index:number)=>{
        setFormData((prev)=>({...prev,subjects:prev.subjects.filter((_,i)=>i!==index)}));
    };
    const handleAddLanguage=()=>{
        if(formData.languages.includes(addLanguageField.trim()))return;
        if(!addLanguageField.trim())return;
        setFormData((prev)=>({...prev,languages:[...prev.languages,addLanguageField.toLocaleLowerCase().trim()]}));
        setAddLanguageField("");
    };
    const handleRemoveLanguage=(index:number)=>{
        setFormData((prev)=>({...prev,languages:prev.languages.filter((_,i)=>i!==index)}));
    };

    const handleAddSlot = () => {
        if(!newSlot.day_of_week||!newSlot.start_time||!newSlot.end_time)
            return;
        if(formData.availability?.some(slot=>slot.day_of_week===newSlot.day_of_week)){
            Toast.show({
                type:"error",
                text1:"Day already exists"
            });
            return;
        }
        if(newSlot.start_time>=newSlot.end_time){
            Toast.show({
                type:"error",
                text1:"Start time must be before end time"
            });
            return;
        }
        setFormData(prev => ({
            ...prev,
            availability: [...prev.availability, newSlot]
        }));
        setNewSlot({day_of_week:'Monday',start_time:'09:00',end_time:'10:00'});
    };

    const handleRemoveSlot = (index: number) => {
        setFormData(prev => ({
            ...prev,
            availability: prev.availability.filter((_, i) => i !== index)
        }));
    };

    const handleSaveChanges=async()=>{
        const newFormdata=new FormData();
        newFormdata.append('name',formData.name);
        newFormdata.append('headline',formData.headline);
        newFormdata.append('location',formData.location);
        newFormdata.append('bio',formData.bio);
        newFormdata.append('subjects',JSON.stringify(formData.subjects));
        newFormdata.append('languages',JSON.stringify(formData.languages));
        newFormdata.append('hourly_rate',formData.hourlyRate.toString());
        if(typeof formData.avatar === 'object' && formData.avatar !== null){
            newFormdata.append('avatar',formData.avatar as any);
        }
        newFormdata.append('availability',JSON.stringify(formData.availability));
        
        const updatedTeacher=await updateTeacher(newFormdata);
        if(updatedTeacher){
            setAuthUser({
                ...authUser!,
                name:updatedTeacher.user?.name || authUser!.name,
                avatar_url:updatedTeacher.user?.avatar_url || authUser!.avatar_url,
            });
            router.back();
        }
    };

    return (
        <ScrollView 
            className="w-full bg-bg-1" 
            contentContainerStyle={{paddingBottom:120,gap:16}}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
        >
            {/* Top Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-bg-2 border-b border-border">
                <View className="flex-row items-center">
                    <Pressable 
                        onPress={() => router.back()}
                        className="p-1 active:scale-95 transition-all duration-100 mr-3"
                    >
                        <Ionicons name="arrow-back" size={24} color={strongText} />
                    </Pressable>
                    <Text className="text-xl font-bold text-text-strong">Edit Profile</Text>
                </View>
            </View>

            {/* Page Description */}
            <View className="px-4">
                <Text className="text-text-weak text-sm">
                    Manage how you appear to students and institutions in the marketplace.
                </Text>
            </View>

            <View className="px-4 gap-4">

                {/* ── Basic Info Card ── */}
                <View className="flex flex-col gap-4 bg-bg-2 p-5 rounded-3xl border border-border">
                    <View className="flex flex-row items-center gap-2">
                        <Ionicons name="information-circle-outline" size={22} color={primaryColor} />
                        <Text className="text-lg font-bold text-text-strong">Basic Info</Text>
                    </View>

                    {/* Avatar */}
                    <View className="flex items-center justify-center mt-2">
                        <View className="relative h-32 w-32 bg-bg-1 rounded-full border border-border">
                            {formData.avatar_url ? (
                                <Image source={{uri:formData.avatar_url}} className="rounded-full h-full w-full object-cover"/>
                            ) : (
                                <View className="flex-1 justify-center items-center h-full w-full rounded-full bg-primary">
                                    <Text className="text-3xl font-bold text-white">{formData.name?.charAt(0)?.toUpperCase()}</Text>
                                </View>
                            )}
                            {/* Upload camera icon */}
                            <Pressable
                                onPress={uploadAvatar}
                                className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full border-2 border-bg-1"
                            >
                                <Ionicons name="camera" size={18} color="#f8fafc" />
                            </Pressable>
                            {/* Remove image button */}
                            {((typeof formData.avatar === 'object' && formData.avatar !==null) || (formData.avatar_url !== ""))&&(
                                <Pressable
                                    onPress={removeAvatar}
                                    className="absolute top-0 -left-1 bg-red-500/20 rounded-full p-1 flex items-center justify-center"
                                >
                                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                                </Pressable>
                            )}
                        </View>
                    </View>

                    {/* Name */}
                    <View className="w-full">
                        <Text className="text-text-weak font-semibold text-sm ml-1 mb-1">Name</Text>
                        <Input
                            className="rounded-xl"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            placeholder="Dr. Example"
                        />
                    </View>

                    {/* Headline */}
                    <View className="w-full">
                        <Text className="text-text-weak font-semibold text-sm ml-1 mb-1">Headline</Text>
                        <Input
                            className="rounded-xl"
                            value={formData.headline}
                            onChangeText={(text) => setFormData({ ...formData, headline: text })}
                            placeholder="Add a headline to highlight your expertise"
                        />
                    </View>

                    {/* Location */}
                    <View className="w-full">
                        <Text className="text-text-weak font-semibold text-sm ml-1 mb-1">Location</Text>
                        <Input
                            className="rounded-xl"
                            value={formData.location}
                            onChangeText={(text) => setFormData({ ...formData, location: text })}
                            placeholder="City, Country"
                        />
                    </View>
                </View>

                {/* ── Bio / About Card ── */}
                <View className="flex flex-col gap-4 bg-bg-2 p-5 rounded-3xl border border-border">
                    <View className="flex flex-row items-center gap-2">
                        <FontAwesome5 name="book-open" size={18} color={primaryColor} />
                        <Text className="text-lg font-bold text-text-strong">Bio / About</Text>
                    </View>
                    <Input
                        multiline={true}
                        className="rounded-xl h-24"
                        value={formData.bio}
                        onChangeText={(text) => setFormData({ ...formData, bio: text })}
                        placeholder="Talk about your experience and teaching skills"
                        numberOfLines={6}
                    />
                </View>

                {/* ── Expertise / Subjects Tags Card ── */}
                <View className="flex flex-col gap-4 bg-bg-2 p-5 rounded-3xl border border-border">
                    <View className="flex flex-row items-center gap-2">
                        <FontAwesome5 name="tags" size={16} color={primaryColor} />
                        <Text className="text-lg font-bold text-text-strong">Expertise / Subjects</Text>
                    </View>
                    {/* Tags display */}
                    <View className="flex flex-row flex-wrap gap-2 border border-dashed border-border rounded-2xl p-3 min-h-[50px]">
                        {formData.subjects.length === 0 ? (
                            <Text className="text-sm text-text-weak">No tags added yet.</Text>
                        ) : (
                            formData.subjects.map((subject, index) => (
                                <View key={index} className="flex flex-row items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-full">
                                    <Text className="text-sm text-primary font-semibold">{subject}</Text>
                                    <Pressable onPress={() => handleRemoveSubject(index)} className="active:scale-90">
                                        <Ionicons name="close-circle" size={18} color={primaryColor} />
                                    </Pressable>
                                </View>
                            ))
                        )}
                    </View>
                    {/* Add tag input */}
                    <View className="flex flex-row gap-2 items-center">
                        <View className="flex-1">
                            <Input
                                className="rounded-xl"
                                value={addSubjectField}
                                onChangeText={setAddSubjectField}
                                placeholder="Add a subject tag"
                            />
                        </View>
                        <TouchableOpacity 
                            onPress={handleAddSubject}
                            className="h-12 w-12 border border-primary rounded-xl justify-center items-center active:scale-90"
                        >
                            <Ionicons name="add" size={24} color={primaryColor} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Languages Card ── */}
                <View className="flex flex-col gap-4 bg-bg-2 p-5 rounded-3xl border border-border">
                    <View className="flex flex-row items-center gap-2">
                        <FontAwesome5 name="language" size={16} color={primaryColor} />
                        <Text className="text-lg font-bold text-text-strong">Languages</Text>
                    </View>
                    {/* Languages display */}
                    <View className="flex flex-row flex-wrap gap-2 border border-dashed border-border rounded-2xl p-3 min-h-[50px]">
                        {formData.languages.length === 0 ? (
                            <Text className="text-sm text-text-weak">No languages added yet.</Text>
                        ) : (
                            formData.languages.map((language, index) => (
                                <View key={index} className="flex flex-row items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-full">
                                    <Text className="text-sm text-primary font-semibold">{language}</Text>
                                    <Pressable onPress={() => handleRemoveLanguage(index)} className="active:scale-90">
                                        <Ionicons name="close-circle" size={18} color={primaryColor} />
                                    </Pressable>
                                </View>
                            ))
                        )}
                    </View>
                    {/* Add language input */}
                    <View className="flex flex-row gap-2 items-center">
                        <View className="flex-1">
                            <Input
                                className="rounded-xl"
                                value={addLanguageField}
                                onChangeText={setAddLanguageField}
                                placeholder="Add a language"
                            />
                        </View>
                        <TouchableOpacity 
                            onPress={handleAddLanguage}
                            className="h-12 w-12 border border-primary rounded-xl justify-center items-center active:scale-90"
                        >
                            <Ionicons name="add" size={24} color={primaryColor} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Hourly Rate Card ── */}
                <View className="flex flex-col gap-4 bg-bg-2 p-5 rounded-3xl border border-border">
                    <View className="flex flex-row items-center gap-2">
                        <FontAwesome5 name="dollar-sign" size={16} color={primaryColor} />
                        <Text className="text-lg font-bold text-text-strong">Hourly Rate</Text>
                    </View>
                    <Text className="text-text-weak text-xs ml-1">Base Hourly Rate ($)</Text>
                    <View className="flex flex-row items-center gap-3">
                        <Text className="text-text-strong font-black text-xl">$</Text>
                        <View className="flex-1">
                            <Input
                                className="rounded-xl"
                                value={formData.hourlyRate.toString()}
                                onChangeText={(text) => setFormData({...formData, hourlyRate: Number(text) || 0})}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />
                        </View>
                        <Text className="text-text-weak font-medium text-sm">/ hour</Text>
                    </View>
                </View>

                {/* ── Weekly Availability Card ── */}
                <View className="flex flex-col gap-4 bg-bg-2 p-5 rounded-3xl border border-border" style={{zIndex: 100}}>
                    <View className="flex flex-row items-center gap-2">
                        <FontAwesome5 name="calendar-alt" size={16} color={primaryColor} />
                        <Text className="text-lg font-bold text-text-strong">Weekly Availability</Text>
                    </View>

                    {/* Add New Slot Form */}
                    <View className="p-4 border border-dashed border-border rounded-2xl bg-bg-1/30 gap-3" style={{zIndex: 100}}>
                        {/* Day Picker */}
                        <View style={{zIndex: 200}}>
                            <Text className="text-text-weak font-semibold text-sm ml-1 mb-1">Day of Week</Text>
                            <DropDownPicker
                                open={openDayPicker}
                                setOpen={setOpenDayPicker}
                                items={dayItems}
                                value={newSlot.day_of_week}
                                setValue={(cb) => {
                                    const val = typeof cb === 'function' ? cb(newSlot.day_of_week) : cb;
                                    setNewSlot(prev => ({...prev, day_of_week: val}));
                                }}
                                listMode="SCROLLVIEW"
                                style={{
                                    paddingVertical:8,
                                    paddingHorizontal:12,
                                    borderRadius:12,
                                    borderWidth:1,
                                    borderColor:borderColor,
                                    backgroundColor:isDark?"#1e293b": "#f8fafc",
                                }}
                                textStyle={{
                                    color:isDark ? "#fff" : "#1e293b",
                                    fontWeight:"600",
                                }}
                                dropDownContainerStyle={{
                                    backgroundColor:isDark ? "#1e293b" : "#fff",
                                    borderColor:primaryColor,
                                    borderRadius:12,
                                }}
                            />
                        </View>

                        {/* Time Pickers Row */}
                        <View className="flex flex-row gap-3">
                            {/* Start Time */}
                            <View className="flex-1">
                                <Text className="text-text-weak font-semibold text-sm ml-1 mb-1">Start Time</Text>
                                <Pressable 
                                    onPress={() => setShowStartTimePicker(true)}
                                    className="flex flex-row items-center justify-center gap-2 bg-bg-1 border border-border rounded-xl py-3 px-4 active:scale-95"
                                >
                                    <FontAwesome5 name="clock" size={14} color={primaryColor} />
                                    <Text className="text-text-strong font-bold text-base">{newSlot.start_time}</Text>
                                </Pressable>
                            </View>

                            {/* End Time */}
                            <View className="flex-1">
                                <Text className="text-text-weak font-semibold text-sm ml-1 mb-1">End Time</Text>
                                <Pressable 
                                    onPress={() => setShowEndTimePicker(true)}
                                    className="flex flex-row items-center justify-center gap-2 bg-bg-1 border border-border rounded-xl py-3 px-4 active:scale-95"
                                >
                                    <FontAwesome5 name="clock" size={14} color={primaryColor} />
                                    <Text className="text-text-strong font-bold text-base">{newSlot.end_time}</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* DateTimePickerModals */}
                        <DateTimePickerModal
                            isVisible={showStartTimePicker}
                            mode="time"
                            onConfirm={(time) => {
                                const h = time.getHours().toString().padStart(2,'0');
                                const m = time.getMinutes().toString().padStart(2,'0');
                                setNewSlot(prev => ({...prev, start_time: `${h}:${m}`}));
                                setShowStartTimePicker(false);
                            }}
                            onCancel={() => setShowStartTimePicker(false)}
                        />
                        <DateTimePickerModal
                            isVisible={showEndTimePicker}
                            mode="time"
                            onConfirm={(time) => {
                                const h = time.getHours().toString().padStart(2,'0');
                                const m = time.getMinutes().toString().padStart(2,'0');
                                setNewSlot(prev => ({...prev, end_time: `${h}:${m}`}));
                                setShowEndTimePicker(false);
                            }}
                            onCancel={() => setShowEndTimePicker(false)}
                        />

                        {/* Add Slot Button */}
                        <Pressable 
                            onPress={handleAddSlot}
                            className="flex flex-row items-center justify-center gap-2 bg-primary/10 border border-primary rounded-xl py-3 active:scale-95"
                        >
                            <Ionicons name="add-circle-outline" size={20} color={primaryColor} />
                            <Text className="text-primary font-bold text-sm">Add Slot</Text>
                        </Pressable>
                    </View>

                    {/* Current Slots List */}
                    {formData.availability.length === 0 ? (
                        <View className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-border rounded-2xl">
                            <FontAwesome5 name="clock" size={24} color={isDark ? "#64748b" : "#94a3b8"} />
                            <Text className="text-text-weak text-sm italic mt-2">No availability slots added yet.</Text>
                        </View>
                    ) : (
                        <View className="flex flex-col gap-3">
                            {formData.availability.map((slot, index) => (
                                <View 
                                    key={index} 
                                    className="flex flex-row justify-between items-center p-4 rounded-2xl bg-bg-1/50 border border-border"
                                >
                                    <View className="flex flex-col gap-0.5">
                                        <Text className="text-xs font-black text-primary uppercase tracking-wider">{slot.day_of_week}</Text>
                                        <Text className="text-sm text-text-strong font-semibold">
                                            {slot.start_time} - {slot.end_time}
                                        </Text>
                                    </View>
                                    <Pressable 
                                        onPress={() => handleRemoveSlot(index)}
                                        className="p-2 bg-red-500/10 rounded-xl active:scale-90"
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* ── Action Buttons ── */}
                <View className="flex flex-col gap-3 mt-2">
                    {/* Save Button */}
                    <Pressable 
                        className="flex-row items-center gap-2 justify-center bg-primary py-3 rounded-xl active:opacity-70 active:scale-95 transition-all duration-200 shadow-sm"
                        onPress={handleSaveChanges}
                        disabled={isUpdatingTeacher}
                    >
                        {isUpdatingTeacher ? (
                            <View className="flex flex-row items-center gap-2">
                                <ActivityIndicator color="#f8fafc" size="small"/>
                                <Text className="text-white font-bold text-base">Updating...</Text>
                            </View>
                        ):(
                            <View className="flex flex-row items-center gap-2">
                                <Ionicons name="save-outline" size={20} color="#f8fafc"/>
                                <Text className="text-white font-bold text-base">Save Changes</Text>
                            </View>
                        )}
                    </Pressable>

                    {/* Discard Button */}
                    <Pressable 
                        className="flex-row items-center gap-2 justify-center bg-transparent border border-border py-3 rounded-xl active:opacity-70 active:scale-95 transition-all duration-200"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="close-outline" size={20} color={strongText}/>
                        <Text className="text-text-strong font-bold text-base">Discard</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}