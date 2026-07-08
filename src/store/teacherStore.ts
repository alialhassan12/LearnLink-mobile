import {create} from 'zustand';
import type {Teacher} from '../@types/teahcer';
import axiosInstance from '../lib/axios';
import Toast from 'react-native-toast-message';

interface TeacherStoreState{
    teacher:Teacher|null;
    setTeacher:(teacher:Teacher)=>void;
    getTeacher:()=>Promise<void>;
    isGettingTeacher:boolean;
    updateTeacher:(updatedTeacherData:FormData)=>Promise<Teacher|null>;
    isUpdatingTeacher:boolean;
}

export const useTeacherStore=create<TeacherStoreState>((set)=>({
    teacher:null,
    setTeacher:(teacher:Teacher)=>set({teacher}),

    isGettingTeacher:false,
    getTeacher:async()=>{
        set({isGettingTeacher:true});
        try {
            const response = await axiosInstance.get('/teacher/profile');
            set({teacher:response.data.teacher});
        } catch (error:any) {
            console.log(error.response?.data?.message);
        } finally{
            set({isGettingTeacher:false});
        }
    },

    isUpdatingTeacher:false,
    updateTeacher:async(updatedTeacherData:FormData)=>{
        try {
            set({isUpdatingTeacher:true});
            const response = await axiosInstance.put('/teacher/update-profile',updatedTeacherData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            set({teacher:response.data.teacher});
            Toast.show({
                type:'success',
                text1:response.data.message,
            });
            return response.data.teacher;
        } catch (error:any) {
            Toast.show({
                type:'error',
                text1:error.response?.data?.message,
            });
            return null;
        } finally{
            set({isUpdatingTeacher:false});
        }
    },
}));

