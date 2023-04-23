import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default class Events extends React.Component {
    render(){
        return(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Events</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent : 'center',
        alignItems : 'center'
    }
})
