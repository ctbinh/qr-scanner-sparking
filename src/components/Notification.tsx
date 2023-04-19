import { StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { NotifMessage, NotifType } from '../constant/notification';

const Notification = ({ type, message }: { type: NotifType; message: NotifMessage }) => {
    return (
        <View style={styles.container}>
            <BlurView intensity={100} tint="dark" style={styles.box}>
                <View style={styles.icon}>
                    {type === NotifType.LOADING ? (
                        <ActivityIndicator size="large" />
                    ) : type === NotifType.ERROR ? (
                        <MaterialIcons name="error" size={35} color="orange" />
                    ) : (
                        <AntDesign name="checkcircle" size={35} color="green" />
                    )}
                </View>
                <Text style={styles.text}>{message}</Text>
            </BlurView>
        </View>
    );
};

export default Notification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        backgroundColor: '#000',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
    icon: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
