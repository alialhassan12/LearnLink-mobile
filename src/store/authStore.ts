import {create} from "zustand";
import { user } from "../@types/user";
import axiosInstance from "../lib/axios";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

interface useAuthStoreInterface{
    authUser:user |null,
    setAuthUser:(user:user)=>void,
    login:({email,password}: {email:string,password:string})=>Promise<boolean>,
    isloggingIn:boolean,
    checkAuth:()=>Promise<boolean>,
    isCheckingAuth:boolean,
    isLoggingout:boolean,
    logout:()=>Promise<boolean>,
    isRegistering:boolean,
    register:({name,email,password,password_confirmation,role}: {name:string,email:string,password:string,password_confirmation:string,role:string})=>Promise<boolean>,
}

const useAuthStore=create<useAuthStoreInterface>((set)=>({
    authUser:null,
    setAuthUser:(user:user)=>set({authUser:user}),
    
    isloggingIn:false,
    login:async({email,password}: {email:string,password:string})=>{
        set({isloggingIn:true});
        try {
            const response=await axiosInstance.post('/auth/login',{email,password});
            await SecureStore.setItemAsync('token',response.data.token);
            set({authUser:response.data.user});
            Toast.show({
                type:'success',
                text1:response.data.message,
                position:"bottom",
                autoHide:true,
                visibilityTime:2000,
            });
            return true;
        } catch (error:any) {
            Toast.show({
                type:'error',
                text1:error.response.data.message,
                position:"bottom",
                autoHide:true,
                visibilityTime:2000,
            });
            return false;
        }finally{
            set({isloggingIn:false});
        }
    },

    isCheckingAuth:false,
    checkAuth:async()=>{
        set({isCheckingAuth:true});

        if(!await SecureStore.getItemAsync('token')){
            set({authUser:null});
            set({isCheckingAuth:false});
            return false;
        }
        
        try {
            const response=await axiosInstance.get('/auth/me');
            set({authUser:response.data.user});
            return true;
        } catch (error) {
            await SecureStore.deleteItemAsync('token');
            set({authUser:null});
            return false;
        }finally{
            set({isCheckingAuth:false});
        }
    },

    isLoggingout:false,
    logout:async()=>{
        set({isLoggingout:true});
        try{
            await axiosInstance.post('/auth/logout');
            await SecureStore.deleteItemAsync('token');
            set({authUser:null});
            Toast.show({
                type:'success',
                text1:'Logout successful',
                position:"bottom",
                autoHide:true,
                visibilityTime:2000,
            });
            return true;
        }catch(error:any){
            Toast.show({
                type:'error',
                text1:error.response.data.message,
                position:"bottom",
                autoHide:true,
                visibilityTime:2000,
            });
            return false;
        }finally{
            set({isLoggingout:false});
        }
    },

    isRegistering:false,
    register:async({name,email,password,password_confirmation,role}: {name:string,email:string,password:string,password_confirmation:string,role:string})=>{
        set({isRegistering:true});
        try{
            const response=await axiosInstance.post('/auth/register',{name,email,password,password_confirmation,role});
            await SecureStore.setItemAsync('token',response.data.token);
            set({authUser:response.data.user});
            Toast.show({
                type:'success',
                text1:response.data.message,
                position:"bottom",
                autoHide:true,
                visibilityTime:2000,
            });
            return true;
        }catch(error:any){
            Toast.show({
                type:'error',
                text1:error.response.data.message,
                position:"bottom",
                autoHide:true,
                visibilityTime:2000,
            });
            return false;
        }finally{
            set({isRegistering:false});
        }
    }
}));

export default useAuthStore;