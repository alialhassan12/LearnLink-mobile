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
    }
}));

export default useBookingStore;