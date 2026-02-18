
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, LayoutAnimation } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    style?: any;
}

export default function Button({ title, onPress, variant = 'primary', style }: ButtonProps) {
    let backgroundColor = '#007AFF';
    let textColor = '#FFFFFF';
    let borderColor = 'transparent';

    switch (variant) {
        case 'secondary':
            backgroundColor = '#6c757d';
            break;
        case 'danger':
            backgroundColor = '#DC3545';
            break;
        case 'outline':
            backgroundColor = 'transparent';
            textColor = '#007AFF';
            borderColor = '#007AFF';
            break;
    }

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor, borderColor, borderWidth: variant === 'outline' ? 1 : 0 },
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1, // Fix for android sometimes
        marginVertical: 5,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
