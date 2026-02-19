import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MapViewComponent = ({ initialRegion, style, children }: any) => {
    return (
        <View style={[style, styles.webMapPlaceholder]}>
            <Text style={styles.placeholderText}>MapView is not supported on web yet.</Text>
            <Text style={styles.subText}>Showing data for: Lat {Math.round(initialRegion?.latitude * 100) / 100}, Lng {Math.round(initialRegion?.longitude * 100) / 100}</Text>
            {/* Risk data circles are not rendered on web in this simple placeholder */}
        </View>
    );
};

export const MapCircle = (_props: any) => {
    return null;
};

const styles = StyleSheet.create({
    webMapPlaceholder: {
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    subText: {
        fontSize: 12,
        color: '#999',
        marginTop: 8,
    }
});

export default MapViewComponent;
