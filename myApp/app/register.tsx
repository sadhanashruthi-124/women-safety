import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import api from "../services/api";

interface Contact {
    id: number;
    name: string;
    phone: string;
    relationship: string;
}

const RegistrationScreen = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    // Initializing with 2 empty contacts as required (2-3 people)
    const [contacts, setContacts] = useState<Contact[]>([
        { id: 1, name: "", phone: "", relationship: "" },
        { id: 2, name: "", phone: "", relationship: "" },
    ]);

    const handleContactChange = (id: number, field: keyof Contact, value: string) => {
        const updatedContacts = contacts.map((contact) =>
            contact.id === id ? { ...contact, [field]: value } : contact
        );
        setContacts(updatedContacts);
    };

    const addContact = () => {
        if (contacts.length < 3) {
            setContacts([
                ...contacts,
                { id: contacts.length + 1, name: "", phone: "", relationship: "" },
            ]);
        } else {
            Alert.alert("Limit Reached", "You can add a maximum of 3 emergency contacts.");
        }
    };

    const removeContact = (id: number) => {
        if (contacts.length > 2) {
            setContacts(contacts.filter(c => c.id !== id));
        } else {
            Alert.alert("Minimum Contacts", "You must have at least 2 emergency contacts.");
        }
    };

    const handleRegister = async () => {
        // Basic validation
        if (!name || !phone || !password) {
            Alert.alert("Error", "Please fill in all personal details.");
            return;
        }

        const validContacts = contacts.filter(c => c.name && c.phone);
        if (validContacts.length < 2) {
            Alert.alert("Error", "Please provide at least 2 emergency contacts with Name and Phone.");
            return;
        }

        try {
            // 1. Register User
            await api.post('/register', {
                name,
                phone,
                password,
                preferences: {} // Optional
            });

            // 2. Save Contacts (fire and forget or wait, usually wait)
            // The backend endpoint for contacts currently just prints them, but we should send them.
            // Adjust payload to match schema: { contacts: [{ name, phone, id? }] }
            const contactsPayload = validContacts.map(c => ({
                name: c.name,
                phone: c.phone
            }));

            await api.post('/emergency-contacts', {
                user_phone: phone, // Link contacts to this user
                contacts: contactsPayload
            });

            // 3. Navigate to OTP
            // Pass phone to OTP screen for verification context
            router.push({ pathname: "/otp", params: { phone } });

        } catch (error: any) {
            console.log('Registration error:', error);
            const msg = error.response?.data?.detail || "Registration failed. Please try again.";
            Alert.alert("Error", typeof msg === 'string' ? msg : JSON.stringify(msg));
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>SHE-GUARD</Text>
                <Text style={styles.subtitle}>Create Your Account</Text>

                <Text style={styles.sectionHeader}>Personal Details</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                />

                {/* Email removed as per request */}

                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <Text style={styles.sectionHeader}>Trusted Emergency Contacts (2-3)</Text>
                {contacts.map((contact, index) => (
                    <View key={contact.id} style={styles.contactContainer}>
                        <Text style={styles.contactTitle}>Contact {index + 1}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={contact.name}
                            onChangeText={(text) => handleContactChange(contact.id, "name", text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            value={contact.phone}
                            onChangeText={(text) => handleContactChange(contact.id, "phone", text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Relationship (Optional)"
                            value={contact.relationship}
                            onChangeText={(text) => handleContactChange(contact.id, "relationship", text)}
                        />
                        {contacts.length > 2 && (
                            <TouchableOpacity onPress={() => removeContact(contact.id)} style={styles.removeButton}>
                                <Text style={styles.removeButtonText}>Remove</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                {contacts.length < 3 && (
                    <TouchableOpacity style={styles.addButton} onPress={addContact}>
                        <Text style={styles.addButtonText}>+ Add Another Contact</Text>
                    </TouchableOpacity>
                )}

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
        </ScrollView>
    );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: "#f5f7fa",
        paddingVertical: 20,
    },
    container: {
        flex: 1,
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
        marginBottom: 20,
        color: "#555",
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 15,
        marginBottom: 10,
        color: "#333",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    contactContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#eee",
    },
    contactTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#6A0DAD",
    },
    addButton: {
        paddingVertical: 10,
        alignItems: "center",
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#6A0DAD",
        borderRadius: 10,
        borderStyle: "dashed",
    },
    addButtonText: {
        color: "#6A0DAD",
        fontWeight: "bold",
    },
    removeButton: {
        marginTop: 5,
        alignItems: "flex-end",
    },
    removeButtonText: {
        color: "red",
        fontSize: 12,
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
        marginBottom: 20,
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
