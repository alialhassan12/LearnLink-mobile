import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const axiosInstance=axios.create({
    baseURL:process.env.EXPO_PUBLIC_API_URL,
    withCredentials:true,
    headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
    }
});

// request interceptor
axiosInstance.interceptors.request.use(
    async(config)=>{
        const token = await SecureStore.getItemAsync('token');

        if(token){
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config;
    },
    async(error)=>{
        return Promise.reject(error);
    }
);

export default axiosInstance;