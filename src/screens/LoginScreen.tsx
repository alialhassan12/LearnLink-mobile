import { router } from "expo-router";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, View,Image, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../components/Input";
import Toast from "react-native-toast-message";
import useAuthStore from "../store/authStore";


export default function LoginScreen(){
    const {login,isloggingIn,authUser}=useAuthStore();
    const [showPassword,setShowPassword]=useState<boolean>(false);
    const [formData,setFormData]=useState<{
        email:string,
        password:string
    }>({
        email:"",
        password:""
    });

    const [error,setError]=useState<{email?:string,password?:string}>({
        email:"",
        password:""
    });

    const handleLogin = async() => {
        // if(error.email?.trim() === '' || error.password?.trim() === ''){
        //     setError({
        //         email:formData.email?.trim() === '' ? 'Email is required' : '',
        //         password:formData.password?.trim() === '' ? 'Password is required' : ''
        //     });
        //     return;
        // }
        // if(!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        // {
        //     setError({email:'Please enter a valid email'});
        //     return;
        // }
        // if(formData.password.length <8){
        //     setError({password:'Password must be at least 8 characters long'});
        //     return;
        // }
        // setError({email:"",password:""});
        
        const success=await login(formData);
        if(success){
            const user = useAuthStore.getState().authUser;
            if(user?.role === 'student'){
                router.replace('/(student)/Home');
            }
        }
    }

    return (
        <SafeAreaView className="flex-1 items-center justify-center w-full" edges={["right","left","top","bottom"]}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
            >
                <ScrollView 
                    className="px-5" 
                    contentContainerStyle={{flexGrow:1}}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false} 
                >
                    <View className="items-center gap-4">
                        <Image className="w-[300px] h-[300px] rounded-lg" source={require("../../assets/images/authImage.png")} />
                    </View>
                    <View className="flex flex-col items-center justify-center gap-2 mt-4 ">
                        <Text className="font-bold text-3xl text-text-strong">Welcome Back 👋</Text>
                        <Text className="text-base  text-center text-text-weak ">
                            Continue your learning journey and connect with expert teachers.
                            Or Continue your teaching journey and help students grow.
                        </Text>
                    </View>
                    {/* form */}
                    <View className="flex flex-col gap-2 mt-5 justify-start items-start">
                        <Text className="font-semibold text-text-weak text-sm">Email Address</Text>
                        <Input 
                            placeholder="JohnDoe@example.com" 
                            placeholderTextColor={"#666"} 
                            keyboardType="email-address"
                            value={formData.email}
                            disabled={isloggingIn}
                            onChangeText={(text)=>setFormData({...formData,email:text})}
                            className={error.email ? "border border-red-500" : ""}
                        />
                        {error.email && (
                            <Text className="text-red-500 text-sm">{error.email}</Text>
                        )}
                        <Text className="font-semibold text-text-weak text-sm">Password</Text>
                        <View className="relative w-full">
                            <Input 
                                placeholder="••••••••••••••••" 
                                placeholderTextColor={"#666"} 
                                secureTextEntry={!showPassword}
                                value={formData.password}
                                disabled={isloggingIn}
                                onChangeText={(text)=>setFormData({...formData,password:text})}
                                className={error.password ? "border border-red-500" : ""}
                            />
                            <Pressable className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" onPress={()=>setShowPassword(!showPassword)}>
                                {showPassword ? <Ionicons name="eye-off" size={24} color={"#666"}/> : <Ionicons name="eye" size={24} color={"#666"}/>}
                            </Pressable>
                        </View>
                        {error.password && (
                            <Text className="text-red-500 text-sm">{error.password}</Text>
                        )}
                        <Pressable  
                            onPress={handleLogin} 
                            disabled={isloggingIn}
                            className="w-full bg-primary active:bg-blue-800/70 transition-all duration-100 rounded-2xl py-3 mt-4"
                        >   
                            {
                                isloggingIn?(
                                    <View className="flex flex-row justify-center items-center gap-2">
                                        <ActivityIndicator size="small" className="text-gray-300" />
                                        <Text className="text-gray-300 text-center font-semibold text-lg">Logging in...</Text>
                                    </View>
                                ):(
                                    <Text className="text-white text-center font-semibold text-lg">Login</Text>
                                )
                            }
                        </Pressable>

                        <View className="flex flex-row items-center justify-center gap-2 mt-2 w-full">
                            <Text className="text-text-weak text-sm">Don't have an account?</Text>
                            <Pressable className="cursor-pointer" onPress={()=>router.push('/Register')}>
                                <Text className="text-primary font-semibold text-sm">Register</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}