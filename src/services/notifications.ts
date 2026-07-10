import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export async function registerPushNotifications(){
    if(!Device.isDevice){
        return null;
    }

    const {status:existingStatus}=await Notifications.getPermissionsAsync();

    let finalStatus=existingStatus;

    if(existingStatus !== "granted"){
        const {status}=await Notifications.requestPermissionsAsync();
        finalStatus=status;
    }

    if(finalStatus !=="granted"){
        return null;
    }

    const token=await Notifications.getExpoPushTokenAsync({
        projectId:
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId
    });
    return token.data;
}