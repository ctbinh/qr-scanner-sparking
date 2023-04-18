import AsyncStorage from '@react-native-async-storage/async-storage';

export const getLocalItem = async (key: string) => {
    const data = await AsyncStorage.getItem(key);
    return data;
};

export const setLocalItem = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
};
