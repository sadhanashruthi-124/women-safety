import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Link } from "expo-router";

const RegistrationScreen = (): JSX.Element => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        console.log("Name:", name);
        console.log("Phone:", phone);
        console.log("Password:", password);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SHE-GUARD</Text>
            <Text style={styles.subtitle}>Create Your Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={(text) => setName(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text) => setPhone(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Link href="/login" asChild>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Login</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
};

export default RegistrationScreen;

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
