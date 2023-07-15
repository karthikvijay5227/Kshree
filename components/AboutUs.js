import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, BackHandler, Dimensions, TouchableOpacity, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function AboutUs() {
    let navigation = useNavigation();

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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginTop: 20, width: width }}>
                <TouchableOpacity style={{ marginLeft: 20, marginTop: 15, justifyContent: 'center', alignContent: 'center', elevation: 8, width: 45, height: 45, borderRadius: 50, backgroundColor: 'white', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 }} onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/arrow-left.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginTop: 15, marginLeft: 25 }}>About Us</Text>
                <Image source={require('../assets/icon.png')} style={{ height: 100, width: 100, marginTop: 10 }} />
            </View>

            <View style={{ height: 150, width: width, alignSelf: 'center' }}>
                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 20, marginLeft: 20, color: "black" }}> Developers</Text>
                <View style={{ flexDirection: 'row', marginLeft: "2.3%" }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Image source={require('../assets/ashwin.jpg')} style={styles.dev} />
                        <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, alignSelf: 'center', marginLeft: 20, marginTop: 5, color: "black" }}>R Ashwin</Text>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Image source={require('../assets/sanjay.jpg')} style={styles.dev} />
                        <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, alignSelf: 'center', marginLeft: 20, marginTop: 5, color: "black" }}>Sanjay Mathew</Text>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Image source={require('../assets/karthik.jpg')} style={styles.dev} />
                        <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, alignSelf: 'center', marginLeft: 20, marginTop: 5, color: "black" }}>Karthik Vijay</Text>
                    </View>
                </View>
            </View>

            <View style={styles.box}>
                <ScrollView contentContainerStyle={{ height: height }} showsVerticalScrollIndicator={false}>
                    <Text style={styles.aboutText}>
                        We are Sanjay, Karthik, and Ashwin, three students from the College of Engineering Chengannur, CSE department. We are passionate about coding and developing innovative solutions for social causes. We have developed an app called Kshree, which helps to track and manage events of Kudumbashree.
                        {'\n\n'}
                        Our app aims to provide a platform for the Kudumbashree members to access information, communicate with each other, and participate in various activities and initiatives of the programme. The app also enables the users to monitor their progress, achievements, and challenges in their journey towards empowerment and prosperity.
                        {'\n\n'}
                        We hope that our app will help the Kudumbashree members to achieve their goals and aspirations. We also hope that our app will help the Kudumbashree programme to achieve its vision of a poverty-free, prosperous Kerala.
                        {'\n\n'}
                        Thank you for choosing Kshree! 🙏
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white',
    },
    box: {
        width: '90%',
        height: '60%',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 4,
        padding: 20,
        marginTop: 25,
        alignSelf: 'center',
    },
    dev: {
        height: 100,
        width: 100,
        marginTop: 10,
        marginLeft: 20,
        borderRadius: 50,
    },

    aboutText: {
        fontSize: 15,
        lineHeight: 23,
        color: '#000',
        fontFamily: 'Outfit-Light',
    },
});