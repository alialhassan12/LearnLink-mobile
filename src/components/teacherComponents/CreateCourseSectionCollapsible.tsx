import { CourseSection } from "@/src/@types/course_sections";
import { useTheme } from "@/src/providers/ThemeProvider";
import { MobileFile } from "@/src/store/chatStore";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";
import * as DocumentPicker from 'expo-document-picker';
import Toast from "react-native-toast-message";
import { useCreateCourseStore } from "@/src/store/createCourseStore";

export default function CreateCourseSectionCollapsible({
    section,
    onDeleteMaterial
}:{
    section:CourseSection,
    onDeleteMaterial:(sectionTitle:string,materialTitle:string)=>void;
}){
    const [openSection,setOpenSection]=useState<boolean>(false);
    const {isDark}=useTheme();
    const primaryColor = isDark ? "#3b82f6" : "#2563eb";

    const {addFileToSection,removeSection}=useCreateCourseStore();

    const handleAddMaterial=async(sectionTitle:string)=>{
        const result=await DocumentPicker.getDocumentAsync({
            type:'*/*',
            copyToCacheDirectory:true
        });
        if(result.canceled) return;

        const asset=result?.assets[0];
        if(asset){
            const file:MobileFile={
                uri:asset.uri,
                type:asset.mimeType || "application/octet-stream",
                size:asset.size || 0,
                name:asset.name,
            };

            if(sectionTitle){
                addFileToSection(sectionTitle,file,file.name,file.size,file.type);
            }else{
                Toast.show({
                    type:'error',
                    text1:'Failed to add material',
                    text2:"Ensure your adding material to existing section"
                });
            }
        }
    }

    return(
        <View className="flex-col gap-1.5 mt-2">
            <View className="flex-row gap-2 items-center">
                <TouchableOpacity
                    onPress={()=>setOpenSection(!openSection)}
                    activeOpacity={0.8}
                    className="flex-row items-center justify-between flex-1 bg-bg-2 border border-border rounded-xl p-4 shadow-md"
                >
                    <Text className="text-text-strong text-lg font-bold">{section.title}</Text>
                    <View className="flex-row gap-2 items-center">
                        <Ionicons name={openSection ? "chevron-up" : "chevron-down"} size={20} color="#9ca3af" />
                        <TouchableOpacity 
                            className="p-1.5 rounded-lg bg-red-500/10 active:opacity-70"
                            onPress={()=>section.title && removeSection(section.title)}
                        >
                            <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        
            <Collapsible collapsed={!openSection}>
                <View className="bg-bg-1 border border-border rounded-xl p-3 flex-col gap-2">
                    {section.materials && section.materials.length > 0 ? (
                        section.materials.map((material, idx) => (
                            <View key={idx} className="flex-row items-center justify-between bg-bg-2 border border-border rounded-lg p-3">
                                <View className="flex-row items-center gap-3 flex-1">
                                    <View className="p-2 bg-primary/10 rounded-lg">
                                        <Ionicons 
                                            name={
                                                material.type.includes('image') ? "image-outline" :
                                                material.type.includes('video') ? "videocam-outline" :
                                                material.type.includes('pdf') ? "document-text-outline" : "document-outline"
                                            } 
                                            size={20} 
                                            color={primaryColor} 
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-text-strong text-sm font-semibold" numberOfLines={1}>
                                            {material.title}
                                        </Text>
                                        {material.size && (
                                            <Text className="text-text-weak text-xs mt-0.5">
                                                {(material.size / (1024 * 1024)).toFixed(2)} MB
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    className="p-1.5 rounded-lg bg-red-500/10 active:opacity-70"
                                    onPress={()=>section.title && material.title && onDeleteMaterial(section.title,material.title)}
                                >
                                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text className="text-text-weak text-xs text-center py-3">No materials added to this section.</Text>
                    )}

                    <TouchableOpacity
                        onPress={() => section.title && handleAddMaterial(section?.title)}
                        className="flex-row items-center justify-center gap-2 border border-dashed border-primary rounded-xl py-2.5 mt-1 active:opacity-70"
                    >
                        <Ionicons name="add" size={16} color={primaryColor} />
                        <Text className="text-primary font-semibold text-sm">Add Material</Text>
                    </TouchableOpacity>
                </View>
            </Collapsible>
        </View>
    );
}