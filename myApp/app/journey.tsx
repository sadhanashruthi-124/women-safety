import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import Button from '../components/Button';
import Input from '../components/Input';
import api from '../services/api';

export default function Journey() {
    // Journey State
    const [tracking, setTracking] = useState(false);
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [status, setStatus] = useState('Not Started');
    const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

    // Timer State
    const [timerActive, setTimerActive] = useState(false);
    const [timerDuration, setTimerDuration] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopTracking();
            setTimerActive(false);
        };
    }, []);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timerActive && timeLeft === 0) {
            handleTimerExpire();
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const handleTimerExpire = async () => {
        setTimerActive(false);
        try {
            await api.post('/timer-expired');
            Alert.alert('Timer Expired', 'Alerting emergency contacts!');
            router.push('/emergency');
        } catch (e) {
            Alert.alert('Timer Expired', 'Alerting emergency contacts!');
            router.push('/emergency');
        }
    };



    const extendTimer = () => {
        setTimeLeft((prev) => prev + 600); // Add 10 minutes
        Alert.alert('Extended', 'Added 10 minutes to the timer.');
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Journey Logic
    const startJourney = async () => {
        // 1. Start Timer if duration is set
        if (timerDuration.trim() !== '') {
            const minutes = parseInt(timerDuration);
            if (!isNaN(minutes) && minutes > 0) {
                setTimeLeft(minutes * 60);
                setTimerActive(true);
            } else {
                Alert.alert('Invalid Timer', 'Please enter a valid number of minutes or leave blank.');
                return;
            }
        }

        try {
            const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
            if (permStatus !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required for journey tracking.');
                return;
            }

            // Start API Journey
            await api.post('/start-journey');
            setStatus('Tracking Active');
            setTracking(true);

            // Start Location Watcher
            subscriptionRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 60000,
                    distanceInterval: 10,
                },
                (newLocation) => {
                    const { latitude, longitude, speed } = newLocation.coords;
                    setLocation(newLocation.coords);

                    // Send update to API
                    // Backend Schema: LocationUpdate(latitude, longitude, speed, timestamp)
                    api.post('/location-update', {
                        latitude,
                        longitude,
                        speed: speed || 0,
                        timestamp: newLocation.timestamp
                    }).catch(err => console.log('Location upload failed', err));
                }
            );

        } catch (error: any) {
            Alert.alert('Error', 'Could not start journey');
            console.log(error);
        }
    };

    const stopTracking = () => {
        if (subscriptionRef.current) {
            subscriptionRef.current.remove();
            subscriptionRef.current = null;
        }
    };

    const stopJourney = async () => {
        stopTracking();
        setTimerActive(false); // Stop timer
        setTimeLeft(0);
        try {
            await api.post('/stop-journey');
        } catch (e) { }

        setTracking(false);
        setStatus('Journey Ended');
        router.back();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Journey & Safety Timer</Text>

            {/* Location Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location Tracking</Text>
                <View style={styles.mapPlaceholder}>
                    <Text style={styles.mapText}>Map View</Text>
                    <View style={styles.marker}>
                        <View style={styles.markerDot} />
                    </View>
                    <Text style={styles.coords}>
                        {location ? (
                            <>
                                Lat: {location.latitude.toFixed(4)}{'\n'}
                                Lng: {location.longitude.toFixed(4)}
                            </>
                        ) : (
                            tracking ? "Acquiring location..." : "Not tracking"
                        )}
                    </Text>
                </View>

                <View style={styles.statusBox}>
                    <Text style={styles.statusLabel}>Status:</Text>
                    <Text style={[styles.statusValue, { color: tracking ? 'green' : 'red' }]}>
                        {status}
                    </Text>
                </View>
            </View>

            {/* Timer Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Safety Timer (Optional)</Text>
                {!tracking ? (
                    <View style={styles.timerInputContainer}>
                        <Input
                            placeholder="Enter minutes (e.g. 30)"
                            value={timerDuration}
                            onChangeText={setTimerDuration}
                            keyboardType="numeric"
                        />
                    </View>
                ) : (
                    timerActive && (
                        <View style={styles.activeTimerContainer}>
                            <Text style={styles.timerDisplay}>{formatTime(timeLeft)}</Text>
                            <Text style={styles.timerWarning}>Journey active. Confirm safety to stop.</Text>
                            <Button title="+ 10 Mins" onPress={extendTimer} variant="outline" style={{ marginTop: 10 }} />
                        </View>
                    )
                )}
            </View>

            {/* Main Action Button */}
            <View style={styles.actionContainer}>
                {!tracking ? (
                    <Button title="Start Journey" onPress={startJourney} />
                ) : (
                    <Button title="End Journey & Stop Timer" onPress={stopJourney} variant="danger" />
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        width: '100%',
        marginBottom: 30,
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#343a40'
    },
    mapPlaceholder: {
        width: '100%',
        height: 150,
        backgroundColor: '#e9ecef',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ced4da'
    },
    mapText: {
        color: '#adb5bd',
        fontSize: 16,
        marginBottom: 5
    },
    marker: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5
    },
    markerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF'
    },
    coords: {
        textAlign: 'center',
        fontFamily: 'monospace',
        color: '#495057',
        fontSize: 12
    },
    statusBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '600'
    },
    statusValue: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    timerInputContainer: {
        width: '100%'
    },
    activeTimerContainer: {
        alignItems: 'center',
        width: '100%'
    },
    timerDisplay: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#d63384',
        marginBottom: 5
    },
    timerWarning: {
        color: '#6c757d',
        marginBottom: 15,
        textAlign: 'center'
    },
    actionContainer: {
        width: '100%',
        marginTop: 10,
        marginBottom: 30
    }
});
