import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { IDataSocket } from '../../interfaces/socket';
import Stompjs from '../../utils/Stompjs';
import { getLocalItem } from '../../utils/LocalStorage';
import Notification from '../../components/Notification';
import {
    MAX_TIME_DISPLAY,
    NotifMessage,
    NotifType,
    TIME_DISPLAY_ERROR,
    TIME_DISPLAY_SUCCESS,
} from '../../constant/notification';

const QrScanner = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [message, setMessage] = useState(NotifMessage.ERROR);
    const [notifType, setNotifType] = useState(NotifType.ERROR);
    const [showNotif, setShowNotif] = useState(false);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const InitScreen = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
            const data = await getLocalItem('tab');
            if (data && data !== 'QrScanner') {
                return;
            }
        };
        InitScreen();
        const client = new Stompjs('room/mock', (data: IDataSocket) => {
            if (data.status === 'fail1') {
                // Popup rescan QR
                showNotification(NotifType.ERROR, NotifMessage.ERROR, TIME_DISPLAY_ERROR);
            }
            if (data.status === 'fail2') {
                // popup fail message
                client.publishQrMessage(data.qrToken);
            }
            if (data.status === 'success') {
                // popup success status
                showNotification(NotifType.SUCCESS, NotifMessage.SUCCESS, TIME_DISPLAY_SUCCESS);
            }
        });
        setTimeout(() => {
            setStompClient(client);
        }, 5000);
        return () => {
            client.disconectSocket();
        };
    }, []);

    const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
        const isSuccess = stompClient.publishQrMessage(data);
        if (isSuccess) {
            showNotification(NotifType.LOADING, NotifMessage.LOADING);
        } else {
            showNotification(NotifType.ERROR, NotifMessage.ERROR, TIME_DISPLAY_ERROR);
        }
    };

    const showNotification = (type: NotifType, message: NotifMessage, time?: number) => {
        setShowNotif(true);
        setNotifType(type);
        setMessage(message);
        setTimeout(() => {
            setShowNotif(false);
        }, (time ?? MAX_TIME_DISPLAY) * 1000);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (!hasPermission) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={showNotif ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {showNotif && <Notification type={notifType} message={message} />}
        </View>
    );
};

export default QrScanner;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
