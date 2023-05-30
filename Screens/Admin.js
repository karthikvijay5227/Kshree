import * as React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Text, Dimensions,TouchableOpacity, Image, ScrollView } from 'react-native';
import LoanDetails from '../components/LoanDetails';
import LoanRegistration from '../components/LoanRegistration';
import KudumbashreeRegistration from '../components/KudumbashreeRegistration';
import Events from '../components/Events';
import Registration from '../Screens/Registration';
import { IconButton } from 'react-native-paper';
import { createClient } from '@supabase/supabase-js';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const height = Dimensions.get('window').height;
const width =  Dimensions.get('window').width;


export default class Admin extends React.Component {

render(){
    return(
        <Stack.Navigator initialRouteName="Drawer"
              screenOptions={{
                headerShown: false,
              }}>

              <Stack.Screen name="Drawer" component={DrawerNavigation} options={{ headerShown: false }} />              
            </Stack.Navigator>
    );
}    
  
}

class DrawerNavigation extends React.Component {
    render(){

        return(
            <Drawer.Navigator initialRouteName="AdminHome">
                <Drawer.Screen name="Home" component={AdminHome} options={{headerShown : false}} />
                <Drawer.Screen name="Loan Details" component={LoanDetails}/>
                <Drawer.Screen name="Loan Registration" component={LoanRegistration}/>
                <Drawer.Screen name="Kudumbashree Registration" component={KudumbashreeRegistration}  options={{headerTitle : ''}}/>
                <Drawer.Screen name="Events" component={Events}/>
                <Drawer.Screen name="Registration" component={Registration} options={{headerShown : false, drawerItemStyle : {height : 0}}}/>
            </Drawer.Navigator>
            
        );

    }
}


class AdminHome extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            events : [],
            userNumber : ''
        }
    }

    async componentDidMount(){
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
        const supabase = createClient(supabaseUrl, supabaseKey)
        let eventData =await supabase.rpc('events');
        this.setState({events : eventData.data})
        let userNumber = await supabase.rpc('get_total_users');
        this.setState({userNumber : userNumber.data})       
    }

    render(){

        const displayEvents = () => {
            
            function getDayOrdinalSuffix(day) {
                if (day === 1 || day === 21 || day === 31) {
                  return  'st';
                } else if (day === 2 || day === 22) {
                  return  'nd';
                } else if (day === 3 || day === 23) {
                  return day + 'rd';
                } else {
                  return 'th';
                }
              }          
            
            
            return(
                this.state.events.map((item,index) => {
                    
                    return(
                        <View key={index} style={{flexDirection: 'row', height: 80, width: width - 80, alignItems: 'center', borderColor: '#808080', borderBottomWidth: 1, marginTop : 10}}>
                            <View style={{flexDirection: 'column'}}>
                                 <Text style={{fontSize: 18, fontFamily: 'Outfit-Light', color: '#808080'}}>
                                        {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3).toUpperCase()}
                                 </Text>
                                <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                <Text style={{fontSize: 20, fontFamily: 'Outfit-Bold', color: '#000000', letterSpacing : 2,marginTop : 5, alignItems : 'flex-end'}}>{new Date(item.date).getDate()}</Text>
                                <Text style={{fontSize: 18, fontFamily: 'Outfit-Light', color: '#000000',marginLeft : 5}}>
                                    {getDayOrdinalSuffix(new Date(item.date).getDate())}
                                </Text>
                                </View>
                                </View>
                                <Text style={{fontSize: 25, fontFamily: 'Outfit-Medium', color: '#1A1110', marginLeft : 30}}>{item.event_name}</Text>
                             
                        </View>

                      


                      
                    )
                })

            )
        }

        return(
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor : 'white' }}>
                
               
                <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center', marginTop : 30, marginLeft : 15}}>
                   <IconButton icon={require('../assets/hamburger-menu.png')} size={30} onPress={() => this.props.navigation.openDrawer()} />
                    <Text style={{fontFamily : 'InterTight-Bold', fontSize : 30, color : 'black', marginLeft : 10,marginBottom : 5}}>Homepage</Text>
                </View>
                <View style={{flexDirection : 'row'}}>
                <TouchableOpacity style={{alignItems : 'center',justifyContent : 'center',height : 200, width : width - 200,marginTop : 30,marginLeft : 20, borderRadius : 20, backgroundColor : 'white', elevation: 8,  shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.5, shadowRadius: 3}} disabled >
                    <AnimatedCircularProgress
                        size={150}
                        width={25}
                        fill={this.state.userNumber/50 * 360}
                        tintColor="#38E038"
                        backgroundColor="white"
                        padding={10}
                        duration={2000}
                        lineCap= 'round'
                        
                     >
                        {
                            (fill) => (
                                <View style={{alignItems : 'center', justifyContent : 'center'}}>
                                    <Text style={{fontFamily : 'InterTight-Bold', fontSize : 25, color : 'black'}}>{this.state.userNumber}</Text>
                                    <Text style={{fontFamily : 'Outfit-Medium', fontSize : 15, color : 'black'}}>Users</Text>
                                </View>
                            )
                        }
                     </AnimatedCircularProgress>
                    </TouchableOpacity>

                    <View style={{flexDirection : 'column'}}>   
                    <TouchableOpacity style={{alignItems : 'center',justifyContent : 'center',height : 50, width : 150,marginTop : 30,marginLeft : 10, borderRadius : 10, backgroundColor : 'white', elevation: 8,  shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.5, shadowRadius: 3}} activeOpacity={0.9} onPress={()=>{this.props.navigation.navigate('Events')}} >
                    <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                            <Image source={require('../assets/event.png')} style={{height : 20, width : 20}} />
                            <Text style={{fontFamily : 'InterTight-Bold',fontSize : 14 ,color : 'black', letterSpacing : 0.5, marginLeft : 10}} >Create Event</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignItems : 'center',justifyContent : 'center',height : 50, width : 150,marginTop : 20,marginLeft : 10, borderRadius : 10, backgroundColor : 'white', elevation: 8,  shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.5, shadowRadius: 3}} activeOpacity={0.8} onPress={()=>{this.props.navigation.navigate('Kudumbashree Registration')}} >
                        <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                            <Image source={require('../assets/plus.png')} style={{height : 20, width : 20}} />
                            <Text style={{fontFamily : 'InterTight-Bold',fontSize : 15 ,color : 'black', letterSpacing : 0.5, marginLeft : 10}} >Add User</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems : 'center',justifyContent : 'center',height : 50, width : 150,marginTop : 20,marginLeft : 10, borderRadius : 10, backgroundColor : '#EE4A4A', elevation: 8,  shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.5, shadowRadius: 3}} onPress={()=>{this.props.navigation.navigate('Registration')}}>
                        <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                            <Text style={{fontFamily : 'Outfit-Bold',fontSize : 18 ,color : 'white', letterSpacing : 0.5}} >Logout</Text>
                            <Image source={require('../assets/logout.png')} style={{height : 20, width : 20, marginLeft : 20}} />
                        </View>
                    </TouchableOpacity>

                    </View>
                     

                </View>            
                <Text style={{fontFamily : 'InterTight-Bold', fontSize : 25, color : 'black', marginLeft : 30,marginTop : 40}}>Upcoming Events</Text>
                
                    
                <ScrollView style={{alignSelf :'center'}}>
                    {
                        displayEvents()
                    }
              
                </ScrollView>
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

