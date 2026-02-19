import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import SafetyStatusCard from "../components/SafetyStatusCard";
import SOSButton from "../components/SOSButton";
import ActionGrid from "../components/ActionGrid";

const Dashboard = () => {
    const router = useRouter();
    const [safetyStatus, setSafetyStatus] = useState<"safe" | "medium" | "high">("safe");
    const [locationText, setLocationText] = useState("Home - 123 Safe St, City");

    const handleSOS = () => {
        Alert.alert(
            "EMERGENCY SOS",
            "SOS Triggered! Sending alerts to emergency contacts and police.",
            [
                { text: "Cancel", style: "cancel", onPress: () => console.log("SOS Cancelled") },
                { text: "CONFIRM", style: "destructive", onPress: () => console.log("SOS Sent") }
            ]
        );
    };

    const handleStartJourney = () => {
        Alert.alert("Journey Started", "Route monitoring activated.");
        // router.push("/journey");
    };

    const handleSafetyTimer = () => {
        Alert.alert("Safety Timer", "Configure your check-in timer.");
        // router.push("/timer");
    };

    const handleStealthMode = () => {
        Alert.alert("Stealth Mode", "App entered fake shutdown mode.");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello, Sadhana</Text>
                    <Text style={styles.subGreeting}>Your safety is active.</Text>
                </View>

                {/* Safety Status Card */}
                <SafetyStatusCard status={safetyStatus} locationText={locationText} />

                {/* SOS Button - Central & Prominent */}
                <SOSButton onPress={handleSOS} />

                {/* Action Grid */}
                <ActionGrid
                    onStartJourney={handleStartJourney}
                    onSafetyTimer={handleSafetyTimer}
                    onStealthMode={handleStealthMode}
                />

                <View style={{ marginTop: 20, width: '100%' }}>
                    <TouchableOpacity
                        style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 2 }}
                        onPress={() => router.push('/areariskmap')}
                    >
                        <Text style={{ fontWeight: 'bold', color: '#DC3545' }}>View Risk Heatmap</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>SHE-GUARD Active</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f5f7fa",
    },
    container: {
        padding: 20,
        paddingBottom: 40,
        alignItems: "center", // Center SOS button
    },
    header: {
        width: "100%",
        marginBottom: 20,
        marginTop: 10,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    subGreeting: {
        fontSize: 16,
        color: "#666",
        marginTop: 4,
    },
    footer: {
        marginTop: 30,
        alignItems: "center",
    },
    footerText: {
        color: "#999",
        fontSize: 12,
    },
});

export default Dashboard;
