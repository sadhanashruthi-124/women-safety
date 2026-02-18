
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

export default function Emergency() {
    const pulse = new Animated.Value(1);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.2, duration: 500, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulse }] }]}>
                <Ionicons name="alert-circle" size={100} color="#fff" />
            </Animated.View>

            <Text style={styles.title}>EMERGENCY ACTIVE</Text>
            <Text style={styles.subtitle}>Alert sent to contacts and authorities.</Text>

            <View style={styles.locationBox}>
                <Text style={styles.locTitle}>Live Location Shared:</Text>
                <Text style={styles.locText}>28.6139° N, 77.2090° E</Text>
                <Text style={styles.locUpdate}>Updated: Just now</Text>
            </View>

            <Button
                title="I AM SAFE"
                onPress={() => router.replace('/home')}
                style={styles.safeButton}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DC3545',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    iconContainer: {
        marginBottom: 30
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 10,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    subtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40
    },
    locationBox: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 40
    },
    locTitle: {
        color: '#ffcccc',
        fontSize: 14,
        marginBottom: 5
    },
    locText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'monospace'
    },
    locUpdate: {
        color: '#ffcccc',
        fontSize: 12,
        fontStyle: 'italic'
    },
    safeButton: {
        backgroundColor: '#fff',
        width: '100%'
    },
});
