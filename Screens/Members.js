import React from "react";
import { StyleSheet,View,Text } from "react-native";

export default class Users extends React.Component {

render(){
    return(
        <View style={styles.container}>
            <Text>User Screen</Text>
        </View>
    )
}

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
})