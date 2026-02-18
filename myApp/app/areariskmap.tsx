import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { getRiskData, RiskData } from "../services/RiskService";

const AreaRiskMapScreen = () => {
    const router = useRouter();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [riskData, setRiskData] = useState<RiskData[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            // Fetch mock risk data based on current location
            const data = getRiskData(currentLocation.coords.latitude, currentLocation.coords.longitude);
            setRiskData(data);
            setLoading(false);
        })();
    }, []);

    const getCircleColor = (level: string) => {
        switch (level) {
            case 'High': return 'rgba(255, 0, 0, 0.4)'; // Red
            case 'Moderate': return 'rgba(255, 165, 0, 0.4)'; // Orange
            case 'Low': return 'rgba(0, 255, 0, 0.4)'; // Green
            default: return 'rgba(128, 128, 128, 0.4)';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Area Risk Map</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#6A0DAD" />
                    <Text style={styles.loadingText}>Fetching Location & Risk Data...</Text>
                </View>
            ) : errorMsg ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            ) : (
                <View style={styles.mapContainer}>
                    {location && (
                        <MapView
                            style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            showsUserLocation={true}
                            followsUserLocation={true}
                        >
                            {riskData.map((point) => (
                                <Circle
                                    key={point.id}
                                    center={{ latitude: point.latitude, longitude: point.longitude }}
                                    radius={500}
                                    fillColor={getCircleColor(point.riskLevel)}
                                    strokeColor="transparent"
                                />
                            ))}
                        </MapView>
                    )}

                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.dot, { backgroundColor: 'rgba(255, 0, 0, 0.6)' }]} />
                            <Text style={styles.legendText}>High Risk</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.dot, { backgroundColor: 'rgba(255, 165, 0, 0.6)' }]} />
                            <Text style={styles.legendText}>Moderate</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.dot, { backgroundColor: 'rgba(0, 255, 0, 0.6)' }]} />
                            <Text style={styles.legendText}>Low Risk</Text>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default AreaRiskMapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        zIndex: 10,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    },
    errorText: {
        color: "red",
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    legend: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: 10,
        borderRadius: 10,
        elevation: 5,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        fontSize: 12,
        color: "#333",
    },
});
