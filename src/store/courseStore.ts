import {create} from "zustand";
import { Course } from "../@types/course";
import axiosInstance from "../lib/axios";
import Toast from "react-native-toast-message";
import { CourseReview } from "../@types/courseReview";
import { CoursePublish } from "../@types/coursePublish";
import { MobileFile } from "./chatStore";

interface CoursStoreState{
    newCourse:Course|null;

    
    isPublishing:boolean;
    setIsPublishing:(isPublishing:boolean)=>void;
    publishCourse:(data:CoursePublish)=>Promise<boolean>;
    isSavingDraft:boolean;
    saveDraftCourse:(data?:CoursePublish)=>Promise<boolean>;
    
    isEditingCourse:boolean;
    editCourse:(course_id:number,data:Course)=>Promise<boolean>;
    
    // student related courses
    course:Course|null;
    isGettingCourse:boolean;
    getCourse:(id:number)=>Promise<void>;

    //teacher courses
    teacherCourses:Course[];
    getTeacherCourses:()=>Promise<boolean>;
    isGettingTeacherCourses:boolean;
    maxCoursesAllowed:number;

    isChangingCourseStatus:boolean;
    changeCourseStatus:(status:string,course_id:number)=>Promise<boolean>;

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
    newCourse:null,
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

    isEditingCourse:false,
    editCourse:async(course_id:number,data:Course)=>{
        set({isEditingCourse:true});
        try {
            const formData =new FormData();
            formData.append('course_id',String(course_id));
            formData.append('category_id',String(data.category_id));
            formData.append('title',data.title);
            formData.append('description',data.description);
            
            if (data.thumbnail && typeof data.thumbnail === 'object' && 'uri' in data.thumbnail) {
                formData.append('thumbnail', data.thumbnail as any);
            }
            formData.append('language',data.language);
            formData.append('price',String(data.price));
            data?.sections?.forEach((section, index) => {
                if (section?.id) {
                    formData.append(`sections[${index}][id]`, String(section.id));
                }
                formData.append(`sections[${index}][title]`, section?.title);
                formData.append(`sections[${index}][order]`, String(section?.order));
                
                section?.materials?.forEach((material, mIndex) => {
                    if (material?.id) {
                        formData.append(`sections[${index}][materials][${mIndex}][id]`, String(material.id));
                    }
                    formData.append(`sections[${index}][materials][${mIndex}][title]`, material?.title);
                    formData.append(`sections[${index}][materials][${mIndex}][type]`, material?.type);
                    formData.append(`sections[${index}][materials][${mIndex}][size]`, String(Math.round(material?.size!)));
                    if (material?.file) {
                        formData.append(`sections[${index}][materials][${mIndex}][file]`, material.file as any);
                    }
                });
            });

            const response=await axiosInstance.put('/courses/edit-course', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            set({
                newCourse:response.data.course,
                teacherCourses:get().teacherCourses.map((course)=>course.id===course_id?response.data.course:course)
            });
            console.log(response.data);
            Toast.show({
                type:'success',
                text1:response.data.message
            });

            return true;
        } catch (error:any) {
            Toast.show({
                type:'error',
                text1:error.response?.data?.message || "An error occurred"
            });
            console.log(error.response?.data);
            return false;
        }finally{
            set({isEditingCourse:false});
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
    },

    isGettingTeacherCourses:false,
    teacherCourses:[],
    maxCoursesAllowed:0,
    getTeacherCourses:async()=>{
        set({isGettingTeacherCourses:true});
        try{
            const response=await axiosInstance.get('/courses/my-courses');
            set({
                teacherCourses:response.data.courses,
                maxCoursesAllowed:response.data.max_courses_allowed
            });
            return true;
        }catch(error:any){
            Toast.show({
                type:'error',
                text1:error.response?.data?.message || "An error occurred"
            });
            return false;
        }finally{
            set({isGettingTeacherCourses:false});
        }
    },

    isChangingCourseStatus:false,
    changeCourseStatus:async(status:string,course_id:number)=>{
        set({isChangingCourseStatus:true});
        try {
            const response=await axiosInstance.post('/courses/change-course-status',{course_id,status});
            set({
                teacherCourses:get().teacherCourses.map((course)=>course.id===course_id?response.data.course:course)
            });
            Toast.show({
                type:'success',
                text1:response.data.message
            });
            return true;
        } catch (error:any) {
            Toast.show({
                type:'error',
                text1:error.response?.data?.message || "An error occurred"
            });
            return false;
        }finally{
            set({isChangingCourseStatus:false});
        }
    },

    isPublishing:false,
    setIsPublishing:(isPublishing:boolean)=>set({isPublishing}),
    publishCourse:async(data:CoursePublish)=>{
        set({isPublishing:true});
        try{
            const formData = new FormData();
            formData.append('category_id', String(data?.category_id ?? 0));
            formData.append('title', data?.title ?? "");
            formData.append('description', data?.description ?? "");
            if (data.thumbnail) {
                formData.append('thumbnail', data.thumbnail as any);
            }
            formData.append('language', data?.language ?? "");
            formData.append('price', String(data?.price ?? 0));

            data.sections.forEach((section, index) => {
                formData.append(`sections[${index}][title]`, section.title);
                formData.append(`sections[${index}][order]`, String(section.order));
                
                section?.materials?.forEach((material, mIndex) => {
                    formData.append(`sections[${index}][materials][${mIndex}][title]`, material.title);
                    formData.append(`sections[${index}][materials][${mIndex}][type]`, material.type);
                    formData.append(`sections[${index}][materials][${mIndex}][size]`, String(Math.round(material?.size || 0)));
                    if (material.file) {
                        formData.append(`sections[${index}][materials][${mIndex}][file]`, material.file as any);
                    }
                });
            });

            const response=await axiosInstance.post('/courses/create-course', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            set({newCourse:response.data.course,teacherCourses:[...get().teacherCourses,response.data.course]});
            Toast.show({
                type:"success",
                text1:response.data.message
            });

            return true;
        }catch(error:any){
            Toast.show({
                type:"error",
                text1:error.response?.data?.message || "An error occurred"
            });
            return false;
        }finally{
            set({isPublishing:false});
        }
    },

    isSavingDraft:false,
    saveDraftCourse:async(data?:CoursePublish)=>{
        console.log(data?.category_id);
        console.log(data?.language);
        set({isSavingDraft:true});
        try{
            const formData = new FormData();
            formData.append('category_id', String(data?.category_id ?? 0));
            formData.append('title', data?.title ?? '');
            formData.append('description', data?.description ?? '');
            if (data?.thumbnail) {
                formData.append('thumbnail', data?.thumbnail as any);
            }
            formData.append('language', data?.language ?? '');
            formData.append('price', String(data?.price ?? 0));

            data?.sections?.forEach((section, index) => {
                formData.append(`sections[${index}][title]`, section?.title);
                formData.append(`sections[${index}][order]`, String(section?.order || 0));
                
                section?.materials?.forEach((material, mIndex) => {
                    formData.append(`sections[${index}][materials][${mIndex}][title]`, material?.title);
                    formData.append(`sections[${index}][materials][${mIndex}][type]`, material?.type);
                    formData.append(`sections[${index}][materials][${mIndex}][size]`, String(Math.round(material?.size || 0)));
                    if (material?.file) {
                        formData.append(`sections[${index}][materials][${mIndex}][file]`, material?.file as any);
                    }
                });
            });

            const response=await axiosInstance.post('/courses/save-draft', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            set({newCourse:response.data.course,teacherCourses:[...get().teacherCourses,response.data.course]});
            Toast.show({
                type:'success',
                text1:response.data.message
            });

            return true;
        }catch(error:any){
            Toast.show({
                type:'error',
                text1:error.response?.data?.message || "An error occurred"
            });
            return false;
        }finally{
            set({isSavingDraft:false});
        }
    },
}));