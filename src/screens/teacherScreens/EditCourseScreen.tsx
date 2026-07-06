import { Course } from "@/src/@types/course";
import { CourseSection } from "@/src/@types/course_sections";
import Input from "@/src/components/Input";
import { useTheme } from "@/src/providers/ThemeProvider";
import useCategoryStore from "@/src/store/categoryStore";
import { useCourseStore } from "@/src/store/courseStore";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { MobileFile } from "@/src/store/chatStore";
import Toast from "react-native-toast-message";
import AddSectionModal from "@/src/components/teacherComponents/AddSectionModal";
import EditCourseSectionCollapsible from "@/src/components/teacherComponents/EditCourseSectionCollapsible";

export default function EditCourseScreen(){
    const {CourseId}=useLocalSearchParams();
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";
    
    const {
        editCourse,
        isEditingCourse,
        courseWithMaterials,
        isGettingCourseWithMaterialsById,
        getCourseWithMaterialsById
    }=useCourseStore();
    const {categories,isGettingCategories,getCategories}=useCategoryStore();
    
    const [openAddSection,setOpenAddSection]=useState<boolean>(false);
    const [newSectionName,setNewSectionName]=useState<string>("");

    const [openCategoryPicker,setOpenCategoryPicker]=useState<boolean>(false);
    const [selectedCategoryValue,setSelectedCategoryValue]=useState<number|null>(null);
    const categoryItems=categories.map((category)=>{
        return{
            label:category.title,
            value:category.id
        }
    });

    const [formData,setFormData]=useState<Course|null>(null);

    useEffect(()=>{
        getCategories();
        getCourseWithMaterialsById(Number(CourseId));
        if(CourseId){
            const course=courseWithMaterials;
            setFormData({
                course_id:course?.id,
                teacher_id:course?.teacher_id,
                category_id:course?.category_id!,
                title:course?.title!,
                description:course?.description!,
                thumbnail:course?.thumbnail!,
                thumbnail_url:course?.thumbnail_url!,
                language:course?.language!,
                price:course?.price as number,
                sections:course?.sections as CourseSection[],
            });
            setSelectedCategoryValue(course?.category_id!);
        }
    },[CourseId]);

    // sync category picker with form data
    useEffect(()=>{
        if(selectedCategoryValue){
            setFormData({...formData!,category_id:selectedCategoryValue});
        }
    },[selectedCategoryValue]);

    const handleUploadThumbnail=async()=>{
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Toast.show({
                type: 'error',
                text1: 'Permission to access media library is required!'
            });
            return;
        }

        const result=await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing:true,
            quality:1
        });
        if(!result.canceled){
            const asset=result.assets?.[0];
            setFormData({
                ...formData!,
                thumbnail_url:asset.uri || "",
                thumbnail:{
                    uri:asset.uri || "",
                    name:asset?.fileName || `thumbnail.${asset?.uri?.split('.').pop()}` || "",
                    type:asset?.mimeType || 'image/jpeg',
                    size:asset?.fileSize || 0
                }
            });
        }
    }

    const handleAddMaterial=async(sectionId:number)=>{
        const result=await DocumentPicker.getDocumentAsync({
            type:'*/*',
            copyToCacheDirectory:true
        });
        if(result.canceled){
            return null;
        }
        const file=result.assets[0];
        const mobileFile:MobileFile={
            uri:file.uri,
            type:file.mimeType || "application/octet-stream",
            name:file.name || "file",
            size:file.size || 0
        };
        setFormData((prev)=>{
            if(!prev) return null;
            return{
                ...prev,
                sections:prev.sections?.map((s)=>{
                    if(s.id!==sectionId) return s;

                    return{
                        ...s,
                        materials:[...(s.materials || []),{
                            id:-(s.materials?.length!+1),
                            file:mobileFile,
                            title:file.name,
                            type:file.mimeType?.startsWith("video/")?"video":file.mimeType?.startsWith("image/")?"image":"document",
                            size:file.size || 0,
                        }]
                    }
                })
            }
        })
    }

    const handleDeleteMaterial=(sectionId:number,materialId:number)=>{
        setFormData((prev)=>{
            if(!prev) return null;
            return{
                ...prev,
                sections:prev.sections?.map((s)=>{
                    if(s.id !== sectionId) return s;
                    return{
                        ...s,
                        materials:s.materials?.filter((m)=>m.id !==materialId)
                    }
                })
            }
        })
    }

    const handleAddSection=()=>{
        if(newSectionName.trim() === "") return;
        
        setFormData((prev)=>{
            if(!prev) return null;
            return{
                ...prev,

                sections:[...(prev.sections || []),{
                    id:-(prev?.sections?.length!+1),
                    title:newSectionName.trim(),
                    order:prev.sections ? prev.sections.length + 1 : 1,
                    materials:[]
                }]
            }
        });
    }

    const handleDeleteSection=(sectionId:number)=>{
        setFormData((prev)=>{
            if(!prev) return null;
            return{
                ...prev,
                sections:prev.sections?.filter((s)=>s.id !==sectionId)
            }
        })
    }
    const handleEdit=async ()=>{
        if(!formData?.course_id) return;
        const success=await editCourse(formData.course_id,formData);
        if(success){
            router.back();
        }
    }

    if(isGettingCategories || isGettingCourseWithMaterialsById || !formData){
        return <EditCourseSkeleton />
    }

    return(
        <View className="flex-1 bg-bg-1">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-border bg-bg-2">
                <View className="flex-row items-center justify-center gap-2">
                    <TouchableOpacity onPress={() => router.back()} className="p-1 active:opacity-70">
                        <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#1e293b"} />
                    </TouchableOpacity>
                    <Text className="text-text-strong text-lg font-bold">Edit Course</Text>
                </View>
                <View className="flex-row items-center justify-center gap-2">
                    <TouchableOpacity 
                        onPress={handleEdit} 
                        className="p-1 active:opacity-70"
                        disabled={isEditingCourse}
                    >
                        {isEditingCourse ? 
                            <ActivityIndicator color={primaryColor} /> 
                            : 
                            <Ionicons name="save" size={24} color={primaryColor} />
                        }
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                className="flex-1 px-2 mt-4"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-col gap-4 w-full bg-bg-2 border border-border rounded-xl p-4 shadow-md">
                    <View className="flex-row items-center gap-2">
                        <View className="p-2 flex justify-center bg-primary rounded-full items-center">
                            <Ionicons name="information-circle-outline" size={24} color={isDark ? "#fff" : "#1e293b"} />
                        </View>
                        <View className="flex-col ">
                            <Text className="text-text-strong text-lg font-bold">Basic Information</Text>
                            <Text className="text-text-weak text-xs">The core details of your course that students see first.</Text>
                        </View>
                    </View>
                    {/* fields */}
                    <View className="flex-col gap-2">
                        {/* Course title */}
                        <View className="flex-col ">
                            <Text className="text-text-weak text-sm font-semibold">Course Title</Text>
                            <Input
                                value={formData?.title}
                                onChangeText={(text)=>setFormData({...formData!,title:text})}
                                placeholder="e.g.,Mastering React Native"
                                placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                                keyboardType="default"
                                className="mt-1 rounded-lg focus:border-primary "
                            />
                        </View>
                        {/* Description title */}
                        <View className="flex-col ">
                            <Text className="text-text-weak text-sm font-semibold">Description</Text>
                            <Input
                                value={formData?.description}
                                onChangeText={(text)=>setFormData({...formData!,description:text})}
                                placeholder="Enter a detailed description for your course"
                                placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                                keyboardType="default"
                                className="mt-1 rounded-lg focus:border-primary "
                                multiline
                                numberOfLines={11}
                            />
                        </View>
                        {/* Category */}
                        <View className="flex-col">
                            <Text className="text-text-weak text-sm font-semibold">Category</Text>
                            <DropDownPicker
                                open={openCategoryPicker}
                                setOpen={setOpenCategoryPicker}
                                items={categoryItems}
                                value={selectedCategoryValue}
                                setValue={setSelectedCategoryValue}
                                listMode="SCROLLVIEW"
                                style={{
                                    marginBottom:10,
                                    marginTop:5,
                                    paddingVertical:8,
                                    paddingHorizontal:12,
                                    borderRadius:12,
                                    borderWidth:1,
                                    borderColor:isDark?"#64748b":"#94a3b8",
                                    backgroundColor:isDark?"#1e293b":"#fff",
                                }}
                                textStyle={{
                                    color:isDark ? "#fff" : "#1e293b",
                                }}
                                dropDownContainerStyle={{
                                    backgroundColor:isDark ? "#1e293b" : "#fff",
                                    borderColor:isDark?"#64748b":"#94a3b8",
                                }}
                            />
                        </View>
                        {/* price */}
                        <View className="flex-col ">
                            <Text className="text-text-weak text-sm font-semibold">Price</Text>
                            <View className="relative ">
                                <Input
                                    value={formData?.price}
                                    onChangeText={(text)=>setFormData({...formData!,price:Number(text)})}
                                    placeholder="Enter a price for your course"
                                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                                    keyboardType="numeric"
                                    className="mt-1 rounded-lg focus:border-primary"
                                />
                                <View className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <FontAwesome5 name="dollar-sign" size={20} color={primaryColor} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* thumbnail */}
                <View className="flex-col gap-4 w-full bg-bg-2 border border-border rounded-xl p-4 shadow-md mt-4">
                    <View className="flex-row items-center gap-2 w-full">
                        <View className="p-2 flex justify-center bg-primary rounded-full items-center">
                            <Ionicons name="image-outline" size={24} color={isDark ? "#fff" : "#1e293b"} />
                        </View>
                        <View className="flex-col ">
                            <Text className="text-text-strong text-lg font-bold">Thumbnail</Text>
                            <Text className="text-text-weak text-xs">The thumbnail of your course that students see first.</Text>
                        </View>
                    </View>
                    {/* thumbnail image */}
                    <View className="justify-center items-center w-full bg-bg-2">
                        {formData?.thumbnail_url ? (
                            <>
                                <View className="justify-center items-center w-full border-2 border-dashed border-border rounded-lg h-48 overflow-hidden">
                                    <Image 
                                        source={{ uri: formData?.thumbnail_url }}
                                        className="w-full h-full"
                                    />
                                </View>
                                <Pressable
                                    onPress={handleUploadThumbnail}
                                    className="w-full mt-2 bg-primary rounded-xl py-3 flex flex-row items-center justify-center gap-2 active:opacity-80 transition-all duration-300"
                                >
                                    {isEditingCourse ? (
                                        <ActivityIndicator color={isDark ? "#fff" : "#1e293b"} size="small" />
                                    ) : (
                                        <>
                                            <FontAwesome5 name="cloud-upload-alt" size={20} color={isDark ? "#fff" : "#1e293b"} />
                                            <Text className="text-text-strong font-semibold">Upload New Thumbnail</Text>
                                        </>
                                    )}
                                </Pressable>
                            </>
                        ):(
                            <View className="justify-center p-2 items-center w-full border-2 border-dashed border-border rounded-lg h-48">
                                <Ionicons name="image-outline" size={48} color={isDark ? "#fff" : "#1e293b"} />
                                <Text className="text-text-weak text-sm mt-2">No thumbnail selected</Text>
                                <Pressable
                                    onPress={handleUploadThumbnail}
                                    className="w-full mt-2 bg-primary rounded-xl py-3 flex flex-row items-center justify-center gap-2 active:opacity-80 transition-all duration-300"
                                >
                                    <Ionicons name="image-outline" size={18} color="white" />
                                    <Text className="text-white font-bold text-base">Select Thumbnail</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>
                {/* sections */}
                <View className="flex-col gap-4 w-full bg-bg-2 border border-border rounded-xl p-4 shadow-md mt-4">
                    <View className="flex-row items-center gap-2 w-full">
                        <View className="p-2 flex justify-center bg-primary rounded-full items-center">
                            <Ionicons name="list-outline" size={24} color={isDark ? "#fff" : "#1e293b"} />
                        </View>
                        <View className="flex-col ">
                            <Text className="text-text-strong text-lg font-bold">Course Sections</Text>
                            <Text className="text-text-weak text-xs">Structure your course into sections and lessons.</Text>
                        </View>
                    </View>
                    <Pressable
                        onPress={()=>setOpenAddSection(true)}
                        className="w-full mt-2 bg-primary rounded-xl py-3 flex flex-row items-center justify-center gap-2 active:opacity-80 transition-all duration-300"
                    >
                        <Ionicons name="add" size={18} color="white" />
                        <Text className="text-white font-bold text-base">Add Section</Text>
                    </Pressable>
                    {formData?.sections?.length === 0 ? (
                        <Text className="text-text-weak text-sm text-center">No sections added yet.</Text>
                    ) : (
                        formData?.sections?.map((section,index)=>(
                            <EditCourseSectionCollapsible 
                                key={index} 
                                section={section}
                                onAddMaterial={handleAddMaterial}
                                onDeleteMaterial={handleDeleteMaterial}
                            />
                        ))
                    )}
                </View>

            </ScrollView>

            <AddSectionModal
                open={openAddSection}
                setOpen={setOpenAddSection}
                sectionName={newSectionName}
                setSectionName={setNewSectionName}
                onAdd={handleAddSection}
            />

        </View>
    );
}


const EditCourseSkeleton=()=>{
    return(
        <ActivityIndicator 
            className="flex-1 justify-center items-center"
            size="large"
        />
    );
}