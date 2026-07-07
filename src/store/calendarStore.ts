import {create} from "zustand";
import axiosInstance from "../lib/axios";
import type { Booking } from "../@types/booking";
import Toast from "react-native-toast-message";

interface CalendarState{
    teacherEvents:Booking[];
    isGettingTeacherEvents:boolean;
    getTeacherEvents:()=>Promise<void>;
}

export const useCalendarStore=create<CalendarState>((set)=>({
    teacherEvents:[],
    isGettingTeacherEvents:false,
    getTeacherEvents:async()=>{
        try {
            set({isGettingTeacherEvents:true});
            const response=await axiosInstance.get('/calendar/get-events');
            set({teacherEvents:response.data.events});
        } catch (error:any) {
            console.log(error?.response?.data?.message);
            Toast.show({
                type:"error",
                text1:"Failed to fetch events"
            });
        }finally{
            set({isGettingTeacherEvents:false});
        }
    }
}));