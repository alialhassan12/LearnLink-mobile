import useAuthStore from "@/src/store/authStore";
import { useLiveSessionStore } from "@/src/store/liveSessionsStore";
import { useLocalParticipant, useRoomContext } from "@livekit/react-native";
import { router } from "expo-router";
import { Track, type LocalVideoTrack } from "livekit-client";
import { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const {width} = Dimensions.get('window');

export default function ControlBar() {
    const {isEndingSession,endSession,sessionId,clearSession}=useLiveSessionStore();
    const {authUser}=useAuthStore();
    const { localParticipant } = useLocalParticipant();
    const room=useRoomContext();

    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);

    const toggleMic = async () => {
        const next = !micOn;
        await localParticipant.setMicrophoneEnabled(next);
        setMicOn(next);
    };

    const toggleCam = async () => {
        const next = !camOn;
        await localParticipant.setCameraEnabled(next);
        setCamOn(next);
    };

    const switchCam = async () => {
        const camPub = localParticipant.getTrackPublication(Track.Source.Camera);
        if (camPub?.track) {
            await (camPub.track as LocalVideoTrack).restartTrack({
                facingMode: camPub.track.mediaStreamTrack?.getSettings().facingMode === "user" ? "environment" : "user",
            });
        }
    };

    const handleleave=async()=>{
        await room.disconnect();
        if(authUser?.role ==='teacher'){
            endSession(sessionId);
        }
        clearSession();
        router.back();
    }

    return (
        <View style={styles.controls}>
        <Pressable style={styles.btn} onPress={toggleMic}>
            <Text>{micOn ? "🎤 Mute" : "🎤 Unmute"}</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={toggleCam}>
            <Text>{camOn ? "📷 Off" : "📷 On"}</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={switchCam}>
            <Text>🔄 Flip</Text>
        </Pressable>

        <Pressable
            style={[styles.btn, styles.leave]}
            onPress={handleleave}
        >
            <Text style={{ color: "white" }}>Leave</Text>
        </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    controls: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        backgroundColor: "#111",
    },

    btn: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: "#2a2a2a",
        borderRadius: 10,
    },

    leave: {
        backgroundColor: "red",
    },
});