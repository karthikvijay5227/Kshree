import react, {Component} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Alert,BackHandler } from "react-native";
import { createClient } from '@supabase/supabase-js';
import { createStackNavigator } from "@react-navigation/stack";
import { IconButton } from "react-native-paper";


const width = Dimensions.get('window').width;
const Stack = createStackNavigator();

export default class LoanApproval extends Component {

 render(){
    return(
       <Stack.Navigator initialRouteName="Loan Member Request" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Loan Conditions" component={LoanConditions} />
            <Stack.Screen name="Loan Member Request" component={LoanMemberRequest} />
         </Stack.Navigator>
    )
 }

}

class LoanMemberRequest extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            loanMemberRequest : []
        }
    }

    componentWillUnmount() {
        // Remove the back button event listener
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        // Handle the back button press
        this.props.navigation.goBack();
        return true; // Prevent the default back button action
    }
    
    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.from('loan').select('*').eq('approved', false);
        this.setState({loanMemberRequest : data});
        
    }

    render(){
    
        return(
            <View style={{flex : 1, backgroundColor : 'white'}}>
                <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginTop: 15, marginLeft: 25 }}>Requests</Text>
                <ScrollView>
                {
                    this.state.loanMemberRequest.map((item, index) => {
                        return(
                            <View key={index} style={{flexDirection : 'row', justifyContent : 'center',marginTop : 10}}>
                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('LoanConditions')}} style={{ elevation: 10, shadowOffset: 3, backgroundColor: 'white', borderRadius: 20, marginLeft: 10, marginTop: 10, width: width - 50, height: 100, justifyContent: 'flex-start', alignItems: 'flex-start',}}>
                             <View style={{marginLeft : 30, marginTop : 20}}>
                                <Text style={{fontFamily : 'Outfit-SemiBold',color : 'black' ,fontSize : 15}}>{item.username}</Text>
                                <View style={{flexDirection : 'row', justifyContent : 'space-between', width : width - 110}}>
                                    <View style={{flexDirection : 'column'}}>
                                        <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 13}}>Requesting an Amount of  ₹ {item.amount}</Text>
                                        <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 13}}>for {item.duration} months</Text>
                                    </View>
                                    <TouchableOpacity style={{height : 40, width : 40}}>
                                        <Image source={require('../assets/than.png')} style={{height : 40, width : 40}} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            </TouchableOpacity>
                             
                            </View>
                        )
                    })
                }
                </ScrollView>
            
            </View>
    
        )
    }

}

class LoanConditions extends react.Component{
    render(){
        return(
            <View>
                <Text>Loan Conditions</Text>
            </View>
        )
    }

}