<<<<<<< HEAD
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";

const LoginScreen = (): JSX.Element => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const router = useRouter();

    // Dummy OTP for testing
    const DUMMY_OTP = "1234";

    const handleSendOtp = () => {
        if (phoneNumber.length < 10) {
            Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
            return;
        }
        // Simulate sending OTP
        setIsOtpSent(true);
        Alert.alert("OTP Sent", `A verification code has been sent to your phone.\n\nFor testing, use OTP: ${DUMMY_OTP}`);
    };

    const handleVerifyOtp = () => {
        if (otp.length !== 4) {
            Alert.alert("Invalid OTP", "Please enter a valid 4-digit OTP.");
            return;
        }

        // Verify against dummy OTP
        if (otp === DUMMY_OTP) {
            // Navigate directly to dashboard on success
            router.push("/dashboard");
        } else {
            Alert.alert("Invalid OTP", "The OTP you entered is incorrect. Please try again.");
=======

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';

export default function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!phone || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            await api.post('/login', { phone, password });
            // In a real app, save token here
            router.replace('/home');
        } catch (error) {
            Alert.alert('Error', 'Login failed');
>>>>>>> ee8fb7dece66f4287f9ed2855d0dc25d29f1dbd6
        }
    };

    return (
        <View style={styles.container}>
<<<<<<< HEAD
            <Text style={styles.title}>SHE-GUARD</Text>
            <Text style={styles.subtitle}>
                {isOtpSent ? "Enter Verification Code" : "Login to Your Account"}
            </Text>

            {!isOtpSent ? (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        maxLength={10}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
                        <Text style={styles.buttonText}>Send OTP</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.otpHint}>💡 Test OTP: 1234</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter OTP"
                        keyboardType="number-pad"
                        value={otp}
                        onChangeText={setOtp}
                        maxLength={4}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                        <Text style={styles.buttonText}>Verify & Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsOtpSent(false)} style={styles.linkButton}>
                        <Text style={styles.linkText}>Change Phone Number</Text>
                    </TouchableOpacity>
                </>
            )}

            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Link href="/register" asChild>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Register</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
};

export default LoginScreen;
=======
            <Text style={styles.title}>Welcome Back</Text>

            <Input placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

            <Button title="Login" onPress={handleLogin} style={{ marginTop: 20 }} />

            <Button
                title="New User? Register"
                onPress={() => router.push('/register')}
                variant="outline"
                style={{ marginTop: 10 }}
            />
        </View>
    );
}
>>>>>>> ee8fb7dece66f4287f9ed2855d0dc25d29f1dbd6

const styles = StyleSheet.create({
    container: {
        flex: 1,
<<<<<<< HEAD
        backgroundColor: "#f5f7fa",
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "#6A0DAD",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 30,
        color: "#555",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#fff",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#6A0DAD",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
        color: "#555",
    },
    linkButton: {
        marginTop: 15,
        alignItems: 'center'
    },
    linkText: {
        fontSize: 14,
        color: "#6A0DAD",
        fontWeight: "bold",
    },
    otpHint: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 10,
        backgroundColor: "#fff3cd",
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ffc107",
=======
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#333',
>>>>>>> ee8fb7dece66f4287f9ed2855d0dc25d29f1dbd6
    },
});
