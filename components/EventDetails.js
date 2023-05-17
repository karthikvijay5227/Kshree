import * as React from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Paragraph,Button } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';

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

    async componentDidMount(){
      
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey)
            let { data: obj} = await supabase.from('events').select('*').match({event_name : this.props.route.params.event})
            this.getEventDetails(obj[0])
            let { data: obj2} = await supabase.from('users').select('username');
            this.setState({users :  Object.entries(obj2)})
            
            let checkedState = this.state.users.map(() => false);
            this.setState({ checked: checkedState });
           

            
    }

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

        return(
            
            <View style={{flex : 1, backgroundColor : 'white'}}>
                 <ScrollView contentContainerStyle={{height : height}}>
                  
                   <Text style={{fontSize : 30,fontFamily : 'InterTight-Bold', marginLeft : 20 ,marginTop : 20, color : '#000000'}}>{this.state.eventDetails.event_name}</Text>
                   <View style={{flexDirection : 'row'}}>
                        <TouchableOpacity style={{backgroundColor : '#ECF8F8', height : 40, width : 100, marginLeft : 20, marginTop : 30 ,borderRadius : 30}}>
                            <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'flex-start'}}>
                                <Image source={require('../assets/clock.png')} style={{height : 20, width : 20, marginTop : 10, marginLeft : 5}}/>
                                <Text style={{fontSize : 15, fontFamily : 'Outfit-Medium', marginLeft : 10 ,marginTop : 10, color : '#000000'}}>{this.state.eventDetails.time}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{backgroundColor : '#ECF8F8', height : 40, width : 200, marginLeft : 20, marginTop : 30 ,borderRadius : 30}}>
                            <View style={{flexDirection : 'row', justifyContent : 'center'}}>
                                <Image source={require('../assets/calendar.png')} style={{height : 20, width : 20, marginTop : 10, marginLeft : 5}}/>
                                <Text style={{fontSize : 15, fontFamily : 'Outfit-Medium', marginLeft : 10 ,marginTop : 10, color : '#000000'}}>{this.state.eventDetails.date}</Text>
                             </View>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={{backgroundColor : '#ECF8F8', height : 40, width : 130 , marginLeft : 20, marginTop : 10 ,borderRadius : 30}}>
                         <View style={{flexDirection : 'row', alignItems :'flex-start',justifyContent : 'center', marginLeft : 9}}>
                             <Image source={require('../assets/placeholder.png')} style={{height : 20, width : 20, alignSelf : 'center',marginTop : 7}}/>
                             <Paragraph numberOfLines={1} style={{fontSize : 15, width : 80 ,fontFamily : 'Outfit-Medium', marginLeft : 10 ,marginTop : 10, color : '#000000'}}>{this.state.eventDetails.location}</Paragraph>
                         </View>
                    </TouchableOpacity>

                    <View style={{flexDirection : 'row', marginTop : 30}}>
                        <TouchableOpacity  style={{justifyContent : 'center',alignItems : 'center',marginLeft : 20,height : 100, width : 180, backgroundColor : '#E5F7FF', borderRadius : 30}} >
                            <Paragraph numberOfLines={3} style={{fontSize : 15, fontFamily : 'Outfit-Medium',  width : 130}}>{this.state.eventDetails.event_description}</Paragraph>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection : 'row',justifyContent : 'center',alignItems : 'center',marginLeft : 10,height : 100, width : 150, backgroundColor : '#E5F7FF', borderRadius : 30}} >
                                <Image source={require('../assets/phone.png')} style={{height : 20, width : 20, marginLeft : 20, marginTop : 10}}/>
                                <Paragraph numberOfLines={2} style={{fontSize : 15, width : 100 ,fontFamily : 'Outfit-Medium', marginLeft : 10 ,marginTop : 10, color : '#000000'}}>{this.state.eventDetails.contact}</Paragraph>
                        </TouchableOpacity>
                    </View>
                                   
                   <Text style={{fontSize : 20,fontFamily : 'InterTight-Bold', marginLeft : 30 ,marginTop : 50, color : '#000000'}}>Participants</Text>
                  
                    {
                        renderMembers()
                    }
                   
                </ScrollView>
                 </View>
            
        )
    }
}
