import {create} from "zustand";
import axiosInstance from "../../lib/axios";
import Toast from "react-native-toast-message";

interface CourseEnrollmentState{
    enrolledCoursesIds:number[];
    getEnrolledCoursesIds:()=>Promise<void>;

    enroll:(courseId:number)=>Promise<void>;
    isEnrolling:boolean;
}

export const useCourseEnrollmentStore=create<CourseEnrollmentState>((set,get)=>({
    enrolledCoursesIds:[],
    getEnrolledCoursesIds:async()=>{
        console.log("getting ids");
        try {
            const response=await axiosInstance.get('/courses/enrolled-courses-ids');
            set({enrolledCoursesIds:response.data.enrolled_courses_ids});
        } catch (error:any) {
            console.log("Error getting enrolled courses ids:",error);
            Toast.show({
                type:"error",
                text1:error.response?.data?.message || "Failed to get enrolled courses ids"
            });
        }
    },

    isEnrolling:false,
    enroll:async(courseId:number)=>{
        set({isEnrolling:true});
        try{
            const response=await axiosInstance.post('/courses/enroll',{"course_id":courseId});
            set({enrolledCoursesIds:[...get().enrolledCoursesIds,courseId]});
            Toast.show({
                type:"success",
                text1:"Enrolled in course successfully"
            });
        }catch(error:any){
            console.log("Error enrolling course:",error);
            Toast.show({
                type:"error",
                text1:error.response?.data?.message || "Failed to enroll in course"
            });
        }finally{
            set({isEnrolling:false});
        }
    }
}));