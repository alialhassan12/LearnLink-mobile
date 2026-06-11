import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Button, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RoleSelector, { Role } from "../components/RoleSelector";
import Input from "../components/Input";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../store/authStore";

export default function RegisterScreen(){
    const {register,isRegistering,authUser}=useAuthStore();
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const [formData,setFormData]=useState<{
        name:string,
        email:string,
        password:"",
        password_confirmation:""
    }>({
        name:"",
        email:"",
        password:"",
        password_confirmation:""
    });

    const[error,setError]=useState<{
        name?:string;
        email?:string;
        password?:string;
        password_confirmation?:string;
        role?:string;
    }>({
        name:'',
        email:'',
        password:'',
        password_confirmation:'',
        role:''
    });

    const [hasError,setHasError]=useState<{
        name?:boolean;
        email?:boolean;
        password?:boolean;
        password_confirmation?:boolean;
    }>({
        name:false,
        email:false,
        password:false,
        password_confirmation:false,
    });

    const handleRegister=async()=>{
        if(formData.email.trim()=== '' || formData.password.trim()=== '' || formData.name.trim()=== '' || formData.password_confirmation.trim()=== '')
        {
            setError({
                name:formData.name.trim()=== '' ? 'Required field' : '',
                email:formData.email.trim()=== '' ? 'Required field' : '',
                password:formData.password.trim()=== '' ? 'Required field' : '',
                password_confirmation:formData.password_confirmation.trim()=== '' ? 'Required field' : ''
            });
            setHasError({
                name:formData.name.trim()=== '' ? true : false,
                email:formData.email.trim()=== '' ? true : false,
                password:formData.password.trim()=== '' ? true : false,
                password_confirmation:formData.password_confirmation.trim()=== '' ? true : false
            });
            return;
        }
        if(!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        {
            setError({email:'Please enter a valid email'});
            setHasError({name:false,email:true,password:false,password_confirmation:false});
            return;
        }
        if(formData.password.length <8){
            setError({password:'Password must be at least 8 characters long'});
            setHasError({name:false,email:false,password:true,password_confirmation:false});
            return;
        }
        if(formData.password !== formData.password_confirmation){
            setError({
                password_confirmation:'Passwords do not match',
                password:'Passwords do not match'
            });
            setHasError({
                name:false,
                email:false,
                password:true,
                password_confirmation:true
            });
            return;
        }

        
        if(!selectedRole){
            setError({role:'Please select a role'});
            setHasError({name:false,email:false,password:false,password_confirmation:false});
            return;
        }
        setError({name:'',email:'',role:'',password:'',password_confirmation:''});
        setHasError({name:false,email:false,password:false,password_confirmation:false});
        
        const success=await register({...formData,role:selectedRole});

        if(success){
            const user = useAuthStore.getState().authUser;
            if(user?.role==='student') {
                router.replace('/(student)/Home');
            }
        }
    }

    return(
        <SafeAreaView className="flex-1 items-center justify-center w-full" edges={["bottom","top"]}>
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
                        <Text className="font-bold text-3xl">Create Your Account</Text>
                        <Text className="text-base  text-center text-neutral-500 ">
                            Join LearnLink as a student or teacher and start your educational journey.
                        </Text>
                    </View>

                    <Text className="font-semibold text-black/80 text-sm mt-2">I want to...</Text>
                    {/* Role Selection Cards */}
                    <RoleSelector 
                        selectedRole={selectedRole} 
                        onSelectRole={setSelectedRole} 
                    />
                    {error.role && (
                        <Text className="text-red-500 text-sm">{error.role}</Text>
                    )}

                    {/* form */}
                    <View className="flex flex-col gap-2 mt-5 justify-start items-start">
                        {/* name field */}
                        <Text className="font-semibold text-black/80 text-sm">Full Name</Text>
                        <View className="relative w-full">
                            <Input 
                                placeholder="John Doe"
                                value={formData.name}
                                onChangeText={(text)=>setFormData({...formData,name:text})}
                                placeholderTextColor={"#666"}
                                disabled={isRegistering}
                                className={hasError.name ?"border border-red-500" : ""} 
                            />
                            <Ionicons name="person" size={20} color={"#666"} className="absolute right-3 top-1/2 -translate-y-1/2"/>
                        </View>
                        {error.name && (
                            <Text className="text-red-500 text-sm">{error.name}</Text>
                        )}
                        {/* email field */}
                        <Text className="font-semibold text-black/80 text-sm">Email Address</Text>
                        <View className="relative w-full">
                            <Input 
                                value={formData.email}
                                onChangeText={(text)=>setFormData({...formData,email:text})}
                                placeholder="John Doe@example.com" 
                                disabled={isRegistering}
                                placeholderTextColor={"#666"} 
                                className={hasError.email ?"border border-red-500" : ""}
                            />
                            <Ionicons name="mail" size={20} color={"#666"} className="absolute right-3 top-1/2 -translate-y-1/2"/>
                        </View>
                        {error.email && (
                            <Text className="text-red-500 text-sm">{error.email}</Text>
                        )}
                        {/* password field */}
                        <Text className="font-semibold text-black/80 text-sm">Password</Text>
                        <View className="relative w-full">
                            <Input 
                                value={formData.password}
                                onChangeText={(text)=>setFormData({...formData,password:text})}
                                placeholder="••••••••••••••••" 
                                placeholderTextColor={"#666"}
                                secureTextEntry={!showPassword}
                                disabled={isRegistering}
                                className={hasError.password ?"border border-red-500" : ""}
                            />
                            <Pressable className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" onPress={()=>setShowPassword(!showPassword)}>
                                {showPassword ? <Ionicons name="eye-off" size={24} color={"#666"}/> : <Ionicons name="eye" size={24} color={"#666"}/>}
                            </Pressable>
                        </View>
                        {error.password && (
                            <Text className="text-red-500 text-sm">{error.password}</Text>
                        )}
                        {/* passord confirmation field */}
                        <Text className="font-semibold text-black/80 text-sm">Confirm Password</Text>
                        <View className="relative w-full">
                            <Input 
                                value={formData.password_confirmation}
                                onChangeText={(text)=>setFormData({...formData,password_confirmation:text})}
                                placeholder="••••••••••••••••" 
                                placeholderTextColor={"#666"}
                                disabled={isRegistering}
                                className={hasError.password_confirmation ?"border border-red-500" : ""}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <Pressable className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" onPress={()=>setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <Ionicons name="eye-off" size={24} color={"#666"}/> : <Ionicons name="eye" size={24} color={"#666"}/>}
                            </Pressable>
                        </View>
                        {error.password_confirmation && (
                            <Text className="text-red-500 text-sm">{error.password_confirmation}</Text>
                        )}
                        <Pressable  
                            onPress={handleRegister} 
                            className={isRegistering ? "w-full bg-blue-400/50 active:bg-blue-400/50 transition-all duration-100 rounded-2xl py-3" : "w-full bg-blue-400 active:bg-blue-400/70 transition-all duration-100 rounded-2xl py-3"}
                            disabled={isRegistering}
                        >   
                            {
                                isRegistering ? <ActivityIndicator size="small" color="#fff" /> 
                                :
                                <Text className="text-white text-center font-semibold text-lg">Register</Text>
                            }
                        </Pressable>
                        <View className="flex flex-row items-center justify-center gap-2 mt-2 w-full mb-10">
                            <Text className="text-black/80 text-sm">Already have an account?</Text>
                            <Pressable className="cursor-pointer" onPress={()=>router.replace('/Login')}>
                                <Text className="text-blue-400 font-semibold text-sm">Login</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
