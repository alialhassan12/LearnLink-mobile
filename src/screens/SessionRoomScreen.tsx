import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    Dimensions,
} from "react-native";

import {
    LiveKitRoom,
    useTracks,
    VideoTrack,
    TrackReferenceOrPlaceholder,
    isTrackReference,
    useLocalParticipant,
} from "@livekit/react-native";

import { Track } from "livekit-client";
import { AudioSession } from "@livekit/react-native";
import RoomUI from "../components/RoomUI";

type Props = {
    serverUrl: string;
    token: string;
    onLeave?: () => void;
};

export default function SessionRoomScreen({ serverUrl, token }: Props) {
    useEffect(() => {
        AudioSession.startAudioSession();
        return () => {
            AudioSession.stopAudioSession();
        };
    }, []);

    return (
        <LiveKitRoom
            serverUrl={serverUrl}
            token={token}
            connect={true}
            audio={true}
            video={true}
        >
            <RoomUI />
        </LiveKitRoom>
    );
}