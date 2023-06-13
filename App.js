import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Registration from './Screens/Registration';
import Admin from './Screens/Admin';
import Members from './Screens/Members';
import * as Animatable from 'react-native-animatable';

const Stack = createStackNavigator();

class SplashScreen extends React.Component {
  componentDidMount() {
    this.checkLoginState();
  }

  checkLoginState = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const { isAdmin, username } = JSON.parse(user);
        if (isAdmin) {
          this.props.navigation.replace('Admin', { username });
        } else {
          this.props.navigation.replace('Home', { username });
        }
      } else {
        this.props.navigation.replace('Registration');
      }
    } catch (error) {
      console.log('Error checking login state:', error);
      this.props.navigation.replace('Registration');
    }
  };

  render() {
    return (
      <View style={styles.splashContainer}>
        <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.splashAnimation}>
          <Image source={require('./assets/splash.png')} style={styles.splashImage} />
        </Animatable.View>
      </View>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Registration" component={Registration} />
          <Stack.Screen name="Admin" component={Admin} />
          <Stack.Screen name="Home" component={Members} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  splashAnimation: {
    width: 200,
    height: 200,
  },
  splashImage: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'contain',
  },
});

export default App;
