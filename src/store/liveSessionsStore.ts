import {create} from 'zustand';
import type {LiveSession} from '../@types/liveSession';
import axiosInstance from '../lib/axios';


export interface LiveSessionState{

    studentLiveSessions:LiveSession[];
    isGettingStudentLiveSessions:boolean;
    getStudentLiveSessions:()=>Promise<void>;

    studentSelectedSession:LiveSession |null;
    isGettingStudentSelectedSession:boolean;
    getStudentSelectedSession:(id:number)=>Promise<LiveSession | null>;
}

export const useLiveSessionStore =create<LiveSessionState>((set)=>({

    studentLiveSessions:[],
    studentSelectedSession:null,

    isGettingStudentLiveSessions:false,
    getStudentLiveSessions: async()=>{
        set({isGettingStudentLiveSessions:true});
        try{
            const response = await axiosInstance.get('/live-sessions/student-sessions');
            set({studentLiveSessions:response.data.live_sessions});
        }catch(error:any){
            console.error('Error fetching student live sessions:',error?.response?.data?.message || error?.message);
        }finally{
            set({isGettingStudentLiveSessions:false});
        }
    },

    isGettingStudentSelectedSession:false,
    getStudentSelectedSession: async (id: number)=>{
        set({isGettingStudentSelectedSession:true});
        try{
            const response = await axiosInstance.get(`/live-sessions/student-session/${id}`);
            set({studentSelectedSession:response.data.session});
            return response.data.live_session;
        }catch(error:any){
            console.error('Error fetching student selected session:',error?.response?.data?.message || error?.message);
            return null;
        }finally{
            set({isGettingStudentSelectedSession:false});
        }
    }
}));