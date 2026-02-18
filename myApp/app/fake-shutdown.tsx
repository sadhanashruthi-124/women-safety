import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, TouchableOpacity, StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as NavigationBar from 'expo-navigation-bar';
import { router, Stack } from 'expo-router';
import api from '../services/api';

export default function FakeShutdown() {

    useEffect(() => {
        // Notify backend
        api.post('/fake-shutdown').catch(() => { });

        // Hide Status Bar and Navigation Bar
        StatusBar.setHidden(true);
        StatusBar.setBackgroundColor("#000000"); // Fail-safe for Android

        NavigationBar.setPositionAsync('absolute');
        NavigationBar.setVisibilityAsync("hidden");
        NavigationBar.setBackgroundColorAsync("#000000"); // Fail-safe
        NavigationBar.setBehaviorAsync('overlay-swipe');

        // Disable Back Button (Android)
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

        return () => {
            // Restore on exit
            backHandler.remove();
            StatusBar.setHidden(false);
            NavigationBar.setVisibilityAsync("visible");
        };
    }, []);

    const handleLongPress = () => {
        // Haptic feedback to confirm exit
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onLongPress={handleLongPress}
            delayLongPress={3000} // 3 Seconds to exit
        >
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar hidden />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'monospace',
    },
});
