import {create} from 'zustand';
import type {LiveSession} from '../@types/liveSession';
import axiosInstance from '../lib/axios';


export interface LiveSessionState{
    token:string;
    serverUrl:string;
    sessionId:number;

    isGettingToken:boolean;
    getToken:(roomName:string,session_id:number)=>Promise<void>;

    isEndingSession:boolean;
    endSession:(session_id:number)=>Promise<void>;
    clearSession:()=>void;

    studentLiveSessions:LiveSession[];
    isGettingStudentLiveSessions:boolean;
    getStudentLiveSessions:()=>Promise<void>;

    studentSelectedSession:LiveSession |null;
    isGettingStudentSelectedSession:boolean;
    getStudentSelectedSession:(id:number)=>Promise<LiveSession | null>;
}

export const useLiveSessionStore =create<LiveSessionState>((set)=>({
    token:"",
    serverUrl:"",
    sessionId:0,

    isGettingToken:false,
    getToken:async(roomName:string,session_id:number)=>{
        set({isGettingToken:true});
        try {
            const response=await axiosInstance.post('/livekit/token',{room_name:roomName});
            set({token:response.data.token,serverUrl:response.data.url,sessionId:session_id});
        } catch (error:any) {
            console.error('Error fetching token:', error?.response?.data?.message || error?.message || 'Unknown error');
        } finally{
            set({isGettingToken:false});
        }
    },

    isEndingSession:false,
    endSession:async(session_id:number)=>{
        set({isEndingSession:true});
        try {
            const response=await axiosInstance.post('/live-session/end-session',{session_id});
            console.log(response.data.message);
        } catch (error:any) {
            console.error('Error ending session:', error?.response?.data?.message || error?.message || 'Unknown error');
        }finally{
            set({isEndingSession:false});
        }
    },

    clearSession: () => set({ token: "", serverUrl: "", sessionId: 0 }),

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