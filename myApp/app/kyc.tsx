import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { analyzeAadhaar, AnalysisResult } from '../services/KycService';

const KycScreen = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string } | null>(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                setSelectedFile({ uri: file.uri, name: file.name });
            }
        } catch (err) {
            console.error('Error picking document:', err);
            Alert.alert('Error', 'Failed to pick document');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            Alert.alert('Selection Required', 'Please select an Aadhaar document first.');
            return;
        }

        setLoading(true);
        try {
            const result: AnalysisResult = await analyzeAadhaar(selectedFile.uri, selectedFile.name);

            if (result.approved) {
                Alert.alert('KYC Successful', result.message, [
                    { text: 'Back to Registration', onPress: () => router.push({ pathname: '/register', params: { kycStatus: 'verified' } }) }
                ]);
            } else {
                Alert.alert('KYC Rejected', result.message, [
                    { text: 'OK', onPress: () => router.push('/login') } // Redirect to login or home if rejected
                ]);
            }
        } catch (err) {
            console.error('Error analyzing Aadhaar:', err);
            Alert.alert('Error', 'An error occurred during analysis. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>KYC Verification</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.instruction}>Please upload your Aadhaar (PDF or Photo)</Text>
                <Text style={styles.subInstruction}>Only female users are permitted to register for She-Guard.</Text>

                <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
                    <Ionicons name="cloud-upload-outline" size={48} color="#6A0DAD" />
                    <Text style={styles.uploadText}>
                        {selectedFile ? selectedFile.name : 'Select Aadhaar Document'}
                    </Text>
                </TouchableOpacity>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6A0DAD" />
                        <Text style={styles.loadingText}>Analyzing gender...</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.button, !selectedFile && styles.buttonDisabled]}
                        onPress={handleUpload}
                        disabled={!selectedFile}
                    >
                        <Text style={styles.buttonText}>Submit for Verification</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default KycScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    instruction: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    subInstruction: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    uploadBox: {
        width: '100%',
        height: 150,
        borderWidth: 2,
        borderColor: '#6A0DAD',
        borderStyle: 'dashed',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F0FF',
        marginBottom: 30,
        padding: 20,
    },
    uploadText: {
        marginTop: 10,
        color: '#6A0DAD',
        fontSize: 14,
        textAlign: 'center',
    },
    button: {
        width: '100%',
        backgroundColor: '#6A0DAD',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
});
