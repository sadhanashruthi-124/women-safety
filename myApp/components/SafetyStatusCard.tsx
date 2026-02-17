import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SafetyStatusCardProps {
    status: "safe" | "medium" | "high";
    locationText: string;
}

const SafetyStatusCard: React.FC<SafetyStatusCardProps> = ({ status, locationText }) => {
    const getStatusColor = () => {
        switch (status) {
            case "safe":
                return "#4CAF50"; // Green
            case "medium":
                return "#FFC107"; // Amber
            case "high":
                return "#F44336"; // Red
            default:
                return "#4CAF50";
        }
    };

    const getStatusText = () => {
        switch (status) {
            case "safe":
                return "YOU ARE SAFE";
            case "medium":
                return "MODERATE RISK";
            case "high":
                return "HIGH RISK";
            default:
                return "YOU ARE SAFE";
        }
    };

    return (
        <View style={[styles.card, { borderColor: getStatusColor() }]}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
            <View style={styles.textContainer}>
                <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
                <Text style={styles.locationText}>{locationText}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusIndicator: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    statusText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    locationText: {
        fontSize: 14,
        color: "#666",
    },
});

export default SafetyStatusCard;
