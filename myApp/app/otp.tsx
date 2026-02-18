
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';

export default function OTP() {
    const { phone } = useLocalSearchParams();
    const [otp, setOtp] = useState('');

    const handleVerify = async () => {
        if (!otp) {
            Alert.alert('Error', 'Please enter OTP');
            return;
        }

        try {
            await api.post('/verify-otp', { phone, otp });
            Alert.alert('Success', 'Phone verified! Please login.');
            router.replace('/login');
        } catch (error) {
            Alert.alert('Error', 'Invalid OTP');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>Sent to {phone}</Text>

            <Input placeholder="1234" value={otp} onChangeText={setOtp} keyboardType="numeric" />

            <Button title="Verify" onPress={handleVerify} style={{ marginTop: 20 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
});
