import {
    isTrackReference,
    TrackReferenceOrPlaceholder,
    useTracks,
    VideoTrack,
    useParticipants,
} from "@livekit/react-native";
import { Track } from "livekit-client";
import { useMemo } from "react";
import { FlatList, Text, View, Dimensions, StyleSheet, Image } from "react-native";
import ControlBar from "./sessionComponents/ControlBar";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../store/authStore";

const { width, height } = Dimensions.get("window");

export default function RoomUI() {
    const {authUser}=useAuthStore();
    const participants = useParticipants();

    // Query camera tracks (with placeholders for participants whose camera is off)
    const cameraTracks = useTracks([
        { source: Track.Source.Camera, withPlaceholder: true },
    ]);

    // Query active screenshare tracks only (no placeholders)
    const screenShareTracks = useTracks([
        { source: Track.Source.ScreenShare, withPlaceholder: false },
    ]);

    // Merge tracks dynamically to prevent hook conflicts in livekit-components
    const videoTracks = useMemo(() => {
        return [...cameraTracks, ...screenShareTracks];
    }, [cameraTracks, screenShareTracks]);

    // Determine layout based on active video tracks count (including screen share)
    const numColumns = videoTracks.length <= 1 ? 1 : 2;
    const tileHeight = useMemo(() => {
        if (videoTracks.length <= 1) return height - 180;
        if (videoTracks.length <= 2) return (height - 220) / 2;
        return (height - 240) / 3;
    }, [videoTracks.length]);

    const renderItem = ({ item }: { item: TrackReferenceOrPlaceholder }) => {
        const participantName =
            item.participant?.name || item.participant?.identity || "Unknown";

        const isScreenShare = item.source === Track.Source.ScreenShare;
        const displayName = isScreenShare
            ? `${participantName}'s Screen`
            : participantName;

        const isSpeaking = item.participant?.isSpeaking;
        const isMuted = !item.participant?.isMicrophoneEnabled;

        // Check if the participant's camera is disabled or if the track publication is muted
        const isCameraOff =
            item.source === Track.Source.Camera &&
            (!item.participant?.isCameraEnabled || item.publication?.isMuted);

        if (!isTrackReference(item) || isCameraOff) {
            return (
                <View
                    style={[
                        styles.tile,
                        { height: tileHeight },
                        isSpeaking && styles.tileSpeaking,
                    ]}
                >
                    <View style={styles.placeholderContent}>
                        <View
                            style={[
                                styles.avatarCircle,
                                isSpeaking && styles.avatarSpeaking,
                            ]}
                        >
                            {item.participant?.name?(
                                <Text style={styles.nameText}>{item.participant.name.charAt(0)}</Text>
                            ):(
                                <Ionicons name="person" size={32} color="#94a3b8" />
                            )}
                        </View>
                        <Text style={styles.participantName}>{displayName}</Text>
                        {/* <Text style={styles.cameraOffLabel}>Camera Off</Text> */}
                    </View>

                    {/* Mute badge on top-right */}
                    {isMuted && (
                        <View style={styles.muteBadge}>
                            <Ionicons name="mic-off" size={12} color="#f87171" />
                        </View>
                    )}
                </View>
            );
        }

        return (
            <View
                style={[
                    styles.tile,
                    { height: tileHeight },
                    isSpeaking && styles.tileSpeaking,
                ]}
            >
                <VideoTrack
                    trackRef={item}
                    style={styles.video}
                    objectFit={isScreenShare ? "contain" : "cover"}
                />

                {/* Speaker Border / Accent */}
                {isSpeaking && <View style={styles.speakingBorder} />}

                {/* Badges and details */}
                <View style={styles.nameOverlay}>
                    <View style={styles.nameBadge}>
                        {isSpeaking && (
                            <View style={styles.speakingIndicator}>
                                <View style={[styles.speakingDot, styles.speakingDot1]} />
                                <View style={[styles.speakingDot, styles.speakingDot2]} />
                            </View>
                        )}
                        <Text style={styles.nameText}>{displayName}</Text>
                    </View>
                </View>

                {/* Mute badge on top-right */}
                {isMuted && (
                    <View style={styles.muteBadge}>
                        <Ionicons name="mic-off" size={12} color="#f87171" />
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.liveDot} />
                    <Text style={styles.headerText}>Live Session</Text>
                </View>
                <View style={styles.participantBadge}>
                    <Ionicons name="people" size={14} color="#60a5fa" />
                    <Text style={styles.participantCount}>
                        {participants.length} Active
                    </Text>
                </View>
            </View>

            {/* VIDEO GRID */}
            <FlatList
                key={numColumns}
                data={videoTracks}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                numColumns={numColumns}
                contentContainerStyle={styles.grid}
                style={styles.gridContainer}
            />

            {/* CONTROLS */}
            <ControlBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#090d16", // Premium dark space color
    },

    header: {
        paddingTop: 54,
        paddingBottom: 14,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(9, 13, 22, 0.9)",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.05)",
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#ef4444", // Red live indicator
        shadowColor: "#ef4444",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },

    headerText: {
        color: "#f8fafc",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.5,
    },

    participantBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(96, 165, 250, 0.12)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(96, 165, 250, 0.2)",
    },

    participantCount: {
        color: "#60a5fa",
        fontSize: 12,
        fontWeight: "600",
    },

    gridContainer: {
        flex: 1,
    },

    grid: {
        padding: 8,
        paddingBottom: 120, // Allow space for absolute floating ControlBar
        flexGrow: 1,
    },

    tile: {
        flex: 1,
        margin: 6,
        backgroundColor: "#111827", // Charcoal/slate tile
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1.5,
        borderColor: "rgba(255, 255, 255, 0.06)",
        position: "relative",
    },

    tileSpeaking: {
        borderColor: "#10b981", // Emerald speaking glow
        shadowColor: "#10b981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },

    speakingBorder: {
        ...StyleSheet.absoluteFill,
        borderWidth: 2,
        borderColor: "#10b981",
        borderRadius: 18,
        pointerEvents: "none",
    },

    placeholderContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },

    avatarCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: "#1f2937",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        objectFit: "cover",
    },

    avatarSpeaking: {
        borderColor: "#10b981",
        borderWidth: 2,
        backgroundColor: "#065f46",
    },

    participantName: {
        color: "#f3f4f6",
        fontSize: 13,
        fontWeight: "600",
    },

    cameraOffLabel: {
        color: "#6b7280",
        fontSize: 11,
    },

    video: {
        flex: 1,
        width: "100%",
        height: "100%",
    },

    nameOverlay: {
        position: "absolute",
        bottom: 10,
        left: 10,
        right: 10,
    },

    nameBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
        gap: 6,
    },

    nameText: {
        color: "#f3f4f6",
        fontSize: 11,
        fontWeight: "600",
    },

    speakingIndicator: {
        flexDirection: "row",
        alignItems: "flex-end",
        height: 10,
        gap: 2,
    },

    speakingDot: {
        width: 3,
        backgroundColor: "#10b981",
        borderRadius: 1.5,
    },

    speakingDot1: {
        height: 8,
    },

    speakingDot2: {
        height: 5,
    },

    muteBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        padding: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(239, 68, 68, 0.4)",
    },
});