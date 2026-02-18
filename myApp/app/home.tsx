
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import api from '../services/api';

export default function Home() {
    const handleSOS = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location is needed for SOS.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            await api.post('/trigger-sos', {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
            router.push('/emergency');
        } catch (error) {
            console.log(error);
            router.push('/emergency'); // Navigate anyway
        }
    };

    const menuItems = [
        { title: 'Journey & Timer', icon: 'navigate', route: '/journey', color: '#4CAF50' },
        { title: 'Fake Shutdown', icon: 'power', route: '/fake-shutdown', color: '#212121' },
        { title: 'Panic Mode', icon: 'warning', route: '/panic', color: '#E91E63' },
        { title: 'Area Risk Map', icon: 'map', route: '/areariskmap', color: '#FF9800' },
    ] as const;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Safety Dashboard</Text>

            <TouchableOpacity style={styles.sosButton} onPress={handleSOS} onLongPress={() => Alert.alert("SOS Triggered")}>
                <Text style={styles.sosText}>SOS</Text>
                <Text style={styles.sosSubText}>TAP FOR HELP</Text>
            </TouchableOpacity>

            <View style={styles.grid}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.card, { borderColor: item.color }]}
                        onPress={() => router.push(item.route)}
                    >
                        <Ionicons name={item.icon as any} size={32} color={item.color} />
                        <Text style={[styles.cardTitle, { color: item.color }]}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity onPress={() => router.replace('/login')} style={styles.logout}>
                <Text style={{ color: '#666' }}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 20,
    },
    sosButton: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#DC3545',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        elevation: 10,
        shadowColor: '#DC3545',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderWidth: 5,
        borderColor: '#ffebec'
    },
    sosText: {
        fontSize: 40,
        fontWeight: '900',
        color: '#fff',
    },
    sosSubText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginTop: 5,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    card: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        elevation: 2,
    },
    cardTitle: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 14,
    },
    logout: {
        marginTop: 20
    }
});
