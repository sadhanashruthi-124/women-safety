import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons"; // Assuming vector icons are available or will be installed

interface ActionButtonProps {
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
    color: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, icon, onPress, color }) => (
    <TouchableOpacity
        style={[styles.button, { backgroundColor: color }]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

interface ActionGridProps {
    onStartJourney: () => void;
    onSafetyTimer: () => void;
    onStealthMode: () => void;
    onAreaRiskMap: () => void;
}

const ActionGrid: React.FC<ActionGridProps> = ({
    onStartJourney,
    onSafetyTimer,
    onStealthMode,
    onAreaRiskMap,
}) => {
    return (
        <View style={styles.gridContainer}>
            {/* Start Journey - Full Width or Large */}
            <View style={styles.row}>
                <TouchableOpacity
                    style={[styles.largeButton, { backgroundColor: "#6A0DAD" }]} // Purple
                    onPress={onStartJourney}
                >
                    <View style={styles.largeButtonContent}>
                        {/* Using simple text/emojis if icons fail, but preferring icons */}
                        <FontAwesome5 name="route" size={24} color="#fff" style={styles.icon} />
                        <View>
                            <Text style={styles.largeButtonTitle}>Start Journey</Text>
                            <Text style={styles.largeButtonSubtitle}>Monitored Travel</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                {/* Safety Timer */}
                <TouchableOpacity
                    style={[styles.halfButton, { backgroundColor: "#FF9800" }]} // Orange
                    onPress={onSafetyTimer}
                >
                    <Ionicons name="timer-outline" size={28} color="#fff" style={{ marginBottom: 5 }} />
                    <Text style={styles.buttonText}>Safety Timer</Text>
                </TouchableOpacity>

                {/* Stealth Mode */}
                <TouchableOpacity
                    style={[styles.halfButton, { backgroundColor: "#607D8B" }]} // Blue Grey
                    onPress={onStealthMode}
                >
                    <MaterialCommunityIcons name="incognito" size={28} color="#fff" style={{ marginBottom: 5 }} />
                    <Text style={styles.buttonText}>Stealth Mode</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                {/* Area Risk Map */}
                <TouchableOpacity
                    style={[styles.largeButton, { backgroundColor: "#E91E63", marginTop: 0 }]} // Pinkish Red
                    onPress={onAreaRiskMap}
                >
                    <View style={styles.largeButtonContent}>
                        <Ionicons name="map" size={24} color="#fff" style={styles.icon} />
                        <View>
                            <Text style={styles.largeButtonTitle}>Area Risk Map</Text>
                            <Text style={styles.largeButtonSubtitle}>View Dangerous Zones</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        width: "100%",
        paddingHorizontal: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    largeButton: {
        width: "100%",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    largeButtonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    icon: {
        marginRight: 15
    },
    largeButtonTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    largeButtonSubtitle: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 12
    },
    halfButton: {
        width: "48%",
        paddingVertical: 20,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    button: {
        flex: 1,
        margin: 5,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    iconContainer: {
        marginBottom: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default ActionGrid;
