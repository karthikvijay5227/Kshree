import * as React from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image, Alert} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Paragraph,Button } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import { ImageBackground } from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class EventDetails extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            eventDetails : [],
            refresh : true,
            users : [],
            checked : []
        }
    }

/**
 * This function uses Supabase to retrieve data from two tables and set the state of the component with
 * the retrieved data.
 */

    async componentDidMount(){
      
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey)
            let { data: obj} = await supabase.from('events').select('*').match({event_name : this.props.route.params.event})
            this.getEventDetails(obj[0])
            let { data: obj2} = await supabase.from('users').select('username');
            this.setState({users :  Object.entries(obj2)})
           
            let checkedState = this.state.users.map(() => false);
           
            try{
            await supabase.from('EventAttendies').select('attendies').match({eventname : this.state.eventDetails.event_name}).then((members) => 
            {
               members.data[0].attendies.map((item,index) => {
                    this.state.users.map((item2,index2) => {
                        if(item === item2[1].username){
                           checkedState[index2] = true;
                        }
                    })
               })
                
            })
             }catch(err){
                this.setState({ checked: checkedState });
             }

             this.setState({ checked: checkedState });
        }

        /* `getEventDetails` is a function that takes in a parameter `data` and sets the state of the component
        with the `eventDetails` key to the value of `data`. It also sets the `refresh` key in the state to
        `false` after a delay of 1 second using `setTimeout`. */

    getEventDetails = (data) => {
        this.setState({eventDetails : data})  
        setTimeout(()=>{this.setState({refresh : false})}, 1000)   
        
       
    }

    handleCheckboxChange = (index) => {
        const { checked } = this.state;
        checked[index] = !checked[index];
        this.setState({ checked });

      };



    render(){
        

        const renderMembers = () => {
           
            return(
                this.state.users.map((item, index) => {
                    
                    return(
                        <View key={index} style={{ flex: 0.2, marginTop: 20, width: width, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1 }}>
                            <Image source={require('../assets/user.png')} style={{ height: 40, width: 40, marginLeft : 20 }} />
                            <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 18, marginLeft: 20, color: 'black' }}>{item[1].username}</Text>
                            <CheckBox value={this.state.checked[index]} onValueChange={() => this.handleCheckboxChange(index)} style={{ marginLeft: 'auto', marginRight : 30 }} />
                        </View>

                        )
                }))
            
        }

        const handleMembers = async() => {

            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey);
            let participants = [];
            
            
            for(let i = 0; i < this.state.checked.length; i++){
                if(this.state.checked[i] === true){
                    participants.push(this.state.users[i][1].username)
                }
            }
           
            await supabase.from('EventAttendies').update({ attendies : participants }).eq( "eventname" , this.state.eventDetails.event_name)
        }

        const createAlert = (alertName) =>{
       
                Alert.alert(alertName);               
            
        }
        return(
            
            <View style={{flex : 1, backgroundColor : 'white'}}>
                 <ScrollView >
                  
                   <Text style={{fontSize : 30,fontFamily : 'InterTight-Bold', marginLeft : 20 ,marginTop : 20, color : '#000000'}}>{this.state.eventDetails.event_name}</Text>
                                                  
                   <View style={{flexDirection : 'row'}}>
                        <TouchableOpacity style={{backgroundColor : '#ECF8F8', height : 40, width : 100, marginLeft : 20, marginTop : 30 ,borderRadius : 30}} onPress={()=>{createAlert(this.state.eventDetails.time)}}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', color: '#000000' }}>
                                <Image source={require('../assets/clock.png')} style={{height : 20, width : 20, marginTop : 10, marginLeft : 5}}/>
                                <Text style={{fontSize : 15, fontFamily : 'Outfit-Medium', marginLeft : 10 ,marginTop : 10, color : '#000000'}}>{this.state.eventDetails.time}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{backgroundColor : '#ECF8F8', height : 40, width : 200, marginLeft : 20, marginTop : 30 ,borderRadius : 30}} disabled>
                            <View style={{flexDirection : 'row', justifyContent : 'center'}}>
                                <Image source={require('../assets/calendar.png')} style={{height : 20, width : 20, marginTop : 10, marginLeft : 5}}/>
                                <Text style={{fontSize : 15, fontFamily : 'Outfit-Medium', marginLeft : 10 ,marginTop : 10, color : '#000000'}}>{this.state.eventDetails.date}</Text>
                             </View>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={{backgroundColor : '#ECF8F8', height : 40, width : 130 , marginLeft : 20, marginTop : 10 ,borderRadius : 30}} onPress={()=>{createAlert(this.state.eventDetails.location)}}>
                         <View style={{flexDirection : 'row', alignItems :'flex-start',justifyContent : 'center', marginLeft : 9}}>
                             <Image source={require('../assets/placeholder.png')} style={{height : 20, width : 20, alignSelf : 'center',marginTop : 7}}/>
                             <Paragraph numberOfLines={1} style={{fontSize : 15, width : 80 ,fontFamily : 'Outfit-Medium', marginLeft : 10 ,marginTop : 10, color : '#000000'}}>{this.state.eventDetails.location}</Paragraph>
                         </View>
                    </TouchableOpacity>

                    <View style={{flexDirection : 'row', marginTop : 30, alignItems : 'center', justifyContent : 'space-between'}}>
                        <TouchableOpacity  style={{justifyContent : 'center',alignItems : 'center',marginLeft : 20,height : 100, width : 180, backgroundColor : '#E5F7FF', borderRadius : 30}} disabled>
                            <Paragraph numberOfLines={3} style={{fontSize : 15, fontFamily : 'Outfit-Medium',  width : 130}}>{this.state.eventDetails.event_description}</Paragraph>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection : 'row',justifyContent : 'center',alignItems : 'center',marginRight : 20,height : 100, width : 150, backgroundColor : '#E5F7FF', borderRadius : 30}} onPress={()=>{createAlert(this.state.eventDetails.contact)}}>
                                <Image source={require('../assets/phone.png')} style={{height : 20, width : 20, marginLeft : 20, marginTop : 10}}/>
                                <Paragraph numberOfLines={2} style={{fontSize : 15, width : 100 ,fontFamily : 'Outfit-Medium', marginLeft : 10 ,marginTop : 10, color : '#000000'}}>{this.state.eventDetails.contact}</Paragraph>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 30, marginBottom: 10, paddingHorizontal: 30, alignItems: 'center', overflow: 'hidden'}}>
                        <Text style={{fontSize: 20, fontFamily: 'InterTight-Bold', color: '#000000'}}>Participants</Text>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                          <TouchableOpacity style={{height: 40, width: 80, borderRadius: 25, justifyContent: 'center', alignItems: 'center'}} onPress={()=>{handleMembers()}}>
                                <ImageBackground source={require('../assets/bg.jpg')} borderRadius={25} style={{height: 40, width: 80, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 15, fontFamily: 'InterTight-Bold', color: 'white'}}>Save</Text>
                                 </ImageBackground>
                            </TouchableOpacity>
                         </View>
                    </View>

                  
                    {
                        renderMembers()
                    }
                   
                   
                </ScrollView>
               
               

                 </View>
            
        )
    }
}
