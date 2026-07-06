import { useTheme } from "@/src/providers/ThemeProvider";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { View,Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Pressable, ActivityIndicator } from "react-native";
import Input from "../../components/Input";
import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import useCategoryStore from "@/src/store/categoryStore";
import { useCreateCourseStore } from "@/src/store/createCourseStore";
import * as ImagePicker from 'expo-image-picker';
import Toast from "react-native-toast-message";
import CreateCourseProgressBar from "@/src/components/teacherComponents/CreateCourseComponents/CreateCourseProgressBar";
import { router } from "expo-router";
import { useCourseStore } from "@/src/store/courseStore";

export default function CreateCourseStep1(){
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    const strongColor=isDark?"#fff":"#000";
    const borderColor=isDark?"#334155":"#e2e8f0";

    const {
        courseData,
        setCourseData,
        imagePreview,
        setImagePreview,
        selectedCategory,
        setSelectedCategory,
        selectedLanguage,
        setSelectedLanguage,
        setStepProgress,
        stepProgress,
        clearCourseAndSectionData,
        courseSections
    }=useCreateCourseStore();

    const {saveDraftCourse,isSavingDraft}=useCourseStore();

    const {categories,getCategories}=useCategoryStore();
    const [openCategoryPicker,setOpenCategoryPicker]=useState<boolean>(false);
    const [openLanguagePicker,setOpenLanguagePicker]=useState<boolean>(false);
    
    
    useEffect(()=>{
        getCategories();
    },[getCategories]);

    const uploadThumbnail=async()=>{
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Toast.show({
                type: 'error',
                text1: 'Permission to access media library is required!'
            });
            return;
        }
        const result=await ImagePicker.launchImageLibraryAsync({
            mediaTypes:["images"],
            allowsEditing:true,
            quality:1
        });
        if(result.canceled){
            return;
        }
        const assets=result.assets?.[0];
        if(assets){
            setCourseData({
                ...courseData,
                thumbnail:{
                    uri:assets?.uri || "",
                    type:assets?.mimeType || "",
                    name:assets?.fileName || "",
                    size:assets?.fileSize || 0,
                }
            });
            setImagePreview(assets?.uri || "");
        }
    }
    
    const categoriesItems=categories.map((category)=>{
        return {
            label:category.title,
            value:category.id
        }
    });

    const languagesItems=[
        {
            label:"Arabic",
            value:"Arabic"
        },  
        {
            label:"English",
            value:"English"
        }
    ];

    const handleNextStep=()=>{
        if(!courseData.title.trim() || !selectedCategory || !selectedLanguage || !courseData.description.trim()){
            Toast.show({
                type:"error",
                text1:"Please fill all the course basic info fields"
            });
            return;
        }
        setCourseData({...courseData,category_id:selectedCategory,language:selectedLanguage});
        setStepProgress(50);
        router.replace("/(teacher)/(Library)/(Courses)/CreateCourse/Step2");
    }
    const handlePreviousStep=()=>{
        setStepProgress(10);
        router.back();
    }

    const handleDiscard=()=>{
        clearCourseAndSectionData();
        router.replace("/(teacher)/(Library)/(Courses)");
    }

    const handleSaveDraft=async()=>{
        if(stepProgress ===10){
            Toast.show({
                type:"error",
                text1:"Please add at least 1 section to the course"
            });
            return;
        }

        const data={
            "category_id":Number(courseData?.category_id || 0),
            "title":courseData?.title || "untitled-course",
            "description":courseData?.description || "",
            "thumbnail":courseData?.thumbnail!,
            "language":courseData?.language || "",
            "price":Number(courseData?.price || 0),
            "sections":courseSections?.map(section=>{
                return({
                    "title":section?.title,
                    "order":Number(section?.order),
                    "materials":section?.materials?.map(material=>{
                        return({
                            "file":material?.file,
                            "type":material?.type,
                            "size":material?.size,
                            "title":material?.title
                        });
                    })
                });
            })
        };
        const saved=await saveDraftCourse(data);
        if(saved){
            Toast.show({
                type:'success',
                text1:'Draft course saved successfully'
            });
            router.replace("/(teacher)/(Library)/(Courses)");
        }
        clearCourseAndSectionData();
    }

    return(
        <View className="flex-col gap-6 px-4">
            {/*  */}
            <View className="flex-row items-center justify-between">
                <View className="flex-col ">
                    <Text className="text-primary text-xl tracking-wider">
                        COURSE BUILDER
                    </Text>
                    <Text className="text-text-strong text-2xl font-bold">
                        Create New Course
                    </Text>
                </View>
                <View className="flex-col items-center gap-1">
                    <Pressable
                        onPress={handleSaveDraft}
                        disabled={isSavingDraft}
                        className="flex-row items-center gap-2 rounded-lg bg-bg-2 px-2 py-2 border border-border active:scale-95 active:opacity-80 transition-all duration-200"
                    >
                        {isSavingDraft?(
                            <>
                                <ActivityIndicator size="small" color={strongColor} />
                                <Text className="text-text-strong text-base font-bold">
                                    Saving...
                                </Text>
                            </>
                        ):(
                            <>
                                <Ionicons name="save-outline" size={15} color={strongColor} />
                                <Text className="text-text-strong text-base font-bold">
                                    Save Draft
                                </Text>
                            </>
                        )}
                    </Pressable>
                    <Pressable
                        className="flex-row items-center gap-2 rounded-lg bg-bg-2 px-4 py-2 border border-border active:scale-95 active:opacity-80 transition-all duration-200"
                        onPress={handleDiscard}
                    >
                        <Ionicons name="close" size={15} color={strongColor} />
                        <Text className="text-text-strong text-base font-bold">
                            Discard
                        </Text>
                    </Pressable>
                </View>
            </View>
            <CreateCourseProgressBar
                stepProgress={stepProgress}
            />
            {/* buttons */}
            <View className="flex-row items-center justify-center  w-full px-4 gap-2">
                <Pressable 
                    onPress={handlePreviousStep}
                    disabled={true}
                    className={`${true ? "opacity-50 cursor-not-allowed" : "active:scale-95 active:opacity-80 bg-bg-2"} flex-row items-center justify-center gap-2 w-1/2 p-2 border border-border rounded-xl transition-all duration-200`}
                >
                    <Ionicons name="chevron-back" size={15} color={strongColor} />
                    <Text className="text-text-strong text-sm font-semibold">Previous</Text>
                </Pressable>
                <Pressable 
                    onPress={handleNextStep}
                    disabled={false}
                    className={`${false ? "opacity-50 cursor-not-allowed" : "active:scale-95 active:opacity-80 bg-primary"} flex-row items-center justify-center gap-2 w-1/2 p-2 border border-border rounded-xl transition-all duration-200`}
                >
                    <Text className="text-text-strong text-sm font-semibold">Next</Text>
                    <Ionicons name="chevron-forward" size={15} color={strongColor} />
                </Pressable>
            </View>
            {/* content */}
            <ScrollView
                    className="w-full"
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 350 }}
                    showsVerticalScrollIndicator={false}
            >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                    <View className="w-full flex-col items-center gap-6">
                        {/* General info */}
                        <View className="flex-col gap-4 w-full mt-6 bg-bg-2 rounded-lg p-6 border border-border">
                            <View className="flex-row items-center gap-2">
                                <FontAwesome5 name="book-reader" size={20} color={strongColor} />
                                <Text className={`text-text-strong font-semibold`}>General Info</Text>
                            </View>
                            <View className="flex-col gap-4">
                                <View className="w-full flex-col gap-2">
                                    <Text className="text-text-weak">Course Title</Text>
                                    <Input
                                        placeholder="Enter course title"
                                        value={courseData?.title}
                                        onChangeText={(text)=>setCourseData({...courseData,title:text})}
                                        placeholderTextColor={isDark ? "#94a3b8" : "#475569"}
                                        className="w-full rounded-2xl bg-bg-2 p-2 border border-border "
                                    />
                                </View>
                                {/* category */}
                                <View className="w-full flex-col gap-2">
                                    <Text className="text-text-weak">Category</Text>
                                    <DropDownPicker    
                                        open={openCategoryPicker}
                                        setOpen={setOpenCategoryPicker}
                                        items={categoriesItems}
                                        value={selectedCategory}
                                        setValue={(callback) => {
                                            const newValue =
                                            typeof callback === "function"
                                                ? callback(selectedCategory)
                                                : callback;

                                            setSelectedCategory(newValue);
                                        }}
                                        listMode="SCROLLVIEW"
                                        style={{
                                            marginBottom:10,
                                            paddingVertical:8,
                                            paddingHorizontal:12,
                                            borderRadius:12,
                                            borderWidth:1,
                                            borderColor:borderColor,
                                            backgroundColor:isDark?"#1e293b": "#f0f9ff",
                                        }}
                                        textStyle={{
                                            color:isDark ? "#fff" : "#1e293b",
                                        }}
                                        dropDownContainerStyle={{
                                            backgroundColor:isDark ? "#1e293b" : "#fff",
                                            borderColor:borderColor,
                                        }}
                                    />
                                </View>
                                {/* language */}
                                <View className="w-full flex-col gap-2">
                                    <Text className="text-text-weak">Language</Text>
                                    <DropDownPicker    
                                        open={openLanguagePicker}
                                        setOpen={setOpenLanguagePicker}
                                        items={languagesItems}
                                        value={selectedLanguage}
                                        setValue={(callback) => {
                                            const newValue =
                                            typeof callback === "function"
                                                ? callback(selectedLanguage)
                                                : callback;

                                            setSelectedLanguage(newValue);
                                        }}
                                        listMode="SCROLLVIEW"
                                        style={{
                                            marginBottom:10,
                                            paddingVertical:8,
                                            paddingHorizontal:12,
                                            borderRadius:12,
                                            borderWidth:1,
                                            borderColor:borderColor,
                                            backgroundColor:isDark?"#1e293b": "#f0f9ff",
                                            zIndex:10,
                                        }}
                                        textStyle={{
                                            color:isDark ? "#fff" : "#1e293b",
                                        }}
                                        dropDownContainerStyle={{
                                            backgroundColor:isDark ? "#1e293b" : "#fff",
                                            borderColor:borderColor
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        {/* description */}
                        <View className="flex-col gap-4 w-full bg-bg-2 rounded-lg p-6 border border-border">
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="information-circle-outline" size={20} color={strongColor} />
                                <Text className={`text-text-strong font-semibold`}>Description</Text>
                            </View>
                            <View className="w-full flex-col gap-2">
                                <Input
                                    multiline={true}
                                    numberOfLines={10}
                                    value={courseData?.description}
                                    onChangeText={(text)=>setCourseData({...courseData,description:text})}
                                    placeholderTextColor={isDark ? "#94a3b8" : "#475569"}
                                    placeholder="Enter course description"
                                    className="w-full rounded-2xl bg-bg-2 p-2 border border-border"
                                />
                            </View>
                        </View>
                        
                        {/* Course thumbnail */}
                        <View className="flex-col gap-4 w-full bg-bg-2 rounded-lg p-6 border border-border">
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="image-outline" size={20} color={strongColor} />
                                <Text className={`text-text-strong font-semibold`}>Course thumbnail</Text>
                            </View>
                            <View className="w-full h-48 flex-col gap-2 items-center justify-center rounded-xl border-2 border-dashed border-border bg-bg-1">
                                {!courseData.thumbnail && !imagePreview &&(
                                    <TouchableOpacity onPress={uploadThumbnail} className="w-full h-full flex items-center justify-center gap-2">
                                        <Ionicons name="cloud-upload-outline" size={25} color={strongColor} />
                                        <Text className={`text-text-weak font-semibold text-xl`}>Upload thumbnail</Text>
                                    </TouchableOpacity>
                                )}
                                {imagePreview && (
                                    <TouchableOpacity onPress={uploadThumbnail} className="w-full h-full flex items-center justify-center">
                                        <Image source={{uri:imagePreview}} className="w-full h-full object-cover rounded-lg" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
}