import * as React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView,Image, Alert } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Switch, TextInput } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import Lottie from 'lottie-react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { Modal } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';


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
            refresh : false,
            deleteUser : false,
            error : false,
            deleteName : '',
            viewWidth : 40,
            delText : '',
            deleteUserName : ''
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
                                
                                  <IconButton icon={require('../assets/delete.png')} disabled={item.admin} size={20} onPress={()=>{
                                    this.setState({deleteUser : true})
                                    this.setState({deleteName : item.name,deleteUserName : item.username})
                                    }} style={{ elevation : 10}}/>
                                
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
                let {data : data} = await supabase.from('users').select('*');
                this.setState({users : data});
                this.setState({refresh : false})
        }
        
        const {navigation} = this.props;
        

        const deleteUser = async() => {
          
                const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
                const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
                const supabase = createClient(supabaseUrl, supabaseKey);
                if(this.state.delText === 'Delete User')
                {
                    console.log('User is Being Deleted')
                    
                    try{
                    await supabase.from('users').delete().eq('username',this.state.deleteUserName).then(
                        ()=>{
                        this.setState({deleteUser : false})
                        Alert.alert('Deletion Successful',`Deletion of username : ${this.state.deleteName} was Successful`)
                        onRefresh()

                        const channel = supabase.channel('notif');
                        const task = {username : this.state.deleteUserName}
                        channel.subscribe((status) => {
                            if (status === 'SUBSCRIBED') {
                                channel.send({
                                    type: 'broadcast',
                                    event: 'delete',
                                    payload: {task}
                                })
                            }
                        })
                        }
                    )}
                    catch{
                        this.setState({error : true})
                    }
                }
                else {
                    this.setState({error : true})
                }

                
                
        }
        
        return(
            
            <View style={{backgroundColor : 'white', flex : 1}}>
               
               <View>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.deleteUser}
                        onRequestClose={() => {
                            this.setState({deleteUser : !this.state.deleteUser})
                            }}
                        >
                        <View style={{flex :1,justifyContent : 'center', alignItems :'center',backgroundColor: 'rgba(45, 45, 45, 0.5)'}}>
                            <TouchableOpacity disabled style={{backgroundColor : 'white',height : height/2 - 10, width : width - 100, borderRadius : 20, elevation : 6,justifyContent : 'flex-start',alignItems : 'center'}}>
                                <View style={{flexDirection : 'row', justifyContent : 'center',marginTop : 30}} >
                                    <Image source={require('../assets/warning.png')} style={{height : 40, width : 40}}/>
                                    <Text style={{fontFamily : 'InterTight-Bold', color : '#454545',fontSize : 20, marginLeft : 10, marginTop : 5}}>Warning!</Text>
                                </View>
                            
                                <Text style={{fontFamily : 'Outfit-Medium', fontSize : 15, marginTop : 30, width : 250}}>
                                    You are about to delete the user : <Text style={{fontFamily : 'Outfit-Bold', fontSize : 15, marginTop : 5, width : 'auto'}}>{this.state.deleteName}</Text>
                                </Text>
                                
                                <Text style={{fontFamily : 'Outfit-Medium', fontSize : 15, marginTop : 5, width : 250}}>
                                    To make sure that you are deleting the user type <Text style={{fontFamily : 'Outfit-Bold', fontSize : 15, marginTop : 5, width : 'auto', color : 'red'}}> Delete User</Text>
                                    <Text style={{fontFamily : 'Outfit-Medium', fontSize : 15}}> in the below text feild</Text>
                                </Text>
                                
                                <TextInput 
                                  label={'Delete User'}
                                  placeholder='Type in Delete User'
                                  mode='outlined'
                                  error={this.state.error}
                                  value={this.state.delText}
                                  onChangeText={text => this.setState({ delText: text })}
                                  style={{ width: 250, marginTop: 20, alignSelf: 'center', backgroundColor : 'white' }}
                                />                              
                                
                                <TouchableOpacity style={{width : 250, height : 40,marginTop : 20, backgroundColor : '#D0312D', justifyContent : 'center', alignItems : 'center', borderRadius : 5}} onPress={()=>{deleteUser()}}>
                                    <Text style={{fontFamily : 'Outfit-Bold', fontSize : 15, color : 'white'}}>Delete User</Text>
                                </TouchableOpacity>
                               
                                    
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
                
                
                
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, marginTop: 20, width: width }}>
                    <TouchableOpacity style={{ marginLeft: 20, marginTop: 15, justifyContent: 'center', alignContent: 'center', elevation: 8, width: 45, height: 45, borderRadius: 50, backgroundColor: 'white', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 }} onPress={() => this.props.navigation.goBack()}>
                        <Image source={require('../assets/arrow-left.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginTop: 15, marginLeft: 25 }}>User Details</Text>                
                </View>
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={()=>{onRefresh()}} />}>
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
            admin : this.props.route.params.admin,
            address : this.props.route.params.address,
            phone : this.props.route.params.phone,
            editing : false

        }
        
    }
    
    render(){
               
        const width = Dimensions.get('window').width;

        const {navigation} = this.props;

        const updateData = async(uname, uusername, uaddress, uadmin, uphone ) => {
                const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
                const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
                const supabase = createClient(supabaseUrl, supabaseKey);
                await supabase.from('users').update([
                    {
                        name : this.state.name,
                        username : this.state.username,
                        password : this.state.password,
                        admin : this.state.admin,
                        address : this.state.address,
                        phone_number : this.state.phone

                    }
                ]).eq('username', this.state.username);

                
                const channel = supabase.channel('KshreeDB').on('postgres_changes',
                    {event: 'UPDATE', schema: 'public', table :'users'},
                    (payload) => {
                    if(payload.errors === "null")
                        {
                            Alert.alert('Update', 'User Updated Successfully')
                            this.setState({
                                editing : false,
                                name : uname,
                                username : uusername,
                                admin : uadmin,
                                address : uaddress,
                                phone : uphone

                            })
                        }
                    }).subscribe()
        }

        return(
            <View style={{flex : 1, backgroundColor : 'white', justifyContent : 'flex-start', alignItems : 'flex-start'}}>
               <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, marginTop: 20, width: width }}>
                    <TouchableOpacity style={{ marginLeft: 20, marginTop: 15, justifyContent: 'center', alignContent: 'center', elevation: 8, width: 45, height: 45, borderRadius: 50, backgroundColor: 'white', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 }} onPress={() => {navigation.goBack()}}>
                        <Image source={require('../assets/arrow-left.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginTop: 15, marginLeft: 25 }}>Edit User</Text>                
                </View>
                <ScrollView contentContainerStyle={{alignItems : 'center', alignSelf:'center', paddingBottom : 30}}>
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

                    <View style={{alignSelf : 'center', marginTop : 30}}>
                        <TouchableOpacity disabled={!this.state.editing} style={{width : width - 100, backgroundColor : 'white', marginLeft : 30, height : 50, justifyContent : 'center', alignItems : 'center', alignSelf : 'center',borderRadius : 10, elevation : 5, borderWidth : 0.5}} onPress={()=>{updateData(
                            this.state.name,this.state.username,this.state.admin,this.state.address,this.state.phone
                        )}}>
                            <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 15}}>Update Data</Text>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
            </View>
        )
    }
}