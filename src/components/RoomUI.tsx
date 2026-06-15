import { isTrackReference, TrackReferenceOrPlaceholder, useTracks, VideoTrack } from "@livekit/react-native";
import { Track } from "livekit-client";
import { FlatList, Text, View, Dimensions, StyleSheet } from "react-native";
import ControlBar from "./sessionComponents/ControlBar";
const {width} = Dimensions.get('window');

export default function RoomUI(){
    const tracks = useTracks([
        { source: Track.Source.Camera, withPlaceholder: true },
    ]);

    const renderItem = ({ item }: { item: TrackReferenceOrPlaceholder }) => {
        if (!isTrackReference(item)) {
            return <View style={styles.tilePlaceholder} />;
        }

        return (
            <View style={styles.tile}>
                <VideoTrack trackRef={item} style={styles.video} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Live Session</Text>
            </View>

            {/* VIDEO GRID */}
            <FlatList
                data={tracks}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={styles.grid}
            />

            {/* CONTROLS */}
            <ControlBar/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0b0b0b",
    },

    header: {
        paddingTop: 50,
        paddingBottom: 10,
        alignItems: "center",
    },

    headerText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },

    grid: {
        padding: 6,
    },

    tile: {
        flex: 1,
        margin: 4,
        height: width / 2,
        backgroundColor: "#1c1c1c",
        borderRadius: 12,
        overflow: "hidden",
    },

    tilePlaceholder: {
        flex: 1,
        margin: 4,
        height: width / 2,
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
    },

    video: {
        flex: 1,
        width: "100%",
        height: "100%",
    },

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