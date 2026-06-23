import {create} from "zustand";
import { Booking } from "../@types/booking";
import axiosInstance from "../lib/axios";
import Toast from "react-native-toast-message";
import { PaginationData } from "../@types/paginationData";

interface BookingStoreState{
    newBooking:Booking | null;
    studentBookings:Booking[];

    isCreatingBooking:boolean;
    createBooking:(booking:Booking)=>Promise<void>;

    isGettingStudentBookings:boolean;
    getStudentBookings:(page?:number)=>Promise<void>;
    studentBookingsPagination:PaginationData | null;

    teacherBookings:Booking[];
    teacherBookingsPagination:PaginationData |null;

    isGettingTeacherBookings:boolean;
    getTeacherBookings:(page?:number)=>Promise<void>;
    getTeacherBookingsWithNoLoading:(page?:number)=>Promise<void>;

    max_live_sessions:number;
    current_live_sessions:number;

    isRejectingBooking:boolean;
    rejectBooking:(booking_id:number)=>Promise<void>;
    
    isApprovingBooking:boolean;
    approveBooking:(booking_id:number)=>Promise<void>;
}

const useBookingStore=create<BookingStoreState>((set)=>({
    newBooking:null,
    studentBookings:[],
    studentBookingsPagination:null,

    isCreatingBooking:false,
    createBooking:async(booking:Booking)=>{
        set({isCreatingBooking:true});
        try{
            const response=await axiosInstance.post('/booking/new-booking',booking);
            set((state)=>{
                const newBooking=response.data.booking;
                const studentBookings=[newBooking,...state.studentBookings];
                return {
                    newBooking:newBooking,
                    studentBookings:studentBookings
                }
            });
            Toast.show({
                type:'success',
                text1:'Booking created successfully',
                text2: `You have successfully booked a session with ${booking.teacher?.user?.name}`
            });
        }
        catch(error:any){
            Toast.show({
                type:'error',
                text1:'Failed to create booking',
                text2: error.response?.data?.message || 'Unknown error'
            });
        } finally{
            set({isCreatingBooking:false});
        }
    },

    isGettingStudentBookings:false,
    getStudentBookings:async(page=1)=>{
        set({isGettingStudentBookings:true});
        try {
            const response=await axiosInstance.get(`/bookings/student-bookings?page=${page}`);
            set({
                studentBookings:response.data.bookings.data,
                studentBookingsPagination:response.data.pagination
            });
        } catch (error:any) {
            console.error(error.response?.data?.message);
        }finally{
            set({isGettingStudentBookings:false});
        }
    },

    // teacher bookings
    teacherBookings:[],
    teacherBookingsPagination:null,

    isGettingTeacherBookings:false,
    getTeacherBookings:async(page:number=1)=>{
        set({isGettingTeacherBookings:true});
        try {
            const response =await axiosInstance.get(`/bookings/teacher-bookings?page=${page}`);
            set({
                teacherBookings:response.data.bookings.data,
                teacherBookingsPagination:response.data.pagination,
                max_live_sessions:response.data.max_live_sessions,
                current_live_sessions:response.data.current_live_sessions
            });
        } catch (error:any) {
            console.log('error getting teacher bookings',error?.response?.data?.message);
        }finally{
            set({isGettingTeacherBookings:false});
        }
    },
    getTeacherBookingsWithNoLoading:async(page:number=1)=>{
        try {
            const response =await axiosInstance.get(`/bookings/teacher-bookings?page=${page}`);
            set({
                teacherBookings:response.data.bookings.data,
                teacherBookingsPagination:response.data.pagination,
                max_live_sessions:response.data.max_live_sessions,
                current_live_sessions:response.data.current_live_sessions
            });
        } catch (error:any) {
            console.log('error getting teacher bookings',error?.response?.data?.message);
        }
    },

    max_live_sessions:0,
    current_live_sessions:0,

    isRejectingBooking:false,
    rejectBooking:async(booking_id:number)=>{
        set({isRejectingBooking:true});
        try{
            const response=await axiosInstance.post('/bookings/reject-booking',{booking_id});
            set((state)=>{
                const booking=response.data.booking;
                const teacherBookings=state.teacherBookings?.filter((b)=>b.id!==booking_id);
                return {
                    teacherBookings: [...teacherBookings, booking]
                };
            });
            Toast.show({
                type:'success',
                text1:response.data.message
            });
        }
        catch(error:any){
            Toast.show({
                type:'error',
                text1:error.response?.data?.message || 'Unknown error'
            });
        } finally{
            set({isRejectingBooking:false});
        }
    },

    isApprovingBooking:false,
    approveBooking:async(booking_id:number)=>{
        set({isApprovingBooking:true});
        try{
            const response=await axiosInstance.post('/bookings/approve-booking',{booking_id});
            set((state)=>{
                const booking=response.data.booking;
                const teacherBookings=state.teacherBookings?.filter((b)=>b.id!==booking_id);
                return {
                    teacherBookings: [...teacherBookings, booking],
                    current_live_sessions:response.data.current_live_sessions
                };
            });
            Toast.show({
                type:'success',
                text1:response.data.message
            });
        }
        catch(error:any){
            Toast.show({
                type:'error',
                text1:error.response?.data?.message || 'Unknown error'
            });
        } finally{
            set({isApprovingBooking:false});
        }
    },
}));

export default useBookingStore;