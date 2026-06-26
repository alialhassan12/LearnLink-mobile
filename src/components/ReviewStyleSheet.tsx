import { StyleSheet } from "react-native";

const reviewStyles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        gap: 4,
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: -0.3,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 4,
    },
    divider: {
        height: 1,
        marginVertical: 8,
    },
    starsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },
    ratingLabel: {
        marginLeft: 8,
        fontWeight: "700",
        fontSize: 13,
    },
    reviewTextBox: {
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
    },
    reviewItalic: {
        fontSize: 12,
        fontStyle: "italic",
        lineHeight: 18,
    },
    noCommentText: {
        fontSize: 12,
        fontStyle: "italic",
    },
    submittedBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#d1fae5",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: "#a7f3d0",
    },
    submittedBadgeText: {
        color: "#059669",
        fontWeight: "700",
        fontSize: 11,
    },
    inputLabel: {
        fontWeight: "700",
        fontSize: 12,
        marginBottom: 6,
    },
    ratingHint: {
        fontSize: 11,
        fontWeight: "600",
        marginTop: -2,
        marginBottom: 4,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
        fontSize: 12,
        minHeight: 90,
        marginBottom: 12,
    },
    submitButton: {
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 14,
    },
});

export default reviewStyles;