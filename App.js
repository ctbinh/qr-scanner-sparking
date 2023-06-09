import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NumberPlateScanner from './src/screens/NumberPlateScanner/NumberPlateScanner';
import QrScanner from './src/screens/QrScanner/QrScanner';
import FlashMessage from 'react-native-flash-message';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TextEncoder } from 'text-encoding';
import { getLocalItem, setLocalItem } from './src/utils/LocalStorage';
import Settings from './src/screens/Settings';

const BottomTabs = createBottomTabNavigator();

export default function App() {
    const [tab, setTab] = useState('QrScanner');
    useEffect(() => {
        const getTab = async () => {
            const data = await getLocalItem('tab');
            setTab(data);
        };
        getTab();
    }, []);

    if (tab === 'QrScanner') {
        return (
            <View style={styles.container}>
                <NavigationContainer>
                    <BottomTabs.Navigator
                        screenOptions={{
                            tabBarActiveTintColor: '#000',
                            headerStyle: {
                                backgroundColor: '#fff',
                            },
                            headerTintColor: '#000',
                        }}
                    >
                        <BottomTabs.Screen
                            name="QrScanner"
                            component={QrScanner}
                            listeners={({ navigation }) => ({
                                tabPress: (e) => {
                                    e.preventDefault();
                                    setLocalItem('tab', 'QrScanner');
                                    navigation.navigate('QrScanner');
                                },
                            })}
                            options={{
                                title: 'Quét mã QR',
                                tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                            }}
                        />
                        <BottomTabs.Screen
                            name="Settings"
                            component={Settings}
                            options={{
                                title: 'Cài đặt',
                                tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
                            }}
                        />
                    </BottomTabs.Navigator>
                </NavigationContainer>
                <StatusBar style="auto" />
                <FlashMessage position="center" />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <NavigationContainer>
                    <BottomTabs.Navigator
                        screenOptions={{
                            tabBarActiveTintColor: '#000',
                            headerStyle: {
                                backgroundColor: '#fff',
                            },
                            headerTintColor: '#000',
                        }}
                    >
                        <BottomTabs.Screen
                            name="NumberPlateScanner"
                            component={NumberPlateScanner}
                            listeners={({ navigation }) => ({
                                tabPress: (e) => {
                                    e.preventDefault();
                                    setLocalItem('tab', 'NumberPlateScanner');
                                    navigation.navigate('NumberPlateScanner');
                                },
                            })}
                            options={{
                                title: 'Quét biển số',
                                tabBarIcon: ({ color, size }) => (
                                    <Ionicons name="time-sharp" size={size} color={color} />
                                ),
                            }}
                        />
                        <BottomTabs.Screen
                            name="Settings"
                            component={Settings}
                            options={{
                                title: 'Cài đặt',
                                tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
                            }}
                        />
                    </BottomTabs.Navigator>
                </NavigationContainer>
                <StatusBar style="auto" />
                <FlashMessage position="center" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
