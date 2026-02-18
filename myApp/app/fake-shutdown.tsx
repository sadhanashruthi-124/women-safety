import React, { useEffect, useRef } from 'react';
import { StyleSheet, BackHandler, TouchableOpacity, Platform, AppState } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar, setStatusBarHidden } from 'expo-status-bar';
import { router, Stack } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import api from '../services/api';

export default function FakeShutdown() {
    useKeepAwake(); // Prevent screen from sleeping

    const appState = useRef(AppState.currentState);

    useEffect(() => {
        // Notify backend
        api.post('/fake-shutdown').catch(() => { });

        const enableImmersiveMode = async () => {
            // Hide Status Bar
            setStatusBarHidden(true, 'none');

            // Hide Navigation Bar (Android)
            if (Platform.OS === 'android') {
                try {
                    await NavigationBar.setVisibilityAsync("hidden");
                    await NavigationBar.setBehaviorAsync("overlay-swipe");
                    await NavigationBar.setBackgroundColorAsync("#000000");
                } catch (e) {
                    console.log("Failed to hide navigation bar", e);
                }
            }
        };

        enableImmersiveMode();

        // Re-apply on foreground
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                enableImmersiveMode();
            }
            appState.current = nextAppState;
        });

        // Disable Back Button (Android)
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

        return () => {
            // Restore on exit
            subscription.remove();
            backHandler.remove();
            setStatusBarHidden(false, 'slide');
            if (Platform.OS === 'android') {
                NavigationBar.setVisibilityAsync("visible");
            }
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
            <StatusBar style="light" hidden={true} backgroundColor="#000000" />
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
