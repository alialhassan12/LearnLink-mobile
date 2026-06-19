import {create} from "zustand";
import { Course } from "../@types/course";
import axiosInstance from "../lib/axios";
import Toast from "react-native-toast-message";

interface CoursStoreState{
    // student related courses
    course:Course|null;
    isGettingCourse:boolean;
    getCourse:(id:number)=>Promise<void>;

    // course details with its materials
    // for enrolled students and teachers to view and edit course with its materials
    courseWithMaterials:Course | null;
    getCourseWithMaterialsById:(id:number)=>Promise<boolean>;
    isGettingCourseWithMaterialsById:boolean;
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
    },

    courseWithMaterials:null,
    isGettingCourseWithMaterialsById:false,
    getCourseWithMaterialsById:async(id:number)=>{
        set({isGettingCourseWithMaterialsById:true});
        try {
            const response=await axiosInstance.get(`/courses/course/${id}`);
            set({courseWithMaterials:response.data.course});
            return true;
        } catch (error:any) {
            Toast.show({
                type:'error',
                text1:error.response?.data?.message || "An error occurred"
            });
            return false;
        }finally{
            set({isGettingCourseWithMaterialsById:false});
        }
    },
}));