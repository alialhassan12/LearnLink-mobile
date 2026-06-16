import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    Dimensions,
    Platform,
    PermissionsAndroid,
} from "react-native";

import {
    LiveKitRoom,
    useTracks,
    VideoTrack,
    TrackReferenceOrPlaceholder,
    isTrackReference,
    useLocalParticipant,
    registerGlobals,
} from "@livekit/react-native";

import { Track } from "livekit-client";
import { AudioSession } from "@livekit/react-native";
import RoomUI from "../components/RoomUI";

// Must be called before any LiveKit usage to polyfill WebRTC APIs
registerGlobals();

type Props = {
    serverUrl: string;
    token: string;
    onLeave?: () => void;
};

export default function SessionRoomScreen({ serverUrl, token }: Props) {
    const [permissions, setPermissions] = useState({
        camera: Platform.OS !== "android",
        audio: Platform.OS !== "android",
        checked: Platform.OS !== "android",
    });

    useEffect(() => {
        const checkAndRequestPermissions = async () => {
            if (Platform.OS === "android") {
                try {
                    const grants = await PermissionsAndroid.requestMultiple([
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    ]);

                    const cameraGranted =
                        grants[PermissionsAndroid.PERMISSIONS.CAMERA] ===
                        PermissionsAndroid.RESULTS.GRANTED;
                    const audioGranted =
                        grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
                        PermissionsAndroid.RESULTS.GRANTED;

                    setPermissions({
                        camera: cameraGranted,
                        audio: audioGranted,
                        checked: true,
                    });
                } catch (err) {
                    console.error("Failed to request permissions:", err);
                    setPermissions({
                        camera: false,
                        audio: false,
                        checked: true,
                    });
                }
            }
        };

        checkAndRequestPermissions();
        AudioSession.startAudioSession();
        return () => {
            AudioSession.stopAudioSession();
        };
    }, []);

    if (!permissions.checked) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Setting up session...</Text>
            </View>
        );
    }

    return (
        <LiveKitRoom
            serverUrl={serverUrl}
            token={token}
            connect={true}
            audio={permissions.audio}
            video={permissions.camera}
        >
            <RoomUI />
        </LiveKitRoom>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: "#090d16",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "#94a3b8",
        fontSize: 15,
        fontWeight: "600",
    },
});