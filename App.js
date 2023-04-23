import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Admin from './Screens/Admin'
const Stack = createStackNavigator();

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Registration"// Add this to set initial screen
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Registration" component={Admin} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}


