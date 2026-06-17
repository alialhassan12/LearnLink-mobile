import {create} from "zustand";
import { Course } from "../@types/course";
import axiosInstance from "../lib/axios";
import Toast from "react-native-toast-message";

interface CoursStoreState{
    // student related courses
    course:Course|null;
    isGettingCourse:boolean;
    getCourse:(id:number)=>Promise<void>;
}

export const useCourseStore=create<CoursStoreState>((set)=>({
    
    // student related courses
    course:null,
    isGettingCourse:false,
    getCourse:async(id:number)=>{
        set({isGettingCourse:true});
        try{
            const response=await axiosInstance.get(`/courses/get-course/${id}`);
            set({course:response.data.course});
        }catch(error:any){
            console.log(error);
            Toast.show({
                type:'error',
                text1:error.response?.data?.message || "An error occurred"
            });
        }finally{
            set({isGettingCourse:false});
        }
    }
}));