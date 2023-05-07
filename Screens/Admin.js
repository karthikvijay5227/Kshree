import * as React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Text } from 'react-native';
import LoanDetails from '../components/LoanDetails';
import LoanRegistration from '../components/LoanRegistration';
import KudumbashreeRegistration from '../components/KudumbashreeRegistration';
import Events from '../components/Events';
import Registration from '../Screens/Registration';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function Logout(props){
    
    const { navigation } = props;

    return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem label={() => <Text>Logout</Text>}
            style={{marginTop : '176%',}} 
            onPress={() => {navigation.navigate('InitialPage')}}
          />
        </DrawerContentScrollView>
      );
}


export default class Admin extends React.Component {

render(){
    return(
        <Stack.Navigator initialRouteName="Drawer"// Add this to set initial screen
              screenOptions={{
                headerShown: false,
              }}>

              <Stack.Screen name="Drawer" component={DrawerNavigation} options={{ headerShown: false }} />
              <Stack.Screen name="InitialPage" component={Registration}  />
             
              
            </Stack.Navigator>
    );
}    
  
}

class DrawerNavigation extends React.Component {
    render(){

        return(
            <Drawer.Navigator initialRouteName="AdminHome" drawerContent={props => <Logout {...props}/>}>
                <Drawer.Screen name="Home" component={AdminHome} />
                <Drawer.Screen name="Loan Details" component={LoanDetails}/>
                <Drawer.Screen name="Loan Registration" component={LoanRegistration}/>
                <Drawer.Screen name="Kudumbashree Registration" component={KudumbashreeRegistration}  options={{headerTitle : ''}}/>
                <Drawer.Screen name="Events" component={Events}/>
            </Drawer.Navigator>
            
        );

    }
}


class AdminHome extends React.Component {
    render(){
        return(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Feed Screen</Text>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent : 'center',
        alignItems : 'center'
    }
})

