import * as React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, StyleSheet, BackHandler,Image } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Switch, TextInput } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import Lottie from 'lottie-react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import ToggleButton from 'react-native-paper';


const { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();

export default class UserDetails extends React.Component{

    handleBackButton = () => {
        // Handle the back button press
        this.props.navigation.goBack();
        return true; // Prevent the default back button action
      }

    render() {
        return(

            <Stack.Navigator initialRouteName="users">
                <Stack.Screen name="users" component={Users} options={{ headerShown: false }} />
            </Stack.Navigator>

        )
    }



    render() {
        return(

            <Stack.Navigator initialRouteName="users">
                <Stack.Screen name="users" component={Users} options={{ headerShown: false }} />
                <Stack.Screen name="Edit User" component={EditUser} options={{ headerShown: false }} />
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
           
            const {navigation} = this.props;

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
                                  <IconButton icon={require('../assets/edit.png')} size={20} onPress={()=>{navigation.navigate("Edit User",{
                                        name : item.name,
                                        username : item.username,
                                        password : item.password,
                                        admin : item.admin,
                                        address : item.address,
                                        phone : item.phone_number,
                                    })}}  style={{ elevation : 10}}/>
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
        
        const {navigation} = this.props;
        
        return(
            
            <View style={{backgroundColor : 'white', flex : 1}}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, marginTop: 20, width: width }}>
                    <TouchableOpacity style={{ marginLeft: 20, marginTop: 15, justifyContent: 'center', alignContent: 'center', elevation: 8, width: 45, height: 45, borderRadius: 50, backgroundColor: 'white', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 }} onPress={() => this.props.navigation.goBack()}>
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

class EditUser extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            name : this.props.route.params.name,
            username : this.props.route.params.username,
            password : this.props.route.params.password,
            admin : this.props.route.params.admin,
            address : this.props.route.params.address,
            phone : this.props.route.params.phone,
            editing : false

        }
        
    }
    
    render(){
               
        const width = Dimensions.get('window').width;

        return(
            <View style={{flex : 1, backgroundColor : 'white', justifyContent : 'flex-start', alignItems : 'flex-start'}}>
               <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, marginTop: 20, width: width }}>
                    <TouchableOpacity style={{ marginLeft: 20, marginTop: 15, justifyContent: 'center', alignContent: 'center', elevation: 8, width: 45, height: 45, borderRadius: 50, backgroundColor: 'white', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 }} onPress={() => {navigation.goBack()}}>
                        <Image source={require('../assets/arrow-left.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginTop: 15, marginLeft: 25 }}>Edit User</Text>                
                </View>
                <ScrollView contentContainerStyle={{alignItems : 'center', paddingBottom : 30}}>
                    <Lottie style={{height : height/2,width : width, alignSelf : 'center'}} source={require('../assets/editing.json')} autoPlay loop />
                     
                        <TouchableOpacity disabled style={{height : 50, width : 150, backgroundColor : '#add8e5',marginLeft : 30, borderRadius : 10, justifyContent : 'center', alignItems : 'center', alignSelf : 'flex-start'}} >
                            <View style={{flexDirection : 'row'}}>
                                <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 15, color : 'black', marginTop : 2}}>Editing</Text>
                                <Switch color='#add8e7' thumbColor={'white'} value={this.state.editing}  onValueChange={()=>{this.setState({editing : !this.state.editing})}} style={{marginLeft : 10}} />
                            </View>
                        </TouchableOpacity>
                  
                     <View style={{flexDirection : 'row', alignSelf : 'center', marginTop : 40}}>
                        <Image source={require('../assets/person.png')} style={{marginTop : 20, marginLeft : 20, height : 30, width : 30}} />
                        <TextInput mode="flat" label="Name" style={{width : width - 100, backgroundColor : 'white', marginLeft : 10}} 
                            value={this.state.name} 
                            onChangeText={(text)=>{this.setState({name : text})}}
                            editable = {this.state.editing}
                        />
                    </View>
                    <View style={{flexDirection : 'row', alignSelf : 'center', marginTop : 20}}>
                        <Image source={require('../assets/arroba.png')} style={{marginTop : 20, marginLeft : 20, height : 30, width : 30}} />
                        <TextInput mode="flat" label="Username" style={{width : width - 100, backgroundColor : 'white', marginLeft : 10}} 
                            value={this.state.username} 
                            onChangeText={(text)=>{this.setState({username : text})}}
                            editable = {this.state.editing}
                        />
                    </View>
                    <View style={{flexDirection : 'row', alignSelf : 'center', marginTop : 20}}>
                        <Image source={require('../assets/phone-call.png')} style={{marginTop : 20, marginLeft : 20, height : 30, width : 30}} />
                        <TextInput mode="flat" label="Phone Number" style={{width : width - 100, backgroundColor : 'white', marginLeft : 10}} 
                            value={this.state.phone} 
                            left={<TextInput.Affix text="+91" />}
                            onChangeText={(text)=>{this.setState({phone : text})}}
                            editable = {this.state.editing}
                            keyboardType='numeric'
                        />
                    </View>

                    <View style={{flexDirection : 'row', alignSelf : 'center', marginTop : 20}}>
                        <Image source={require('../assets/home.png')} style={{marginTop : 20, marginLeft : 20, height : 30, width : 30}} />
                        <TextInput mode="flat" label="Address" style={{width : width - 100, backgroundColor : 'white', marginLeft : 10}} 
                            value={this.state.address}
                            multiline 
                            onChangeText={(text)=>{this.setState({address : text})}}
                            editable = {this.state.editing}
                        />
                    </View>

                    <View style={{flexDirection : 'row', alignSelf : 'center', marginTop : 30}}>
                        <Image source={require('../assets/security.png')} style={{marginLeft : 20, height : 40, width : 40}} />
                        <View style={{ width: width - 100, marginLeft : 10 }}>
                                <SelectList
                                    placeholder={this.state.admin ? 'Admin' : 'Member'}
                                    search={false}
                                    setSelected={(value) => this.setState({ admin: value })}
                                    data={[{ key: 1, value: 'Admin', }, { key: 2, value: 'Member' }]}
                                    dropdownShown = {false}
                                    save='value'
                                    onSelect={() => {
                                        if (this.state.admin == 'Admin') {
                                            this.setState({ admin: true })
                                        }
                                        else {
                                            this.setState({ admin: false })
                                        }
                                    }}
                                />
                            </View>
                    </View>

                    <View style={{flexDirection : 'row', alignSelf : 'center', marginTop : 20}}>
                        <TouchableOpacity style={{width : width - 100, backgroundColor : 'white', marginLeft : 10, height : 50, justifyContent : 'center', alignItems : 'center'}} onPress={()=>{}}>
                            <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 15}}>Update Data</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        )
    }
}