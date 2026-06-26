import {create} from "zustand";
import { Course } from "../@types/course";
import axiosInstance from "../lib/axios";
import Toast from "react-native-toast-message";
import { CourseReview } from "../@types/courseReview";

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

    // course reviews
    courseReviews:CourseReview[];
    isCreatingCourseReview:boolean;
    createCourseReview:(course_id:number,rating:number,review_text?:string)=>Promise<void>;
}

export const useCourseStore=create<CoursStoreState>((set,get)=>({
    courseReviews:[],
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
            set({
                courseWithMaterials:response.data.course,
                courseReviews:response.data.course?.course_reviews || []
            });
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

    isCreatingCourseReview:false,
    createCourseReview:async(course_id:number,rating:number,review_text?:string)=>{
        set({isCreatingCourseReview:true});
        try{
            const response=await axiosInstance.post('/courses/review/new',{course_id,rating,review_text});
            set({
                courseReviews:[...get().courseReviews,response.data.review]
            });
            Toast.show({
                type:'success',
                text1:response.data.message
            });
        }catch(error:any){
            Toast.show({
                type:'error',
                text1:error.response?.data?.message || "An error occurred"
            });
        }finally{
            set({isCreatingCourseReview:false});
        }
    }
}));