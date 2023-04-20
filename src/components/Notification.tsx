import { StyleSheet, ActivityIndicator, Text, View, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import React, { useRef, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { NotifMessage, NotifType } from '../constant/notification';

const Notification = ({ type, message }: { type: NotifType; message: NotifMessage }) => {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, [opacity]);
    return (
        <View style={styles.container}>
            <BlurView intensity={100} tint="dark" style={styles.box}>
                <Animated.View style={[{ opacity }, styles.icon]}>
                    {type === NotifType.LOADING ? (
                        <ActivityIndicator size="large" />
                    ) : type === NotifType.ERROR ? (
                        <MaterialIcons name="error" size={35} color="orange" />
                    ) : type === NotifType.FIX ? (
                        <MaterialIcons name="wrong-location" size={35} color="red" />
                    ) : (
                        <AntDesign name="checkcircle" size={35} color="green" />
                    )}
                </Animated.View>
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
        maxWidth: '80%',
        minWidth: '50%',
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
