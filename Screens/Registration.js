import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, Dimensions,KeyboardAvoidingView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'
import { createStackNavigator } from '@react-navigation/stack';
import Admin from '../Screens/Admin';

const Stack = createStackNavigator();

export default class Registration extends React.Component {
    render() {
        return (
          
            <Stack.Navigator initialRouteName="Login"// Add this to set initial screen
              screenOptions={{
                headerShown: false,
              }}>
              
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Admin" component={Admin} />
            </Stack.Navigator>
         
        )
      }
}


class Login extends React.Component {
         
    
   componentDidMount() {
      
    
    }

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            admin : false
        }

    
    }
 

    render() {
        
       

        const { navigation } = this.props;
        const height = Dimensions.get('window').height;
        const width = Dimensions.get('window').width;
        
        
         validateCredentials = async () => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey)
            const { data, error } = await supabase.from('users').select('password').eq('username', this.state.username)
            
            console.log("Enntered Text : " + this.state.username);
            console.log("Entered Password : " + this.state.password);
            console.log("Actual Password : " + data[0]['password']);
            
            this.setState({admin : await supabase.from('users').select('admin')})
             if(data[0]['password']=== this.state.password){
                console.log("Login Success");
                navigation.navigate('Admin');
                
                
            }else{
                 console.log("Login Failed");   
            }
        }

    
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
                              label="Username"
                            
                             // right={<TextInput.Affix text="/100" />}
                             style={{ marginLeft: 5, marginRight: 5}}
                             value={this.state.username}
                             onChangeText={(text) => { this.setState({ username: text }) }}
                            />

                         <TextInput
                             mode="outlined"
                            label="Password"
                            
                                // right={<TextInput.Affix text="/100" />}
                             style={{ marginLeft: 5, marginRight: 5, marginTop: 2 }}
                             value={this.state.password}
                             onChangeText={(text) => { this.setState({ password: text }) }}
                             />
                             
                            <Button style={{ marginTop: '8%', backgroundColor: '#ff99e6', marginLeft: '25%', marginRight: '25%', padding: 2 }} onPress={() => {validateCredentials()}}>
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
