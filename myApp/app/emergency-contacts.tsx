
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { router } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';

interface Contact {
    id: string;
    name: string;
    phone: string;
}

export default function EmergencyContacts() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [contacts, setContacts] = useState<Contact[]>([]);

    const addContact = () => {
        if (!name || !phone) return;
        const newContact = { id: Date.now().toString(), name, phone };
        setContacts([...contacts, newContact]);
        setName('');
        setPhone('');
    };

    const handleSave = async () => {
        if (contacts.length === 0) {
            Alert.alert('Error', 'Please add at least one contact');
            return;
        }
        try {
            await api.post('/emergency-contacts', { contacts });
            Alert.alert('Success', 'Contacts saved!');
            router.replace('/home');
        } catch (error) {
            Alert.alert('Error', 'Failed to save contacts');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Emergency Contacts</Text>
            <Text style={styles.subtitle}>Add trusted contacts for SOS alerts.</Text>

            <View style={styles.form}>
                <Input placeholder="Name" value={name} onChangeText={setName} />
                <Input placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                <Button title="Add Contact" onPress={addContact} variant="secondary" />
            </View>

            <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Your Contacts ({contacts.length})</Text>
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.contactItem}>
                            <Text style={styles.contactName}>{item.name}</Text>
                            <Text style={styles.contactPhone}>{item.phone}</Text>
                        </View>
                    )}
                />
            </View>

            <Button title="Save & Continue" onPress={handleSave} style={{ marginTop: 20 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    form: {
        marginBottom: 20,
    },
    listContainer: {
        flex: 1,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    contactItem: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contactName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    contactPhone: {
        color: '#666',
    },
});
