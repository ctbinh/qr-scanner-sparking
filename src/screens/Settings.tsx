import { StyleSheet, TextInput, View, Text, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getLocalItem, setLocalItem } from '../utils/LocalStorage';
import Button from '../components/Button';

const Settings = () => {
    const [roomId, setRoomId] = useState('');
    const [parkingLotId, setParkingLotId] = useState('');
    const [password, setPassword] = useState('');
    const confirmChange = () => {
        setLocalItem('roomId', roomId);
        setLocalItem('parkingLotId', parkingLotId);
        Alert.alert('Thành công', 'Cập nhật thông tin thành công.');
    };
    const changeTab = async () => {
        if (password === '111111') {
            const tab = await getLocalItem('tab');
            if (tab === 'QrScanner') {
                setLocalItem('tab', 'NumberPlateScanner');
            } else {
                setLocalItem('tab', 'QrScanner');
            }
            Alert.alert('Thành công', 'Thành công, vui lòng khởi động lại ứng dụng.');
        } else {
            Alert.alert('Thất bại', 'Sai mật khẩu, vui lòng thử lại.');
        }
    };
    useEffect(() => {
        const getValue = async () => {
            setParkingLotId(await getLocalItem('parkingLotId'));
            setRoomId(await getLocalItem('roomId'));
        };
        getValue();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông tin máy quét</Text>
            <Text>ID phòng</Text>
            <TextInput style={styles.input} onChangeText={setRoomId} value={roomId} placeholder="Nhập ID phòng" />
            <Text>ID nhà xe</Text>
            <TextInput
                style={styles.input}
                onChangeText={setParkingLotId}
                value={parkingLotId}
                placeholder="Nhập ID nhà xe"
            />
            <Button title="Xác nhận" onPress={confirmChange} />
            <View
                style={{
                    borderBottomColor: '#bdbdbd',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginVertical: 20,
                }}
            />
            <Text style={styles.title}>Thay đổi máy quét</Text>
            <TextInput style={styles.input} onChangeText={setPassword} value={password} placeholder="Mật khẩu bảo vệ" />
            <Button title="change" onPress={() => changeTab()} />
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'white',
    },
    input: {
        height: 40,
        borderWidth: 1,
        marginVertical: 5,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        borderColor: '#bdbdbd',
    },
    title: {
        fontSize: 18,
        color: '#4f4f4f',
        marginBottom: 5,
    },
});
