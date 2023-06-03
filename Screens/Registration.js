import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions,Animated,Keyboard} from 'react-native';
import { TextInput, Button, Modal } from 'react-native-paper';
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'
import { createStackNavigator } from '@react-navigation/stack';
import Admin from '../Screens/Admin';
import Toast from 'react-native-toast-message'
import Members from '../Screens/Members';


const Stack = createStackNavigator();
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Registration extends React.Component {
    render() {
        return (
          
            <Stack.Navigator initialRouteName="Login"
              screenOptions={{
                headerShown: false,
              }}>
              
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Admin" component={Admin} />
              <Stack.Screen name="Home" component={Members} />
            </Stack.Navigator>
         
        )
      }
}


class Login extends React.Component {
    

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error : false,
            animationUp : new Animated.Value(0)
        }
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    }

    _keyboardDidHide = () => {
        this.setState({animationUp : new Animated.Value(0)})
    }

    _keyboardDidShow = () => {
        Animated.timing(this.state.animationUp, {
            toValue : -height/2 + 100,
            duration : 100,
            useNativeDriver : true,
            
        }).start()
    }

    render() {
      
         const { navigation } = this.props;
         const transformStyle = {
            transform : [
                {translateY : this.state.animationUp}
            ]
        }      

         validateCredentials = async () => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey)
            
            let { data : data1, error } = await supabase.from('users').select('password').eq('username', this.state.username)    
            let{ data : admin, error2} = await supabase.from('users').select('admin').eq('username', this.state.username)
          
            try{

              if(data1[0]["password"] == this.state.password){
                if(admin[0]["admin"]){
                    this.props.navigation.navigate('Admin')
                }
                else{
                    this.props.navigation.navigate('Home')
                }
             }
             else{
                this.setState({error : true})
             }

             }
             catch(error){
                this.setState({error : true})    
                Toast.show({
                   type: 'error',
                   position : 'top',
                   text1 : "Invalid Credentials",
                   autoHide : true,
                   visibilityTime : 1000,
                    onHide : () => {this.setState({error : false})}});
             }
        }

    
        return (
            <ImageBackground source={require('../assets/bgimage.jpg')} style={styles.imageBackground} imageStyle={styles.image}>
              <Modal visible={this.state.error} >
                <View style={{marginBottom : height - 300}}>
                 <Toast autoHide visibilityTime={2000}>                   
                 </Toast>
                 </View>
                </Modal>
        
               
                 <Animated.View style={[styles.logs,transformStyle]}>
                    <View style={{height : 4, width : 100, marginLeft :"36.9%", backgroundColor : 'grey', marginTop : 10, borderRadius : 20}}>
                    </View>

                    <View style={{marginTop : 50, width : '90%',marginLeft : 20}}>
                         <TextInput
                            mode="outlined"
                             // label="Username"
                            label="Username"
                            error = {this.state.error}
                             // right={<TextInput.Affix text="/100" />}
                             style={{ marginLeft: 5, marginRight: 5}}
                             value={this.state.username}
                             onChangeText={(text) => { this.setState({ username: text }) }}
                            
                            />

                         <TextInput
                             mode="outlined"
                            label="Password"
                            error = {this.state.error}
                            secureTextEntry={true}
                                // right={<TextInput.Affix text="/100" />}
                             style={{ marginLeft: 5, marginRight: 5, marginTop: 2 }}
                             value={this.state.password}
                             onChangeText={(text) => { this.setState({ password: text }) }}
                             />
                             
                             <View style={styles.signInContainer}>
                                    <Button style={styles.signInButton} onPress={() => { validateCredentials() }}>
                                        <Text style={styles.signInText}>Sign In</Text>
                                    </Button>
                                    </View>
                    </View>
                   </Animated.View> 
             </ImageBackground>
          
        )
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',           
    },
    imageBackground: {
        flex: 1,
      },
      image: {
        height: height - 200,
        width: width,
      },

    logs: {
      backgroundColor : 'white', 
      borderRadius : 20, 
      marginTop : height - 290,
      height : height,
      width : width
    },
    signInContainer: {
        left: 0,
        right: 0,
        alignItems: 'center',
        marginTop: 30,
      },
      signInButton: {
        backgroundColor: '#ff99e6',
        padding: 2,
        width: '50%',
        borderRadius: 10,
      },
      signInText: {
        fontSize: 17,
        color: 'black',
      },
})
