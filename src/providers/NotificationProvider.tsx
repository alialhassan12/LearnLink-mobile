import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";
import useAuthStore from "../store/authStore";

Notifications.setNotificationHandler({
    handleNotification:async ()=>{
        return {
            shouldShowBanner:true,
            shouldShowList:true,
            shouldPlaySound:true,
            shouldSetBadge:true
        }
    }
});

export default function NotificationProvider({
    children
}:{
    children:React.ReactNode;
})
{

    const {authUser}=useAuthStore();

    useEffect(()=>{
        const checkInitialNotification=async()=>{
            const response=await Notifications.getLastNotificationResponseAsync();
            if(!response){
                return;
            }

            const data=response.notification.request.content.data;

            console.log(data);

            if(data?.type === "booking"){
                if(authUser?.role === "teacher"){
                    router.push({
                        pathname:"/(teacher)/Bookings"
                    })
                }else if(authUser?.role === "student"){
                    router.push({
                        pathname:"/(student)/(Library)/MyBookings"
                    })
                }
            }
        };

        checkInitialNotification();

        // Foreground notifications
        const receivedSubscription=Notifications.addNotificationReceivedListener(notification =>{
            console.log("Foreground notification");
            console.log(notification);
            
        });

        // User tapped notification
        const responseSubscription=Notifications.addNotificationResponseReceivedListener(response=>{
            console.log("Notification tapped");
            console.log(response);

            const data=response.notification.request.content.data;
            if(data?.type === "booking"){
                if(authUser?.role === "teacher"){
                    router.push({
                        pathname:"/(teacher)/Bookings"
                    })
                }else if(authUser?.role === "student"){
                    router.push({
                        pathname:"/(student)/(Library)/MyBookings"
                    })
                }
            }
        });

        return ()=>{
            receivedSubscription.remove();
            responseSubscription.remove();
        }
    },[]);

    return(
        children
    );
}