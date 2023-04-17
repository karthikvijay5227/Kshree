import React from "react";
import { StyleSheet,View,Text } from "react-native";

export default class Admin extends React.Component {

render(){
    return(
        <View style={styles.container}>
            <Text>Admin Screen</Text>
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