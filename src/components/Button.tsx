import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Button = ({ onPress, title }: { onPress: any; title: string }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    appButtonContainer: {
        backgroundColor: '#FF953A',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    appButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center',
        textTransform: 'uppercase',
    },
});
