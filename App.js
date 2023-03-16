import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Registration from './Screens/Registration';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Screens/Home';

const Stack = createStackNavigator();

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Registration"// Add this to set initial screen
          screenOptions={{
            headerShown: false,
          }}>
          
          <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}


