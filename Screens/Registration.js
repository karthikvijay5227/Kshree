import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, Animated, Keyboard, BackHandler,Alert } from 'react-native';
import { TextInput, Button, Modal } from 'react-native-paper';
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Admin from '../Screens/Admin';
import Toast from 'react-native-toast-message'
import Members from '../Screens/Members';
import { ActivityIndicator } from 'react-native-paper';
import Lottie from 'lottie-react-native';
import KudumbashreeRegistartion from '../components/KudumbashreeRegistration';
import { useNavigation } from '@react-navigation/native';


const Stack = createStackNavigator();
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Registration extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.checkLoginState();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  async checkLoginState() {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const { isAdmin, username } = JSON.parse(user);
        if (isAdmin) {
          this.props.navigation.navigate('Admin', { username });
        } else {
          this.props.navigation.navigate('Home', { username });
        }
      }
    } catch (error) {
      console.log('Error checking login state:', error);
    }
  }
  render() {
    return (
      <Stack.Navigator initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="Home" component={Members} />
        <Stack.Screen name="Reg" component={KudumbashreeRegistartion} />
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
      error: false,
      animationUp: new Animated.Value(0),
      loading : false
    }
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
  }

  _keyboardDidHide = () => {
    this.setState({ animationUp: new Animated.Value(0) })
  }

  _keyboardDidShow = () => {
    Animated.timing(this.state.animationUp, {
      toValue: -height / 2 + 100,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }

  render() {
    const navigation= this.props;
    const transformStyle = {
      transform: [
        { translateY: this.state.animationUp }
      ]
    }



    validateCredentials = async () => {
      const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
      const supabase = createClient(supabaseUrl, supabaseKey)

      this.setState({loading : true})

      let { data: data1, error } = await supabase.from('users').select('password').eq('username', this.state.username)
      let { data: admin, error2 } = await supabase.from('users').select('admin').eq('username', this.state.username)

      try {
        if (data1[0]["password"] == this.state.password) {
          let { data: data, error } = await supabase.from('users').select('login').eq('username', this.state.username)
          if (data[0]["login"] == false) {
            await supabase.from('users').update({ login: true }).eq('username', this.state.username)
            if (admin[0]["admin"]) {
            const user = { username: this.state.username, isAdmin: true };
            await AsyncStorage.setItem('user', JSON.stringify(user));
            navigation.reset({
              index: 0,
              routes: [{ name: 'Admin', params: { username: this.state.username } }],
            });
          }
          else {
            const user = { username: this.state.username, isAdmin: false };
            await AsyncStorage.setItem('user', JSON.stringify(user));
            navigation.reset({
              index: 0,
              routes: [{ name: 'Reg'}],
            });
          }
        }
        else{
          Alert.alert("User Already Logged In")
          this.setState({loading : false})
        }
        }
        else {
          this.setState({ error: true })
        }
      }
      catch (error) {
        this.setState({ error: true })
        Toast.show({
          type: 'error',
          position: 'top',
          text1: "Invalid Credentials",
          autoHide: true,
          visibilityTime: 1000,
          onHide: () => { this.setState({ error: false }) }
        });
      }
    };
   
    const onSignIn = () =>{

      if(!this.state.loading)
      {
        return(
          <View style={{ marginTop: 50, width: '90%', marginLeft: 20 }}>
          <TextInput
            mode="outlined"
            label="Username"
            error={this.state.error}
            style={{ marginLeft: 5, marginRight: 5 }}
            value={this.state.username}
            onChangeText={(text) => { this.setState({ username: text }) }}
          />

          <TextInput
            mode="outlined"
            label="Password"
            error={this.state.error}
            secureTextEntry={true}
            style={{ marginLeft: 5, marginRight: 5, marginTop: 2 }}
            value={this.state.password}
            onChangeText={(text) => { this.setState({ password: text }) }}
          />

          <View style={{flexDirection : 'row'}}>
          <View style={styles.signInContainer}>
            <Button style={styles.signInButton} onPress={() => { validateCredentials() }}>
              <Text style={styles.signInText}>Sign In</Text>
            </Button>
          </View>
            <View style={styles.signUpContainer}>
              <Button style={styles.signUpButton} onPress= {()=> {this.props.navigation.navigate('Reg')}}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </Button>
            </View>
           </View>
        </View>

        )
      }
      else{
        return(
        <View style={{ marginTop: 20, width: '90%',alignItems : 'flex-start', justifyContent : 'center' }}>
          <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center'}}>
            <Lottie style={{height : 200}} source={require('../assets/loading.json')} autoPlay loop />
            <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 30, color : 'black'}}>Logging In</Text>
          </View>
        </View>
        )
      }

    }

    return (

      <ImageBackground source={require('../assets/bgimage.jpg')} style={styles.imageBackground} imageStyle={styles.image}>
          <Modal visible={this.state.error}>
            <View style={{ marginBottom: height - 300 }}>
              <Toast autoHide visibilityTime={2000}>
              </Toast>
            </View>
          </Modal>

          <Animated.View style={[styles.logs, transformStyle]}>
            <View style={{ height: 4, width: 100, marginLeft: "37%", backgroundColor: 'grey', marginTop: 10, borderRadius: 20 }}>
            </View>

            {onSignIn()}

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
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: height - 290,
    height: height,
    width: width
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
signUpContainer: {
    left: 0,
    right: 0,
    alignItems: 'center',
    marginTop: 30,
  },
  signUpButton: {
    backgroundColor: '#ADD8E6',
    padding: 2,
    width: '50%',
    borderRadius: 10,
  },
  signUpText: {
    fontSize: 17,
    color: 'black',
  },

})