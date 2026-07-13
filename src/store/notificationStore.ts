import axiosInstance from "@/lib/axios";
import {create} from "zustand";
import type { Notification } from "@/@types/notification";
import Toast from "react-native-toast-message";

interface NotificationStoreState{
    notifications:Notification[];

    isGettingNotifications:boolean;
    getNotifications:()=>Promise<void>;
}

export const useNotificationStore=create<NotificationStoreState>((set)=>({
    notifications:[],

    isGettingNotifications:false,
    getNotifications:async()=>{
        set({isGettingNotifications:true});
        try{
            const response=await axiosInstance.get('/notifications/history');
            set({notifications:response.data.notifications});
        }catch(error:any){
            console.log(error?.response?.data?.message);
            Toast.show({
                type:'error',
                text1:error?.response?.data?.message,
            });
        }finally{
            set({isGettingNotifications:false});
        }
    }
}));