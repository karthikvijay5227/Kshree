import * as React from 'react';
import { View, Text, ScrollView, Dimensions, RefreshControl} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Paragraph } from 'react-native-paper';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class EventDetails extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            eventDetails : [],
            refresh : true
        }
    }

    async componentDidMount(){
      
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey)
            let { data: obj} = await supabase.from('events').select('*').match({event_name : this.props.route.params.event})
            this.getEventDetails(obj[0])
    }

    getEventDetails = (data) => {
        this.setState({eventDetails : data})  
        setTimeout(()=>{this.setState({refresh : false})}, 1000)   
       
    }

    render(){
        


        return(
            
            <View style={{flex : 1, backgroundColor : 'white', width : width, height : height, justifyContent : 'center'}}>
                 <ScrollView contentContainerStyle={{flex : 1, width : width, justifyContent : 'flex-start', alignItems : 'flex-start'}}
             refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={()=>{mapEvents()}}/>}>
                  
                   <Text style={{fontSize : 30, marginLeft : 20 ,marginTop : 20, color : '#000000'}}>{this.state.eventDetails.event_name}</Text>
                   <Paragraph numberOfLines={3} style={{fontSize : 20, marginLeft : 20 ,marginTop : 20}}>{this.state.eventDetails.event_description}</Paragraph>
                   <Text style={{fontSize : 20, marginLeft : 20 ,marginTop : 20}}>Date : {this.state.eventDetails.date}</Text>
                   
                </ScrollView>
            </View>
            
        )
    }
}
