import * as React from 'react';
import { Camera } from 'expo-camera';
import { StyleSheet, View, Text, Button } from 'react-native';

export default function NumberPlateScanner() {
    const [hasPermission, setHasPermission] = React.useState(false);
    let camera: Camera;

    const takePhoto = async () => {
        const photo = await camera.takePictureAsync();
        console.log(photo);
    };

    React.useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);

    return hasPermission ? (
        <Camera
            style={StyleSheet.absoluteFillObject}
            ref={(r) => {
                camera = r;
            }}
        >
            <Button title="take" onPress={takePhoto} />
        </Camera>
    ) : (
        <View>
            <Text>No available cameras</Text>
        </View>
    );
}
