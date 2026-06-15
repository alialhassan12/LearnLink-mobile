import SessionRoomScreen from "@/src/screens/SessionRoomScreen";
import { useLiveSessionStore } from "@/src/store/liveSessionsStore";

export default function SessionRoom(){
    const {token,serverUrl}=useLiveSessionStore();
    return (
        <SessionRoomScreen
            token={token}
            serverUrl={serverUrl}
        />
    );
}