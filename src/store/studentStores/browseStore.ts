import { Course } from "@/src/@types/course";
import { PaginationData } from "@/src/@types/paginationData";
import { Teacher } from "@/src/@types/teahcer";
import axiosInstance from "@/src/lib/axios";
import {create} from "zustand";

interface browseStoreState{
    teachers:Teacher[];
    courses:Course[];

    isGettingTeachers:boolean;
    teachersPaginationData:PaginationData |null;
    getTeachers:(page?:number)=>Promise<void>;

    isGettingCourses:boolean;
    coursesPaginationData:PaginationData |null;
    getCourses:(page?:number)=>Promise<void>;
}

export const useBrowseStore=create<browseStoreState>((set)=>({
    teachers:[],
    courses:[],

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
    }
}));