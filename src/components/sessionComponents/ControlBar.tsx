import useAuthStore from "@/src/store/authStore";
import { useLiveSessionStore } from "@/src/store/liveSessionsStore";
import { useLocalParticipant, useRoomContext } from "@livekit/react-native";
import { router } from "expo-router";
import { Track, type LocalVideoTrack } from "livekit-client";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ControlBar() {
    const { endSession, sessionId, clearSession } = useLiveSessionStore();
    const { authUser } = useAuthStore();
    const { localParticipant, isMicrophoneEnabled, isCameraEnabled } = useLocalParticipant();
    const room = useRoomContext();

    const toggleMic = async () => {
        const next = !isMicrophoneEnabled;
        await localParticipant.setMicrophoneEnabled(next);
    };

    const toggleCam = async () => {
        const next = !isCameraEnabled;
        await localParticipant.setCameraEnabled(next);
    };

    const switchCam = async () => {
        const camPub = localParticipant.getTrackPublication(
            Track.Source.Camera
        );
        if (camPub?.track) {
            await (camPub.track as LocalVideoTrack).restartTrack({
                facingMode:
                    camPub.track.mediaStreamTrack?.getSettings().facingMode ===
                    "user"
                        ? "environment"
                        : "user",
            });
        }
    };

    const handleleave = async () => {
        await room.disconnect();
        if (authUser?.role === "teacher") {
            endSession(sessionId);
        }
        clearSession();
        router.replace(`/`);
    };

    return (
        <View style={styles.floatingContainer}>
            <View style={styles.glassBar}>
                {/* Microphone Button */}
                <Pressable
                    style={({ pressed }) => [
                        styles.controlBtn,
                        !isMicrophoneEnabled && styles.btnDanger,
                        pressed && styles.btnPressed,
                    ]}
                    onPress={toggleMic}
                >
                    <Ionicons
                        name={isMicrophoneEnabled ? "mic-outline" : "mic-off-outline"}
                        size={22}
                        color={isMicrophoneEnabled ? "#60a5fa" : "#ef4444"}
                    />
                    <Text style={[styles.btnText, !isMicrophoneEnabled && styles.textDanger]}>
                        {isMicrophoneEnabled ? "Mute" : "Unmute"}
                    </Text>
                </Pressable>

                {/* Camera Button */}
                <Pressable
                    style={({ pressed }) => [
                        styles.controlBtn,
                        !isCameraEnabled && styles.btnDanger,
                        pressed && styles.btnPressed,
                    ]}
                    onPress={toggleCam}
                >
                    <Ionicons
                        name={isCameraEnabled ? "videocam-outline" : "videocam-off-outline"}
                        size={22}
                        color={isCameraEnabled ? "#10b981" : "#ef4444"}
                    />
                    <Text style={[styles.btnText, !isCameraEnabled && styles.textDanger]}>
                        {isCameraEnabled ? "Stop Cam" : "Start Cam"}
                    </Text>
                </Pressable>

                {/* Flip Camera Button */}
                <Pressable
                    style={({ pressed }) => [
                        styles.controlBtn,
                        pressed && styles.btnPressed,
                    ]}
                    onPress={switchCam}
                >
                    <Ionicons
                        name="camera-reverse-outline"
                        size={22}
                        color="#e2e8f0"
                    />
                    <Text style={styles.btnText}>Flip</Text>
                </Pressable>

                {/* Leave Room Button */}
                <Pressable
                    style={({ pressed }) => [
                        styles.controlBtn,
                        styles.leaveBtn,
                        pressed && styles.leaveBtnPressed,
                    ]}
                    onPress={handleleave}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={22}
                        color="#ffffff"
                    />
                    <Text style={styles.leaveBtnText}>Leave</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    floatingContainer: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
    },

    glassBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "rgba(17, 24, 39, 0.82)", // Glassmorphic background
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 15,
        elevation: 10,
        width: width - 32,
        maxWidth: 400,
    },

    controlBtn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.02)",
        height: 60,
    },

    btnDanger: {
        backgroundColor: "rgba(239, 68, 68, 0.08)",
        borderColor: "rgba(239, 68, 68, 0.2)",
    },

    btnPressed: {
        transform: [{ scale: 0.94 }],
        opacity: 0.8,
    },

    btnText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#94a3b8",
        marginTop: 4,
    },

    textDanger: {
        color: "#ef4444",
    },

    leaveBtn: {
        backgroundColor: "#ef4444",
        borderColor: "rgba(239, 68, 68, 0.4)",
    },

    leaveBtnPressed: {
        backgroundColor: "#dc2626",
        transform: [{ scale: 0.94 }],
    },

    leaveBtnText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#ffffff",
        marginTop: 4,
    },
});