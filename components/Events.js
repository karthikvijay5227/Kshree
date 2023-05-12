import * as React from 'react';
import { View, StyleSheet, Text, Alert,Platform,KeyboardAvoidingView, Dimensions, RefreshControl, Keyboard } from 'react-native';
import { Button, Card, IconButton, TextInput } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { createClient } from '@supabase/supabase-js'
import { ScrollView } from 'react-native-gesture-handler';
import CreateEvent from '../components/CreateEvent';


const Stack = createStackNavigator();
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export default class Events extends React.Component {
   render(){
    return(
        <Stack.Navigator initialRouteName="EventList" screenOptions={{headerShown : false}}>
            <Stack.Screen name='CreateEvent' component={CreateEvent} />
            <Stack.Screen name='EventList' component={EventList} />
        </Stack.Navigator>
    )}
}

class EventList extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            events : [],
            refresh : true
        };
     
        
    }
  
    
    componentDidMount(){

        const { navigation } = this.props;
        this._unsubscribe = navigation.addListener('focus', async() => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey)
            let { data: obj} = await supabase.from('events').select('*')
            this.setState({events : obj})
          });

        

        setTimeout(()=>{this.setState({refresh : false})}, 1000)
        
        }   



    render(){
    

        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
        const supabase = createClient(supabaseUrl, supabaseKey)
        

        const deleteEvent = async(name) => {
            
            await supabase.from('events').delete().match({event_name : name})
            let { data: obj} = await supabase.from('events').select('*')
            this.setState({events : obj})

        }

       


        const mapEvents = () => {

            return(
                this.state.events.map((item,index)=>{
                    return(
                       
                        <Card onPress={()=>{}} key={index} style={{height : 210, marginTop : 20, width : width - 20}}>
                            <Card.Title title={item.event_name} titleVariant='headlineMedium' right={(props) => <IconButton {...props} icon={require("../assets/delete.png")} onPress={() => {deleteEvent(item.event_name)}} />}/>
                            <Card.Content>
                                <View style={{flexDirection : 'row', marginTop : 10}}>
                                <Text style={{fontWeight : 'bold'}}>Event Description : </Text>
                                <Text style={{marginLeft : 5}}>{item.event_description}</Text>
                                </View>
                                <View style={{flexDirection : 'row', marginTop : 10}}>
                                <Text style={{fontWeight : 'bold'}}>Location : </Text>
                                <Text style={{marginLeft : 5}}>{item.location}</Text>
                                </View>
                                <Button mode='contained' style={{marginTop : 30}} onPress={()=>{}}>Price : {item.profit}</Button>
                            </Card.Content>

                        </Card>
                    )
                })
            )
        }
        
        return(
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <Button mode='elevated' icon={require('../assets/plus.png')} style={{fontSize : 20, fontWeight : 'bold', marginLeft : 30, marginTop : 30}} onPress={()=>{this.props.navigation.navigate('CreateEvent')}}>
                    <Text style={{fontSize : 15}}>Create Event</Text>
                </Button>

            <ScrollView contentContainerStyle={{flex : 1, width : width, justifyContent : 'flex-start', alignItems : 'center'}}
             refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={()=>{mapEvents()}}/>}>
                  
                  {
                   mapEvents()
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
