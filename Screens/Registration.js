import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, Dimensions,KeyboardAvoidingView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import  firebase  from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import  firestore  from '@react-native-firebase/firestore';


export default class Registration extends React.Component {
         
    
   async  componentDidMount() {
      
        console.log(await firebase.firestore().collection('users').get())

    }

    
 

    render() {
        
       

        const { navigation } = this.props;
        const height = Dimensions.get('window').height;
        const width = Dimensions.get('window').width;
        
      

    
        return (
           <ImageBackground source={require('../assets/bgimage.jpg')} resizeMode= {'cover'} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> 
              <KeyboardAvoidingView behavior="height" contentContainerStyle={{ flex: 1}} >
                    <View style={{alignItems : 'center', marginTop : 130}}>
                             <Text style={{ fontSize: 46, fontFamily: 'NunitoSans-SemiBold', marginLeft : 20  }}>Welcome to K-Sree</Text>
                    </View>
                    <View style={{marginTop : 130}}>
                         <TextInput
                            mode="outlined"
                             // label="Username"
                             // label="Username"
                            placeholder="Username"
                             // right={<TextInput.Affix text="/100" />}
                             style={{ marginLeft: 5, marginRight: 5}}
                            />

                         <TextInput
                             mode="outlined"
                                // label="Password"
                             placeholder="Password"
                                // right={<TextInput.Affix text="/100" />}
                             style={{ marginLeft: 5, marginRight: 5, marginTop: 2 }}
                             />
                             
                            <Button style={{ marginTop: '8%', backgroundColor: '#ff99e6', marginLeft: '25%', marginRight: '25%', padding: 2 }} onPress={() => { navigation.navigate('Home'),alert("Logged In") }}>
                                 <Text style={{ fontSize: 17, color: 'black' }}>Sign In</Text>
                            </Button>
                    </View>
                   
                </KeyboardAvoidingView>
             </ImageBackground>
          
        )
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
       
        
    }
})
