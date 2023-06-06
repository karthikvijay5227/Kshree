import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';

export default function AboutUs() {
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
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
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    aboutText: {
        fontSize: 20,
        lineHeight: 23,
        color: '#000',
    },
});
