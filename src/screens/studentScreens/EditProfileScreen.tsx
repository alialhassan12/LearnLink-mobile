import Input from "@/src/components/Input";
import { useStudentStore } from "@/src/store/studentStores/studentStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { MobileFile } from "@/src/store/chatStore";
import useAuthStore from "@/src/store/authStore";

export default function EditProfileScreen() {
    const {setAuthUser,authUser}=useAuthStore();
    const {student,isEditingStudentProfile,editStudentProfile}=useStudentStore();

    const [formData,setFormData]=useState<{
        name:string;
        email:string;
        avatar:MobileFile | null;
        avatar_url:string;
        bio:string,
        headline:string
    }>({
        name:student?.user?.name || "",
        email:student?.user?.email || "",
        avatar:null,
        avatar_url:student?.user?.avatar_url || "",
        bio:student?.bio || "",
        headline:student?.headline || ""
    });

    const uploadAvatar=async()=>{
        const result=await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
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
            })
        }
    }

    const removeAvatar=()=>{
        setFormData({
            ...formData,
            avatar:null,
            avatar_url:""
        })
    }

    const handleEditProfile=async()=>{
        const form=new FormData();
        form.append('name',formData.name);
        form.append('headline',formData.headline);
        form.append('bio',formData.bio);
        if(formData.avatar){
            form.append('avatar',formData.avatar as any);
        }

        const updatedStudent=await editStudentProfile(form);
        if(updatedStudent && authUser){
            setAuthUser({
                ...authUser,
                name:updatedStudent.user?.name || authUser.name,
                avatar_url:updatedStudent.user?.avatar_url || authUser.avatar_url
            });
            router.back();
        }
    }

    return (
        <ScrollView 
            className="w-full" 
            contentContainerStyle={{paddingBottom:100,gap:16}}
            showsVerticalScrollIndicator={false}
        >
            {/* top header */}
            <View className="flex-row items-center px-4 py-3 bg-bg-2 border-b border-border">
                <Pressable 
                    onPress={() => router.back()}
                    className="p-1 rounded-full active:bg-bg-1 mr-3"
                >
                    <Ionicons name="arrow-back" size={24} color="#f8fafc" />
                </Pressable>
                <Text className="text-xl font-bold ml-4 text-text-strong">Edit Profile</Text>
            </View>

            <View className="px-4 space-y-4">
                {/* basic info */}
                <View className="flex flex-col gap-3 bg-bg-2 p-4 rounded-2xl border border-border">
                    <View className="flex flex-row items-center gap-2">
                        <Ionicons name="information-circle-outline" size={24} color="#3b82f6" />
                        <Text className="text-lg font-bold text-text-strong">Basic Information</Text>
                    </View>
                    {/* avatar */}
                    <View className="flex items-center justify-center mt-4">
                        <View className="relative h-32 w-32 bg-bg-1 rounded-full border border-border group">
                            {formData.avatar_url?(
                                <Image source={{uri:formData.avatar_url as string}} className=" rounded-full h-full w-full object-cover"/>
                            ):(
                                <View className="flex-1 justify-center items-center h-full w-full">
                                    <Text className="text-3xl font-bold text-text-weak">{formData.name?.charAt(0).toUpperCase()}</Text>
                                </View>
                            )}
                            {/* upload camera icon */}
                            <Pressable
                                onPress={uploadAvatar}
                                className="absolute bottom-0 right-0 bg-primary p-1 rounded-full"
                            >
                                <Ionicons name="camera" size={20} color="#f8fafc" />
                            </Pressable>
                            {/* remove image button */}
                            {((typeof formData.avatar === 'object' && formData.avatar !==null) || (formData.avatar_url !== ""))&&(
                                <Pressable
                                    onPress={removeAvatar}
                                    className="absolute top-2 -left-2 bg-red-500/20 rounded-full p-1 flex items-center justify-center"
                                >
                                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                                </Pressable>
                            )}
                        </View>
                    </View>
                    {/* name, headline */}
                    <View className="flex flex-col items-start gap-3 mt-4 w-full">
                        <View className="w-full">
                            <Text className="text-text-weak font-semibold text-sm ml-1">Name</Text>
                            <Input
                                className="rounded-lg"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                placeholder="Enter your name"
                            />
                        </View>
                        <View className="w-full">
                            <Text className="text-text-weak font-semibold text-sm ml-1">Headline</Text>
                            <Input
                                className="rounded-lg"
                                value={formData.headline}
                                onChangeText={(text) => setFormData({ ...formData, headline: text })}
                                placeholder="Add headline for your profile"
                            />
                        </View>
                    </View>
                </View>
                {/* bio */}
                <View className="flex flex-col gap-3 bg-bg-2 p-4 rounded-2xl border border-border mt-4">
                    <View className="flex flex-row items-center gap-2">
                        <Ionicons name="book-outline" size={24} color="#3b82f6" />
                        <Text className="text-lg font-bold text-text-strong">About Me</Text>
                    </View>
                    <Input
                        className="rounded-lg h-20"
                        value={formData.bio}
                        onChangeText={(text) => setFormData({ ...formData, bio: text })}
                        placeholder="Add bio for your profile"
                        multiline={true}
                        numberOfLines={4}
                    />
                </View>

                {/* save button */}
                <View className="mt-4">
                    <Pressable 
                        className="flex-row items-center gap-2 justify-center bg-primary py-3 rounded-xl active:opacity-70 active:scale-95 transition-all duration-200"
                        onPress={handleEditProfile}
                        disabled={isEditingStudentProfile}
                    >
                        {isEditingStudentProfile ? (
                            <ActivityIndicator color="#f8fafc" size="small"/>
                        ):(
                            <>
                                <Ionicons name="save-outline" size={20} color="#f8fafc"/>
                                <Text className="text-white font-semibold text-lg">Save</Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}