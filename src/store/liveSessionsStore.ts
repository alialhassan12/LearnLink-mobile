import {create} from 'zustand';
import type {LiveSession} from '../@types/liveSession';
import axiosInstance from '../lib/axios';
import { SessionReview } from '../@types/sessionReview';
import Toast from 'react-native-toast-message';


export interface LiveSessionState{
    token:string;
    serverUrl:string;
    sessionId:number;

    isGettingToken:boolean;
    getToken:(roomName:string,session_id:number)=>Promise<void>;

    isEndingSession:boolean;
    endSession:(session_id:number)=>Promise<void>;
    clearSession:()=>void;

    teacherLiveSessions:LiveSession[];
    isGettingTeacherLiveSessions:boolean;
    getTeacherLiveSessions:()=>Promise<void>;

    teacherSelectedSession:LiveSession | null;
    isGettingTeacherSelectedSession:boolean;
    getTeacherSelectedSession:(id:number)=>Promise<LiveSession | null>;

    studentLiveSessions:LiveSession[];
    isGettingStudentLiveSessions:boolean;
    getStudentLiveSessions:()=>Promise<void>;

    studentSelectedSession:LiveSession |null;
    isGettingStudentSelectedSession:boolean;
    getStudentSelectedSession:(id:number)=>Promise<LiveSession | null>;

    // session reviews
    sessionReview:SessionReview | null;
    isCreatingSessionReview:boolean;
    createSessionReview:(session_id:number,rating:number,review_text?:string)=>Promise<void>;
}

export const useLiveSessionStore =create<LiveSessionState>((set)=>({
    token:"",
    serverUrl:"",
    sessionId:0,

    sessionReview:null,

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

    teacherLiveSessions:[],
    isGettingTeacherLiveSessions:false,
    getTeacherLiveSessions:async()=>{
        set({isGettingTeacherLiveSessions:true});
        try {
            const response=await axiosInstance.get('/live-sessions/teacher-sessions');
            set({teacherLiveSessions:response.data.live_sessions});
        } catch (error:any) {
            console.error('Error fetching live sessions:', error?.response?.data?.message || error?.message || 'Unknown error');
        } finally{
            set({isGettingTeacherLiveSessions:false});
        }
    },

    teacherSelectedSession:null,
    isGettingTeacherSelectedSession:false,
    getTeacherSelectedSession:async(id:number)=>{
        set({isGettingTeacherSelectedSession:true});
        try{
            const response=await axiosInstance.get(`/live-sessions/teacher-session/${id}`);
            set({
                teacherSelectedSession:response.data.session,
                sessionReview:response.data.session.session_review
            });
            console.log(response.data.session);
            return response.data.session;
            
        }catch(error:any){
            console.error('Error fetching teacher selected session:', error?.response?.data?.message || error?.message || 'Unknown error');
            return null;
        }finally{
            set({isGettingTeacherSelectedSession:false});
        }
    },

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
    },

    isCreatingSessionReview:false,
    createSessionReview:async(live_session_id:number,rating:number,review_text?:string)=>{
        set({isCreatingSessionReview:true});
        try {
            const response =await axiosInstance.post('/live-sessions/review/new',{live_session_id,rating,review_text});
            set({sessionReview:response.data.session_review});
            Toast.show({
                type:'success',
                text1:response.data.message
            });
        } catch (error:any) {
            console.error('Error creating session review:', error?.response?.data?.message || error?.message || 'Unknown error');
            Toast.show({
                type:'error',
                text1:error?.response?.data?.message || error?.message || 'Unknown error'
            });
        } finally{
            set({isCreatingSessionReview:false});
        }
    }
}));