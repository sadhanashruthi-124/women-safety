import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Animated } from "react-native";

interface SOSButtonProps {
    onPress: () => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View style={styles.innerCircle}>
                    <Text style={styles.text}>SOS</Text>
                    <Text style={styles.subText}>PRESS FOR HELP</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 30,
    },
    button: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "#FF0000", // Urgent Red
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#FF0000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        borderWidth: 8,
        borderColor: "#FFCCCC",
    },
    innerCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: "#D32F2F",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#FF6666",
    },
    text: {
        fontSize: 48,
        fontWeight: "900",
        color: "#fff",
        letterSpacing: 2,
    },
    subText: {
        fontSize: 12,
        color: "#fff",
        marginTop: 5,
        fontWeight: "bold",
    },
});

export default SOSButton;
