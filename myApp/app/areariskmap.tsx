
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import RiskHeatmap from '../components/RiskHeatmap';
import { getRiskData } from '../services/RiskService';

export default function AreaRiskMap() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [riskData, setRiskData] = useState<any[]>([]);
    const [showHeatmap, setShowHeatmap] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);

            // Generate mock risk data around user
            const data = getRiskData(loc.coords.latitude, loc.coords.longitude);
            setRiskData(data);
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Area Risk Map', headerBackTitle: 'Back' }} />

            {location ? (
                <RiskHeatmap
                    userLocation={location.coords}
                    riskData={riskData}
                    showHeatmap={showHeatmap}
                />
            ) : (
                <View style={styles.loading}>
                    <Text>Locating...</Text>
                </View>
            )}

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.button, showHeatmap && styles.activeButton]}
                    onPress={() => setShowHeatmap(!showHeatmap)}
                >
                    <Ionicons name="map" size={24} color={showHeatmap ? "#fff" : "#333"} />
                    <Text style={[styles.buttonText, showHeatmap && styles.activeText]}>
                        {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    activeButton: {
        backgroundColor: '#DC3545',
    },
    buttonText: {
        marginLeft: 8,
        fontWeight: '600',
        color: '#333',
    },
    activeText: {
        color: '#fff',
    }
});
