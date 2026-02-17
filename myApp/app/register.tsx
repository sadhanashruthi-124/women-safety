
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';

export default function Register() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Simplified preferences for MVP
    const [shareLocation, setShareLocation] = useState(true);

    const handleRegister = async () => {
        if (!phone || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            await api.post('/register', { phone, password, preferences: { shareLocation } });
            Alert.alert('Success', 'OTP Sent to your phone');
            router.push({ pathname: '/otp', params: { phone } });
        } catch (error) {
            Alert.alert('Error', 'Registration failed');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Register</Text>

            <Input placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Input placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

            <Button title="Register" onPress={handleRegister} style={{ marginTop: 20 }} />

            <Button
                title="Already have an account? Login"
                onPress={() => router.push('/login')}
                variant="outline"
                style={{ marginTop: 10 }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
});
