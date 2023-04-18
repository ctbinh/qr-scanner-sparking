import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { displayMessage } from '../../utils/DisplayMessage';
import { IDataSocket } from '../../interfaces/socket';
import Stompjs from '../../utils/Stompjs';
import { getLocalItem } from '../../utils/LocalStorage';

const QrScanner = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
            const data = await getLocalItem('tab');
            if (data && data !== 'QrScanner') {
                return;
            }
        };
        getBarCodeScannerPermissions();
        const client = new Stompjs('room/mock', (data: IDataSocket) => {
            if (data.status === 'fail1') {
                // Popup rescan QR
            }
            if (data.status === 'fail2') {
                // popup fail message
                client.publishQrMessage(data.qrToken);
            }
            if (data.status === 'success') {
                // popup success status
            }
        });
        setTimeout(() => {
            setStompClient(client);
        }, 5000);
        return () => {
            client.disconectSocket();
        };
    }, []);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
        stompClient.publishQrMessage(data);
        displayMessage({ message: `${type}, ${data}`, type: 'success', icon: 'success' });
        setTimeout(() => {
            setScanned(false);
        }, 3000);
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
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {loading && <ActivityIndicator size="large" style={styles.loading} />}
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
