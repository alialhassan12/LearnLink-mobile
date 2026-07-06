import Input from "@/src/components/Input";
import CreateCourseProgressBar from "@/src/components/teacherComponents/CreateCourseComponents/CreateCourseProgressBar";
import { useTheme } from "@/src/providers/ThemeProvider";
import useAuthStore from "@/src/store/authStore";
import { useCourseStore } from "@/src/store/courseStore";
import { useCreateCourseStore } from "@/src/store/createCourseStore";
import { FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function CreateCourseStep3(){
        const {isDark}=useTheme();
        const primaryColor = isDark ? "#3b82f6" : "#2563eb";
        const strongColor=isDark?"#fff":"#000";
        const borderColor=isDark?"#334155":"#e2e8f0";

        const {
            courseData,
            setCourseData,
            stepProgress,
            setStepProgress,
            clearCourseAndSectionData,
            imagePreview,
            courseSections
        }=useCreateCourseStore();
        const {authUser}=useAuthStore();
        const {saveDraftCourse,isSavingDraft,publishCourse,isPublishing}=useCourseStore();

        const handlePreviousStep=()=>{
            setStepProgress(50);
            router.replace("/(teacher)/(Library)/(Courses)/CreateCourse/Step2");
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

    const handlePublish=async()=>{
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

        const published=await publishCourse(data);
        if(published){
            Toast.show({
                type:'success',
                text1:'Course published successfully'
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
                        disabled={isSavingDraft || isPublishing}
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
                    disabled={true}
                    className={`${true ? "opacity-50 cursor-not-allowed" : "active:scale-95 active:opacity-80 bg-primary"} flex-row items-center justify-center gap-2 w-1/2 p-2 border border-border rounded-xl transition-all duration-200`}
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
                <View className="w-full flex-col items-center gap-6">
                    {/* price */}
                    <View className="flex-col gap-4 w-full bg-bg-2 rounded-lg p-6 border border-border">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="cash-outline" size={20} color={strongColor} />
                            <Text className={`text-text-strong font-semibold`}>Course Fee</Text>
                        </View>
                        <View className="w-full flex-row gap-2 items-center">
                            <View className="w-3/4 flex-col gap-2">
                                <Text className="text-text-strong text-base font-semibold pl-1">Base Price</Text>
                                <Input
                                    keyboardType="numeric"
                                    value={courseData?.price.toString()}
                                    onChangeText={(text)=>setCourseData({...courseData,price:Number(text)})}
                                    placeholderTextColor={isDark ? "#94a3b8" : "#475569"}
                                    placeholder="Enter course price"
                                    className="w-full rounded-2xl bg-bg-2 p-2 border border-border"
                                />
                            </View>
                            <View className="flex-1 flex-col gap-2">
                                <Text className="text-text-strong text-base font-semibold pl-1">Currency</Text>
                                <Input
                                    placeholderTextColor={isDark ? "#94a3b8" : "#475569"}
                                    placeholder="USD"
                                    value={"USD"}
                                    disabled={true}
                                    className="w-full rounded-2xl bg-bg-2 p-2 border border-border opacity-50"
                                />
                            </View>
                        </View>
                        <Pressable
                            onPress={handlePublish}
                            disabled={isPublishing || isSavingDraft}
                            className="flex-row items-center gap-2 justify-center w-full p-2 rounded-lg bg-primary active:scale-95 active:opacity-80 transition-all duration-200"
                        >
                            {isPublishing?(
                                <>
                                    <ActivityIndicator size={20} color={strongColor}/>
                                    <Text className="text-text-strong text-semibold">Publishing...</Text>
                                </>
                            ):(
                                <>
                                    <Ionicons name="cloud-upload-outline" size={20} color={strongColor}/>
                                    <Text className="text-text-strong text-semibold">Publish Course</Text>
                                </>
                            )}
                        </Pressable>
                    </View>
                    {/* Course Preview */}
                    <View className="flex-col gap-4 w-full bg-bg-2 rounded-lg p-6 border border-border">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="eye-outline" size={20} color={strongColor} />
                            <Text className={`text-text-strong font-semibold`}>Course Preview</Text>
                        </View>
                        <View className="w-full flex-col gap-2 overflow-hidden">
                            <Image
                                source={{uri:imagePreview}}
                                className="w-full h-40 "
                            />
                            <Text className="text-sm text-text-strong font-bold">{courseData.title}</Text>
                            <View className="flex-row items-center justify-between">
                                {/* user avatar */}
                                <View className="flex-row gap-2 items-center">
                                    <View className="flex justify-center items-center bg-bg-2 border border-border rounded-full w-12 h-12 overflow-hidden">
                                        {!authUser?.avatar_url &&(
                                            <Text className="text-white flex text-bold">
                                                {authUser?.name?.slice(0,1).toUpperCase()}
                                            </Text>
                                        )}
                                        {authUser?.avatar_url &&(
                                            <Image
                                                source={{uri:authUser.avatar_url}}
                                                className="w-full h-full"
                                            />
                                        )}
                                    </View>
                                    <Text className="text-sm text-text-strong font-bold">{authUser?.name}</Text>
                                </View>
                                <View className="flex-row items-center gap-1">
                                    <FontAwesome6 name="dollar" size={20} color={primaryColor}/>
                                    <Text className="text-primary text-2xl font-bold">{courseData?.price}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}