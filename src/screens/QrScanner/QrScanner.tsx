import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';

const QrScanner = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }: any) => {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        setTimeout(() => {
            setScanned(false);
        }, 3000);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        </View>
    );
};

export default QrScanner;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
