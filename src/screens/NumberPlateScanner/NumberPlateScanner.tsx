import { Camera } from 'expo-camera';
import { View, Text, useWindowDimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { IResponse, postData } from '../../services/api';
import Stompjs from '../../utils/Stompjs';
import { IDataSocket } from '../../interfaces/socket';
import React, { useEffect, useRef, useState } from 'react';
import { getLocalItem } from '../../utils/LocalStorage';

export default function NumberPlateScanner() {
    const [hasPermission, setHasPermission] = useState(false);
    const camera = useRef(null);
    const { width } = useWindowDimensions();
    const height = Math.round((width * 16) / 9);

    const takePhotoAndGetLicensePlate = async (): Promise<string | null> => {
        let response: IResponse;
        for (let i = 0; i < 3; i++) {
            const photo = await camera.current.takePictureAsync({ quality: 0.2 });
            const imageBase64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: 'base64' });
            response = await postData('lpc/license-plate-convert', {
                method: 'plate-regconizer',
                params: {
                    image: imageBase64,
                },
            });
            if (response.returnCode > 0) break;
        }
        if (response.returnCode > 0) {
            return response.data['license-plate'];
        } else {
            return null;
        }
    };

    useEffect(() => {
        const InitScreen = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            const data = await getLocalItem('tab');
            if (data && data !== 'NumberPlateScanner') {
                return;
            }
        };
        InitScreen();
        const client = new Stompjs('room/mock', async (data: IDataSocket) => {
            console.log('client data:', data);
            const tab = await getLocalItem('tab');
            if (tab !== 'NumberPlateScanner') return;
            if (data.status === 'need-license-plate') {
                console.log('========NumberPlateScanner=======');
                console.log('>>>Thử 3 lần để lấy biển');
                console.log(data);
                const license = await takePhotoAndGetLicensePlate();
                data.licensePlate = license;
                client.publishLicensePlateMessage(data);
            }
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
            {/*<Button title="take" onPress={takePhotoAndGetLicensePlate} />*/}
        </Camera>
    ) : (
        <View>
            <Text>No available cameras</Text>
        </View>
    );
}
