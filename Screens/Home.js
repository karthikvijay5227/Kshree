import React from 'react';
import { View, Text,StyleSheet} from 'react-native';
import { Button } from 'react-native-paper';

export default class Home extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
        <View style={styles.container}>
            <Text>Hello</Text>
            <Button style={{ marginTop: '8%', backgroundColor: '#ff99e6', marginLeft: '25%', marginRight: '25%', padding: 2 }} onPress={() => {navigation.navigate('Registration')}}><Text>LogOut</Text></Button>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


