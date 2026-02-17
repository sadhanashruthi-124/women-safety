
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
    }
  };

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
});