import { Camera } from 'expo-camera';
import { View, Text, Button, useWindowDimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { postData } from '../../services/api';
import Stompjs from '../../utils/Stompjs';
import { IDataSocket } from '../../interfaces/socket';
import React, { useEffect, useRef, useState } from 'react';
import { getLocalItem } from '../../utils/LocalStorage';

export default function NumberPlateScanner() {
    const [hasPermission, setHasPermission] = useState(false);
    const camera = useRef(null);
    const { width } = useWindowDimensions();
    const height = Math.round((width * 16) / 9);

    const takePhotoAndGetLicensePlate = async () => {
        const photo = await camera.current.takePictureAsync({ quality: 0.3 });
        const imageBase64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: 'base64' });
        console.log(imageBase64.length);
        const response = await postData('lpc/license-plate-convert', {
            method: 'plate-regconizer',
            params: {
                image: imageBase64,
            },
        });
        console.log(response);
        if (response.returnCode > 0) {
            return response.data['license-plate'];
        } else {
            return null;
        }
    };

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            const data = await getLocalItem('tab');
            if (data && data !== 'NumberPlateScanner') {
                return;
            }
        };
        getBarCodeScannerPermissions();
        const client = new Stompjs('room/mock', async (data: IDataSocket) => {
            if (data.status === 'need-license-plate') {
                takePhotoAndGetLicensePlate();
                client.publishLicensePlateMessage(data);
            }
            console.log('number plate scanner');
        });
        return () => {
            client.disconectSocket();
        };
    }, []);

    return hasPermission ? (
        <Camera
            ratio="16:9"
            style={{
                height: height,
                width: '100%',
            }}
            ref={camera}
        >
            <Button title="take" onPress={takePhotoAndGetLicensePlate} />
        </Camera>
    ) : (
        <View>
            <Text>No available cameras</Text>
        </View>
    );
}
