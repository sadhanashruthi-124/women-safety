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
import api from "../services/api";

const LoginScreen = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        if (!phone || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        try {
            await api.post('/login', { phone, password });
            console.log("Login Successful");
            router.push("/home");
        } catch (error: any) {
            console.log('Login failed', error);
            const msg = error.response?.data?.detail || "Login failed. Please check credentials and try again.";
            Alert.alert("Error", typeof msg === 'string' ? msg : JSON.stringify(msg));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SHE-GUARD</Text>
            <Text style={styles.subtitle}>Login to Your Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    linkText: {
        fontSize: 14,
        color: "#6A0DAD",
        fontWeight: "bold",
    },
});
