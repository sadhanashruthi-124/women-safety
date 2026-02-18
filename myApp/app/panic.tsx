
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

import { Audio } from 'expo-av';

export default function Panic() {
    const [isListening, setIsListening] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);

    const toggleListening = async () => {
        if (isListening) {
            // Stop and Send
            setIsListening(false);
            if (recording) {
                try {
                    await recording.stopAndUnloadAsync();
                    const uri = recording.getURI();

                    if (uri) {
                        const formData = new FormData();
                        formData.append('audio', {
                            uri,
                            name: 'panic.m4a',
                            type: 'audio/m4a',
                        } as any);

                        await api.post('/panic-detected', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        Alert.alert("Sent!", "Audio recorded and sent to emergency contacts.");
                    }
                } catch (error) {
                    console.log('Failed to send audio', error);
                    Alert.alert("Error", "Failed to send panic audio.");
                }
                setRecording(null);
            }
        } else {
            // Start Recording
            try {
                const { status } = await Audio.requestPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Microphone permission is required.');
                    return;
                }

                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { recording: newRecording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );

                setRecording(newRecording);
                setIsListening(true);
            } catch (err) {
                console.error('Failed to start recording', err);
                Alert.alert("Error", "Could not start audio recording.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Panic Detection</Text>
            <Text style={styles.subtitle}>
                {isListening
                    ? "Recording audio and monitoring..."
                    : "Activate to start recording audio and alerting contacts."}
            </Text>

            <View style={[styles.visualizer, isListening && styles.activeVisualizer]}>
                <Ionicons name="mic" size={80} color={isListening ? "#fff" : "#ccc"} />
            </View>

            <TouchableOpacity
                style={[styles.button, isListening ? styles.activeButton : styles.inactiveButton]}
                onPress={toggleListening}
            >
                <Text style={styles.buttonText}>
                    {isListening ? "Stop & Send" : "Activate Panic Mode"}
                </Text>
            </TouchableOpacity>

            {isListening && <Text style={styles.hint}>Recording in progress...</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 40,
    },
    visualizer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 2,
        borderColor: '#eee'
    },
    activeVisualizer: {
        backgroundColor: '#ff4444',
        borderColor: '#cc0000'
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        width: '80%',
        alignItems: 'center',
    },
    inactiveButton: {
        backgroundColor: '#007AFF'
    },
    activeButton: {
        backgroundColor: '#666'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    hint: {
        marginTop: 20,
        color: '#FF9800',
        fontStyle: 'italic'
    }
});
