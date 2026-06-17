import useAuthStore from "@/src/store/authStore";
import "../global.css";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { useCourseEnrollmentStore } from "@/src/store/studentStores/courseEnrollmentStore";

export default function Index() {
  const {isCheckingAuth,checkAuth,authUser}=useAuthStore();
  const {getEnrolledCoursesIds}=useCourseEnrollmentStore();

  const initialize=async()=>{
    const isLoggedIn=await checkAuth();
    if(isLoggedIn && useAuthStore.getState().authUser?.role === 'student'){
      console.log("get enrolled course ids");
      await getEnrolledCoursesIds();
    }
  }

  useEffect(()=>{
    initialize();
  },[]);

  if(isCheckingAuth){
    return(
      <View className='flex justify-center items-center h-screen'>
        <View className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></View>
      </View>
    );
  }

  if(authUser?.role==='student') {
    return (
      <>
        <Redirect href="/(student)/Home" />
      </>
    );
  }

  // if(authUser?.role==='teacher') return 
  //   <>
  //     <Redirect href="/(teacher)/Home" />
  //   </>
  
  return (
    <>
      <Redirect href="/Login" />
    </>
  );
}
