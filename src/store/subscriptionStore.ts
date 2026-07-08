import {create} from "zustand";
import axiosInstance from "../lib/axios";
import type { Plan } from "../@types/plan";
import type { Subscription } from "../@types/subscription";
import Toast from "react-native-toast-message";

interface SubscriptionState{
    currentSubscription:Subscription|null;
    setCurrentSubscription:(sub:Subscription|null)=>void;

    isGettingPlans:boolean;
    activePlans:Plan[];
    getActivePlans:()=>Promise<void>;

    isUpgrading:boolean;
    upgradeSubscription:(plan_id:number)=>Promise<void>;
}

export const useSubscriptionStore=create<SubscriptionState>((set)=>({
    currentSubscription:null,
    setCurrentSubscription:(sub:Subscription | null)=>set({currentSubscription:sub}),

    isGettingPlans:false,
    activePlans:[],
    getActivePlans:async()=>{
        set({isGettingPlans:true});
        try{
            const response=await axiosInstance.get('/plans');
            set({activePlans:response.data.plans});
        }catch(error){
            console.error("Error fetching plans:",error);
            Toast.show({
                type:'error',
                text1:'Error fetching plans'
            });
        }finally{
            set({isGettingPlans:false});
        }
    },

    isUpgrading:false,
    upgradeSubscription:async(plan_id:number)=>{
        set({isUpgrading:true});
        try{
            const response=await axiosInstance.post('/plans/subscription/upgrade',{
                plan_id
            });
            set({currentSubscription:response.data.subscription});
            Toast.show({
                type:'success',
                text1:'Subscription upgraded successfully'
            });
        }catch(error){
            console.error("Error upgrading subscription:",error);
            Toast.show({
                type:'error',
                text1:'Error upgrading subscription'
            });
        }finally{
            set({isUpgrading:false});
        }
    }
}));