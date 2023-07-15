import * as React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, StyleSheet, BackHandler,Image } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { CountUp } from 'use-count-up';
import { createStackNavigator } from '@react-navigation/stack';
import LoanUser from '../components/LoanUser';
import { IconButton } from 'react-native-paper';

const { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();

export default class UserDetails extends React.Component {

    render() {
        return(

            <Stack.Navigator initialRouteName="users">
                <Stack.Screen name="users" component={Users} options={{ headerShown: false }} />
            </Stack.Navigator>

        )
    }
}

class Users extends React.Component{
    
    
    constructor(props){
        super(props);
        this.state = {
            users : [],
            refresh : false
        }
    }
    
    async componentDidMount(){
                const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
                const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
                const supabase = createClient(supabaseUrl, supabaseKey);
                    let {data : data} = await supabase.from('users').select('*');
                    this.setState({users : data});
    }
    
    render(){
        
        const displayUsers = () => {
           return(
            this.state.users.map((item, index) => {
                return(
                    <View key={index} style={{alignSelf : 'center',justifyContent : 'center',marginTop : 10, bottom : 10,}}>
                        <TouchableOpacity disabled style={[{flexDirection : 'row',alignItems : 'center',justifyContent : 'space-between',elevation: 10, shadowOffset: 3, backgroundColor: 'white', borderRadius: 20,height : 100, marginLeft: 10 ,marginTop: 10, width: width - 50}]}>
                                <View style={{marginLeft : 20, flexDirection : 'row', }}>
                                    <Image source={require('../assets/account.png')} style={{height : 55, width : 55}} />
                                        <View style={{flexDirection : 'column'}}>
                                            <Text style={{fontFamily : 'Outfit-SemiBold',color : 'black' ,fontSize : 15, marginLeft : 10, marginTop : 5}}>{item.name}</Text>
                                            <Text style={{fontFamily : 'Outfit-SemiBold',color : '#808080' ,fontSize : 11, marginLeft : 10 }}>@{item.username}</Text>
                                        </View>                       
                                </View>
                                <View style={{justifyContent : 'flex-start',alignItems : 'center', }}>
                                  <View style={{flexDirection : 'row', marginRight : 10}}>
                                  <IconButton icon={require('../assets/delete.png')} size={20} onPress={()=>{}} style={{ elevation : 10}}/>
                                  <IconButton icon={require('../assets/edit.png')} size={20} onPress={()=>{}}  style={{ elevation : 10}}/>
                                  </View>
                          
                                </View>
                        </TouchableOpacity>
                    </View>
                )
            })
            
           )
                
        }

        const onRefresh = async() => {
                const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
                const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
                const supabase = createClient(supabaseUrl, supabaseKey);
                let {data : data} = await supabase.from('users').select('name');
                this.setState({users : data});
                
        }
        

        
        return(
            
            <View style={{backgroundColor : 'white', flex : 1}}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, marginTop: 20, width: width }}>
                    <TouchableOpacity style={{ marginLeft: 20, marginTop: 15, justifyContent: 'center', alignContent: 'center', elevation: 8, width: 45, height: 45, borderRadius: 50, backgroundColor: 'white', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 }} onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/arrow-left.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginTop: 15, marginLeft: 25 }}>User Details</Text>                
                </View>
                <ScrollView>
                        {displayUsers()}
                </ScrollView>
            </View>
            
        )
    }
}