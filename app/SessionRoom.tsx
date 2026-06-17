import LiveKitComponentDocs from "@/src/components/LiveKitComponentDocs";
import SessionRoomScreen from "@/src/screens/SessionRoomScreen";
import { useLiveSessionStore } from "@/src/store/liveSessionsStore";
import { Text, View } from "react-native";

export default function SessionRoom(){
    const {token,serverUrl}=useLiveSessionStore();

    if(!token || !serverUrl){
        return (
            <View className="flex flex-1 justify-center items-center">
                <Text className="text-text-strong text-xl">No session available</Text>
            </View>
        );
    }
    return (
        <SessionRoomScreen
            token={token}
            serverUrl={serverUrl}
        />
        // <LiveKitComponentDocs serverUrl={serverUrl} token={token} />
    );
}