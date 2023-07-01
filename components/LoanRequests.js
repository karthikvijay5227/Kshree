import react, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Alert, RefreshControl,BackHandler } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createClient } from '@supabase/supabase-js';
import { ScrollView } from 'react-native-gesture-handler';
import ApplyLoan from '../components/ApplyLoan';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const Stack = createStackNavigator();

export default class LoanRequests extends Component {

   
    render(){

        
        

        return(
            <Stack.Navigator initialRouteName="LoanView" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoanRequests" component={LoanRequests} />
                <Stack.Screen name="LoanView" component={LoanView}/>
                <Stack.Screen name="LoanRegistration" component={LoanRegistertion}  />
                <Stack.Screen name="ApplyLoan" component={ApplyLoan}/>
               
            </Stack.Navigator>
        )
    }

}


class LoanRegistertion extends Component {

   constructor(props) {
    super(props);
    this.state = {
        loans : this.props.route.params.loan,
        amount : ''
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

   componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    let rate = parseFloat(this.state.loans.interest_rate);
    let duration = Number(this.state.loans.duration);
    let loan = Number(this.state.loans.amount);
    this.setState({amount :  Math.round( (loan/duration + (loan/duration)*(rate)).toFixed(2)).toFixed(2)})
   }

   
   
    render(){
        
        const {navigation} = this.props;
        

        return(
            <View style={{flex : 1, backgroundColor : 'white', justifyContent : 'flex-start'}}>
                 <Text style={{ fontSize: 30, fontFamily: 'InterTight-Bold', marginLeft: 20, marginTop : 30, color: '#000000' }}>{this.state.loans.loanname}</Text>
                 
                 <TouchableOpacity style={{
              height: 420,
              marginTop: 40,
              elevation: 10,
              shadowOffset: { width: 3, height: 3 },
              backgroundColor: 'white',
              borderRadius: 20,
              marginLeft: 20,
              width: width - 40,
            }}
              disabled
            >
             
                 
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop : 20 }}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ fontSize: 18, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: '#1A1110' }}>Simple Credit</Text>
                  <Text style={{ fontSize: 13, fontFamily: 'Outfit-SemiBold', marginTop: 5, marginLeft: 20, color: '#808080' }}>Cash Loan</Text>
                 </View>

                <View style={{ justifyContent: 'center', alignContent: 'center', borderRadius: 50, borderWidth: 2, height: 60, width: 60, marginRight: 30 }}>
                  <Image source={require('../assets/money.png')} style={{ height: 30, width: 30, alignSelf: 'center' }} />
                </View>
              </View>
              <View style={{ height: 1.2, width: width - 40, backgroundColor: '#d3d3d3', marginTop: 20, borderRadius: 20 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Loan Amount</Text>
                  <Text style={{ fontSize: 25, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>₹ {this.state.loans.amount}</Text>
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Intrest Rate</Text>
                  <Text style={{ fontSize: 20, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>{this.state.loans.interest_rate}%</Text>
                </View>
                <View style={{ flexDirection: 'column', marginRight: 30 }}>
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Monthly Payment</Text>
                  <Text style={{ fontSize: 25, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>₹ {this.state.amount}</Text>
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Duration</Text>
                  <Text style={{ fontSize: 20, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>{this.state.loans.duration} months</Text>
                </View>
              </View>

              <TouchableOpacity style={{height : 30, alignSelf : 'center', marginTop : 50}} onPress={()=>{navigation.navigate('ApplyLoan', {loan : this.state.loans })}}>
                <View style={{ height: 50, width: width - 200, backgroundColor: '#1A1110', borderRadius: 10, justifyContent: 'center', alignContent: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: 20, fontFamily: 'Outfit-SemiBold', alignSelf: 'center', color: 'white' }}>Apply Loan</Text>
                </View>
                </TouchableOpacity>
            </TouchableOpacity>
            </View>
        )
    }
}

class LoanView extends Component {


    constructor(props){
        super(props);
        this.state = {
          loans : [],
          refresh : false
        }
    }

    componentDidMount(){
        
        this._unsubscribe = this.props.navigation.addListener('focus', async() => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
            const supabase = createClient(supabaseUrl, supabaseKey);
            let { data: data, error } = await supabase.from('Loans').select('*');
            this.setState({loans : data});
        });
        
    }

    

    render(){

        const { navigation } = this.props;

        const handleApplication = async(name,index) => {
            
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
            const supabase = createClient(supabaseUrl, supabaseKey);
            const {isAdmin, username} =  JSON.parse(await AsyncStorage.getItem('user'))
            let data = (await supabase.from('Loans').select('members').eq('loanname', name)).data[0].members
            try{
                if(data.includes(username) != null){
                    Alert.alert('Already Applied')
                }
                else{
                    this.props.navigation.navigate('LoanRegistration', {loan : this.state.loans[index]})
                }
            }
            catch(e){
                this.props.navigation.navigate('LoanRegistration', {loan : this.state.loans[index]})
            }
            
            
           
        }

        const displayLoans = () => {
            
            return(
                this.state.loans.map((item, index) => {
                    return(
                        <TouchableOpacity key={index} onPress={()=>{handleApplication(item.loanname, index)}} activeOpacity={1} style={{height : 200, width : width - 50, elevation : 10,marginTop : 20 ,backgroundColor : 'white', borderRadius : 10}}>
                            <Text style={{fontFamily : 'Outfit-Bold', color : '#38E038' ,fontSize : 30, marginLeft : 20, marginTop : 10}}>{item.loanname}</Text>
                            <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                                <TouchableOpacity disabled style={{flexDirection : 'column', elevation : 2 ,justifyContent : 'center' , marginLeft : 10, marginTop : 10 ,width : width - 200, height : 120, backgroundColor : 'white', borderRadius : 10, justifyContent : 'center'}}>
                                <Text style={{fontFamily : 'Outfit-Medium', color : '#808080' ,fontSize : 15, marginLeft : 20, marginTop : 10}}>Amount : ₹ {item.amount}</Text>
                                <Text style={{fontFamily : 'Outfit-Medium', color : '#808080' ,fontSize : 15, marginLeft : 20, marginTop : 10}}>Interest : {item.interest_rate} %</Text>
                                <Text style={{fontFamily : 'Outfit-Medium', color : '#808080' ,fontSize : 15, marginLeft : 20, marginTop : 10}}>Duration : {item.duration} months</Text>
                                </TouchableOpacity>
                                <Image source={require('../assets/greater-than.png')} style={{height : 50, width : 50, marginRight : 20}}/>
                            </View>
                            
                        </TouchableOpacity>
                    );
                }
                )
            )
        }

        const onRefresh = async() => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
            const supabase = createClient(supabaseUrl, supabaseKey);
            let { data: data, error } = await supabase.from('Loans').select('*');
            this.setState({loans : data});
            displayLoans();
        }

       

        return(
            <View style={{backgroundColor : 'white', flex : 1}}>
                           
                <ScrollView style={{marginTop : 10}} contentContainerStyle={{alignItems : 'center', paddingBottom : 20}}
                 refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={()=>{onRefresh()}} />}>
                {
                    displayLoans()
                }
                </ScrollView>

            </View>
        )
    }
}