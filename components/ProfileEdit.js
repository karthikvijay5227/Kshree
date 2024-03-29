import React, { useState, useEffect } from 'react';
import config from '../config';
import { View, Text, Alert, StyleSheet, ScrollView, Dimensions, TouchableOpacity, BackHandler, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createClient } from '@supabase/supabase-js';

const width = Dimensions.get('window').width;

export default function ProfileEdit({ username }) {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
                const supabaseKey = config.SUPABASE_API_KEY;
                const supabase = createClient(supabaseUrl, supabaseKey);

                const { data, error } = await supabase
                    .from('users')
                    .select('name, address, phone_number')
                    .eq('username', username)
                    .limit(1);

                if (error) {
                    throw error;
                }

                if (data.length > 0) {
                    const { name, address, phone_number } = data[0];
                    setName(name);
                    setAddress(address);
                    setPhoneNumber(phone_number);
                }
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };

        fetchUserData();
    }, [username]);

    useEffect(() => {
        const isInputValid = name !== '' && address !== '' && phoneNumber !== '' && phoneNumber.length === 10;
        setIsFormValid(isInputValid);
    }, [name, address, phoneNumber]);

    const handleSave = async () => {
        try {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
            const supabaseKey = config.SUPABASE_API_KEY;
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data, error } = await supabase
                .from('users')
                .update({ address, name, phone_number: phoneNumber })
                .eq('username', username);

            if (data && data.length > 0) {
                const { name, address, phone_number } = data[0];
                setName(name);
                setAddress(address);
                setPhoneNumber(phone_number);
            }

            if (error) {
                throw error;
            }

            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => backHandler.remove();
    }, []);

    const handleBackPress = () => {
        navigation.goBack();
        return true;
    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity style={{ marginLeft: 6, marginTop: 50, justifyContent: 'center', alignContent: 'center', elevation: 8, width: 45, height: 45, borderRadius: 50, backgroundColor: 'white', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 }} onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/arrow-left.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', alignItems: 'flex-start', marginTop: -width * 0.085, color: "black", marginLeft: "32%" }}>Update Profile</Text>

                    <TextInput
                        label={'New Name'}
                        value={name}
                        mode='outlined'
                        onChangeText={(text) => setName(text)}
                        style={{ width: width - 50, marginTop: 70 }}
                    />

                    <TextInput
                        label={'New Address'}
                        value={address}
                        mode='outlined'
                        onChangeText={(text) => setAddress(text)}
                        style={{ width: width - 50, marginTop: 20 }}
                        numberOfLines={10}
                        multiline={true}
                        editable={true}
                    />

                    <TextInput
                        label={'New Phone Number'}
                        value={phoneNumber}
                        mode='outlined'
                        onChangeText={(text) => setPhoneNumber(text)}
                        style={{ width: width - 50, marginTop: 20 }}
                    />

                    <View style={{ marginTop: 40, width: '30%' }}>
                        <TouchableOpacity
                            style={[
                                styles.registerButton,
                                isFormValid ? styles.registerButtonActive : styles.registerButtonInactive
                            ]}
                            onPress={() => { isFormValid && handleSave(); }}
                            disabled={!isFormValid}
                        >
                            <Text style={styles.registerButtonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View >
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },

    registerButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderRadius: 10,
        marginBottom: 30
    },
    registerButtonActive: {
        backgroundColor: '#4b52e3'
    },
    registerButtonInactive: {
        backgroundColor: 'gray'
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
})