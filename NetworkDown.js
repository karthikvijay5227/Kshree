import React from 'react';
import { View, Text, StyleSheet, Image,TouchableOpacity } from 'react-native';

const NetworkDown = ({ onTryAgain }) => {
    return (
        <View style={styles.container}>
            <Image source={require('./assets/nointernet.png')} style={styles.image} />
            <Text style={styles.text}>Could not connect to network.Check your{' '}</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: "center", color: "black" }}>internet connection.</Text>
            <TouchableOpacity onPress={onTryAgain} style={styles.tryAgainButton}>
                <Text style={styles.tryAgainButtonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        color: "black"
    },
    tryAgainButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    tryAgainButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default NetworkDown;
