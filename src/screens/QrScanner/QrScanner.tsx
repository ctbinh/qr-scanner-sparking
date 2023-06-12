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
    const [message, setMessage] = useState(NotifMessage.FAILED);
    const [notifType, setNotifType] = useState(NotifType.FAILED);
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
        const client = new Stompjs('room/mock', async (data: IDataSocket) => {
            console.log('client data qr: ', data);
            const tab = await getLocalItem('tab');
            if (tab !== 'QrScanner') return;
            if (data.status === 'failed') {
                // Popup rescan QR
                showNotification(NotifType.FAILED, NotifMessage.FAILED, TIME_DISPLAY_ERROR);
                console.log('=============QrScanner============');
                console.log(data);
                console.log('>>>Hiện popup thông báo lỗi, cho quét lại');
            }
            if (data.status === 'license-failed') {
                // popup fail message
                showNotification(NotifType.LICENSE_FAILED, NotifMessage.LICENSE_FAILED, TIME_DISPLAY_ERROR);
                client.publishQrMessage(data.qrToken);
                console.log('=============QrScanner============');
                console.log('>>>Hiện popup sai thông tin biển số');
                console.log(data);
            }
            if (data.status === 'qr-failed') {
                // popup fail message
                showNotification(NotifType.QR_FAILED, NotifMessage.QR_FAILED, TIME_DISPLAY_ERROR);
                client.publishQrMessage(data.qrToken);
                console.log('=============QrScanner============');
                console.log('>>>Hiện popup đ biết lỗi gì, yêu cầu quét lại');
                console.log(data);
            }
            if (data.status === 'license-retry') {
                // popup fail message
                showNotification(NotifType.RETRY, NotifMessage.RETRY);
                client.publishQrMessage(data.qrToken);
                console.log('=============QrScanner============');
                console.log(
                    '>>>Hiện popup yêu cầu điều chỉnh vị trí xe (cho đến khi xử lý xong, nhưng chỉ chờ tối đa 90s)',
                );
                console.log(data);
            }
            if (data.status === 'success') {
                // popup success status
                showNotification(NotifType.SUCCESS, NotifMessage.SUCCESS, TIME_DISPLAY_SUCCESS);
                console.log('=============QrScanner============');
                console.log(data);
                console.log('>>>Hiện popup thành công (3 giây)');
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
            console.log('=============QrScanner============');
            console.log('>>>Hiện popup loading (cho đến khi xử lý xong, nhưng chỉ chờ tối đa 20s)');
        } else {
            showNotification(NotifType.FAILED, NotifMessage.FAILED, TIME_DISPLAY_ERROR);
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
