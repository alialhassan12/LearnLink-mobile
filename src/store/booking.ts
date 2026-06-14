import {create} from "zustand";
import { Booking } from "../@types/booking";
import axiosInstance from "../lib/axios";
import Toast from "react-native-toast-message";

interface BookingStoreState{
    newBooking:Booking | null;

    isCreatingBooking:boolean;
    createBooking:(booking:Booking)=>Promise<void>;
}

const useBookingStore=create<BookingStoreState>((set)=>({
    newBooking:null,

    isCreatingBooking:false,
    createBooking:async(booking:Booking)=>{
        set({isCreatingBooking:true});
        try{
            const response=await axiosInstance.post('/booking/new-booking',booking);
            set({newBooking:response.data.booking});
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
    }
}));

export default useBookingStore;