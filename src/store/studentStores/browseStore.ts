import { Course } from "@/src/@types/course";
import { PaginationData } from "@/src/@types/paginationData";
import { Teacher } from "@/src/@types/teahcer";
import axiosInstance from "@/src/lib/axios";
import Toast from "react-native-toast-message";
import {create} from "zustand";

interface browseStoreState{
    teachers:Teacher[];
    courses:Course[];
    teacher:Teacher |null,

    isGettingTeachers:boolean;
    teachersPaginationData:PaginationData |null;
    getTeachers:(page?:number)=>Promise<void>;

    isGettingCourses:boolean;
    coursesPaginationData:PaginationData |null;
    getCourses:(page?:number)=>Promise<void>;

    isGettingTeacherById:boolean;
    getTeacherById:(id:number)=>Promise<void>;
}

export const useBrowseStore=create<browseStoreState>((set)=>({
    teachers:[],
    courses:[],
    teacher:null,

    isGettingTeachers:false,
    teachersPaginationData:null,
    getTeachers:async(page=1)=>{
        try{
            set({isGettingTeachers:true});
            const response=await axiosInstance.get(`/teachers?page=${page}`);
            set({
                teachers:response.data.teachers,
                teachersPaginationData:response.data.pagination
            });
        }catch(error){
            console.log(error);
        }finally{
            set({isGettingTeachers:false});
        }
    },

    isGettingCourses:false,
    coursesPaginationData:null,
    getCourses:async(page=1)=>{
        try{
            set({isGettingCourses:true});
            const response=await axiosInstance.get(`/courses/get-courses?page=${page}`);
            set({
                courses:response.data.courses,
                coursesPaginationData:response.data.pagination
            });
        }catch(error){
            console.log(error);
        }finally{
            set({isGettingCourses:false});
        }
    },

    isGettingTeacherById:false,
    getTeacherById:async(id:number)=>{
        set({isGettingTeacherById:true});
        try{
            const response=await axiosInstance.get(`/teacher/${id}`);
            set({teacher:response.data.teacher});
            console.log(response.data.teacher);
        }catch(error:any){
            Toast.show({
                type:"error",
                text1:error?.response?.data?.message || "Failed to fetch teacher"
            });
            console.log(error);
        }finally{
            set({isGettingTeacherById:false});
        }
    }
}));