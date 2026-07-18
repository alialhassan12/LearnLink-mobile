import { Course } from "@/src/@types/course";
import { PaginationData } from "@/src/@types/paginationData";
import { Teacher } from "@/src/@types/teahcer";
import axiosInstance from "@/src/lib/axios";
import Toast from "react-native-toast-message";
import {create} from "zustand";

interface TeacherFilter {
    subjects?:string[];
    language?:string;
    hourlyRate:[min:number,max:number];
    search_query?:string;
    rating?:number | null;
}
interface CourseFilter{
    category_id?:number;
    price_range:[min:number,max:number];
    search_query?:string;
}

interface browseStoreState{
    teachers:Teacher[];
    subjects:string[];
    languages:string[];

    getSubjects:()=>Promise<void>;
    getLanguages:()=>Promise<void>;
    isGettingFilters:boolean;
    setIsGettingFilters:(value:boolean)=>void;

    courses:Course[];
    teacher:Teacher |null,

    isGettingTeachers:boolean;
    teachersPaginationData:PaginationData |null;
    getTeachers:(page?:number)=>Promise<void>;

    isGettingCourses:boolean;
    coursesPaginationData:PaginationData |null;
    getCourses:(page?:number)=>Promise<boolean>;

    isGettingTeacherById:boolean;
    getTeacherById:(id:number)=>Promise<void>;

    // teacher filters
    teacherFilter:TeacherFilter;
    setTeacherFilter:(filter:TeacherFilter)=>void;
    clearTeacherFilter:()=>void;

    // course filters
    courseFilters:CourseFilter;
    setCourseFilters:(courseFilters:CourseFilter)=>void;
    clearCourseFilters:()=>void;
}

export const useBrowseStore=create<browseStoreState>((set,get)=>({
    teachers:[],
    subjects:[],
    languages:[],

    isGettingFilters:false,
    setIsGettingFilters:(value:boolean)=>set({isGettingFilters:value}),
    
    getSubjects:async()=>{
        try {
            const response = await axiosInstance.get('/teachers/subjects');
            set({subjects:response.data.subjects});
        } catch (error:any) {
            Toast.show({
                type:"error",
                text1:error.response?.data?.message || "Failed to fetch subjects"
            });
        }
    },

    getLanguages:async()=>{
        try {
            const response = await axiosInstance.get('/teachers/languages');
            set({languages:response.data.languages});
        } catch (error:any) {
            Toast.show({
                type:"error",
                text1:error.response?.data?.message || "Failed to fetch languages"
            });
        }
    },

    courses:[],
    teacher:null,

    isGettingTeachers:false,
    teachersPaginationData:null,
    getTeachers:async(page=1)=>{
        const currentFilters=get().teacherFilter;
        set({isGettingTeachers:true});
        try{
            if((currentFilters.hourlyRate[0] !== 0 && currentFilters.hourlyRate[1]!==2000) || (currentFilters.subjects?.length !== 0) || (currentFilters.language !== "all") || (currentFilters.rating !== 0) || (currentFilters.search_query !== "")){
                console.log(currentFilters);
                const response = await axiosInstance.post(`/teachers/filters?page=${page}`,currentFilters);
                set({teachers:response.data.teachers,teachersPaginationData:response.data.pagination});
                console.log(response.data);
            }else{
                const response = await axiosInstance.get(`/teachers?page=${page}`);
                set({teachers:response.data.teachers,teachersPaginationData:response.data.pagination});
            }
        }catch(error:any){
            Toast.show({
                type:"error",
                text1:error?.response?.data?.message || "Failed to fetch teachers"
            });
            console.log(error);
        }finally{
            set({isGettingTeachers:false});
        }
    },

    isGettingCourses:false,
    coursesPaginationData:null,
    getCourses:async(page:number=1)=>{
        const currentFilters=get().courseFilters;
        set({isGettingCourses:true});
        try{
            if((currentFilters.category_id) || (currentFilters.price_range[0] !== 0 && currentFilters.price_range[1] !== 100) || (currentFilters.search_query !== "")){
                const response=await axiosInstance.post(`/courses/get-courses/filtered?page=${page}`,{
                    category_id:currentFilters.category_id,
                    price_range:currentFilters.price_range,
                    search_query:currentFilters.search_query
                });
                set({courses:response.data.courses,coursesPaginationData:response.data.pagination});
            }else{
                const response=await axiosInstance.get(`/courses/get-courses?page=${page}`);
                set({courses:response.data.courses,coursesPaginationData:response.data.pagination});
            }
            return true;
        }catch(error:any){
            Toast.show({
                type:"error",
                text1:error?.response?.data?.message || "Failed to fetch courses"
            });
            console.log(error);
            return false;
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
    },

    // teacher filters
    teacherFilter:{
        subjects:[],
        language:"all",
        hourlyRate:[0,2000],
        search_query:"",
        rating:0
    },
    setTeacherFilter:(filter:TeacherFilter)=>set({teacherFilter:filter}),
    clearTeacherFilter:()=>set({teacherFilter:{
        subjects:[],
        language:"all",
        hourlyRate:[0,2000],
        search_query:"",
        rating:0
    }}),

    // course filters
    courseFilters:{
        category_id: undefined,
        price_range: [0, 100],
        search_query: ""
    },
    setCourseFilters:(courseFilters:CourseFilter)=>set({courseFilters}),
    clearCourseFilters:()=>set({courseFilters:{
        category_id: undefined,
        price_range: [0, 100],
        search_query: ""
    }}),
}));