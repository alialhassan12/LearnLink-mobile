import AddSectionModal from "@/src/components/teacherComponents/AddSectionModal";
import CreateCourseProgressBar from "@/src/components/teacherComponents/CreateCourseComponents/CreateCourseProgressBar";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useCreateCourseStore } from "@/src/store/createCourseStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import CreateCourseSectionCollapsible from "@/src/components/teacherComponents/CreateCourseSectionCollapsible";
import Toast from "react-native-toast-message";
import { MobileFile } from "@/src/store/chatStore";
import { useCourseStore } from "@/src/store/courseStore";

export default function CreateCourseStep2(){
        const {isDark}=useTheme();
        const primaryColor = isDark ? "#3b82f6" : "#2563eb";
        const strongColor=isDark?"#fff":"#000";
        const borderColor=isDark?"#334155":"#e2e8f0";

        const {
            courseData,
            setCourseData,
            courseSections,
            setCourseSections,
            addCourseSection,
            stepProgress,
            setStepProgress,
            clearCourseAndSectionData,
            removeFileFromSection
        }=useCreateCourseStore();

        const {isSavingDraft,saveDraftCourse}=useCourseStore();

        const [openAddSection,setOpenAddSection]=useState<boolean>(false);
        const [newSectionName,setNewSectionName]=useState<string>("");

        const handleNextStep=()=>{
            setStepProgress(100);
            router.replace("/(teacher)/(Library)/(Courses)/CreateCourse/Step3");
        }
        const handlePreviousStep=()=>{
            setStepProgress(10);
            router.replace("/(teacher)/(Library)/(Courses)/CreateCourse/Step1");
        }

        const handleAddNewSection=()=>{
            if(newSectionName.trim()==="") return;
            addCourseSection(newSectionName.trim());
            setNewSectionName("");
            setOpenAddSection(false);
        }

        const handleDeleteMaterial=(sectionTitle:string,materialTitle:string)=>{
            if(!sectionTitle || !materialTitle){
                Toast.show({
                    type:"error",
                    text1:"Error",
                    text2:"Invalid material or section"
                });
                return;
            }
            removeFileFromSection(sectionTitle,materialTitle);
        }

        const handleDiscard=()=>{
            clearCourseAndSectionData();
            router.replace("/(teacher)/(Library)/(Courses)");
        }

            const handleSaveDraft=async()=>{
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
                <View className="flex-col gap-1 items-center">
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
                    className={`${false ? "opacity-100 cursor-not-allowed" : "active:scale-95 active:opacity-80 bg-bg-2"} flex-row items-center justify-center gap-2 w-1/2 p-2 border border-border rounded-xl transition-all duration-200`}
                >
                    <Ionicons name="chevron-back" size={15} color={strongColor} />
                    <Text className="text-text-strong text-sm font-semibold">Previous</Text>
                </Pressable>
                <Pressable 
                    onPress={handleNextStep}
                    className={`${false ? "opacity-50 cursor-not-allowed" : "active:scale-95 active:opacity-80 bg-primary"} flex-row items-center justify-center gap-2 w-1/2 p-2 border border-border rounded-xl transition-all duration-200`}
                >
                    <Text className="text-text-strong text-sm font-semibold">Next</Text>
                    <Ionicons name="chevron-forward" size={15} color={strongColor} />
                </Pressable>
            </View>
            <ScrollView
                className="w-full"
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 350 }}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity 
                    className="flex-row items-center justify-center bg-primary gap-2 w-full p-2 border border-border rounded-xl transition-all duration-200"
                    onPress={()=>setOpenAddSection(true)}
                >
                    <Ionicons name="add-circle-outline" size={20} color={strongColor} />
                    <Text className="text-text-strong text-sm font-semibold">Add Section</Text>
                </TouchableOpacity>
                {/* sections */}
                {courseSections.length === 0 &&(

                    <View style={{minHeight:300}} className="w-full rounded-xl border-2 border-dashed border-border mt-4 flex-col items-center justify-center">
                        <Ionicons name="folder-open-outline" size={40} color={strongColor} />
                        <Text className="text-text-strong text-sm font-semibold">No sections created yet</Text>
                        <Text className="text-text-weak text-xs font-medium">Click &quot;Add Section&quot; to create a new section</Text>
                    </View>
                )}
                {courseSections.length > 0 &&(
                    <View className="mt-4">
                        {courseSections.map((section,index)=>(
                            <CreateCourseSectionCollapsible 
                                key={index} 
                                section={section}
                                onDeleteMaterial={handleDeleteMaterial}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
            
            <AddSectionModal 
                open={openAddSection}
                setOpen={setOpenAddSection}
                sectionName={newSectionName}
                setSectionName={setNewSectionName}
                onAdd={handleAddNewSection}
            />
        </View>
    );
}