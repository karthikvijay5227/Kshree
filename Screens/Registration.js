import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default class Registration extends React.Component {
    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                    <View>
                        <Image source={require('../assets/kudumbasree.png')} style={{ marginBottom: '28%'}} />
                    </View>
                </View>
                <View style={{ display: 'flex', alignItems: 'center', position: 'relative', bottom: 65 }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Welcome to K-Sree</Text>
                </View>
                <View>
                    <TextInput
                        mode="outlined"
                        // label="Username"
                        placeholder="Username"
                        // right={<TextInput.Affix text="/100" />}
                        style={{
                            marginLeft: '5%', marginRight: '5%'
                        }}
                    />

                    <TextInput
                        mode="outlined"
                        // label="Password"
                        placeholder="Password"
                        // right={<TextInput.Affix text="/100" />}
                        style={{ marginLeft: '5%', marginRight: '5%', marginTop: '2%' }}
                    />
                    <Button style={{ marginTop: '8%', backgroundColor: '#ff99e6', marginLeft: '25%', marginRight: '25%', padding: 2 }} onPress={() => { navigation.navigate('Home'),alert("Logged In") }}>
                        <Text style={{ fontSize: 17, color: 'black' }}>Sign In</Text>
                    </Button>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#b3ff99',
        justifyContent: 'center',
        bottom: '3%'
    }
})
