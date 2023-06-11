import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, BackHandler, Dimensions, TouchableOpacity, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function AboutUs() {
    const [backPressCount, setBackPressCount] = useState(0);
    let navigation = useNavigation();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => backHandler.remove();
    }, []);

    const handleBackPress = () => {
        if (backPressCount < 1) {
            setBackPressCount(backPressCount + 1);
            navigation.navigate('Home');
            setTimeout(() => {
                setBackPressCount(0);
            }, 2000); // Reset backPressCount after 2 seconds
            return true;
        } else {
            BackHandler.exitApp();
            return false;
        }
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
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column', marginLeft: 8 }}>
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
                <ScrollView contentContainerStyle={{ height: height + 210 }}>
                    <Text style={styles.aboutText}>
                        Kudumbashree is a pioneering poverty eradication and women empowerment program in the state of Kerala, India. Established in 1998, Kudumbashree aims to uplift the socio-economic status of women and their families by providing them with various skill development, entrepreneurship, and microfinance opportunities.
                        {'\n\n'}
                        At its core, Kudumbashree believes in empowering women as catalysts for change within their communities. Through a network of over 4 million members organized into neighborhood groups called "Kudumbashree units," the organization fosters self-help, solidarity, and collective action.
                        {'\n\n'}
                        Kudumbashree offers a wide range of programs and initiatives, including training in various income-generating activities, micro-enterprises, and capacity-building workshops. By promoting financial inclusion, enhancing livelihood options, and fostering community development, Kudumbashree has played a significant role in reducing poverty and creating sustainable livelihoods across Kerala.
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
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 4,
        padding: 20,
        marginTop: 20,
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
        fontSize: 20,
        lineHeight: 23,
        color: '#000',
    },
});
