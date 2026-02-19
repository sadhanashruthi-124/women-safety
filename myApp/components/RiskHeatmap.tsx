import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { RiskData } from '../services/RiskService';

interface RiskHeatmapProps {
    userLocation: { latitude: number; longitude: number } | null;
    riskData: RiskData[];
    showHeatmap: boolean;
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ userLocation, riskData, showHeatmap }) => {
    if (!userLocation) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading Map...</Text>
            </View>
        );
    }

    const getCircleColor = (level: string) => {
        switch (level) {
            case 'High': return 'rgba(220, 53, 69, 0.4)'; // Red
            case 'Moderate': return 'rgba(255, 193, 7, 0.4)'; // Amber
            case 'Low': return 'rgba(40, 167, 69, 0.4)'; // Green
            default: return 'rgba(128, 128, 128, 0.4)';
        }
    };

    return (
        <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
        >
            {showHeatmap && riskData.map((point) => (
                <Circle
                    key={point.id}
                    center={{ latitude: point.latitude, longitude: point.longitude }}
                    radius={800} // Increased radius for better visibility
                    fillColor={getCircleColor(point.riskLevel)}
                    strokeColor="transparent"
                />
            ))}
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RiskHeatmap;
