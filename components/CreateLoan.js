import react, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Alert, BackHandler,Image,RefreshControl} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createClient } from '@supabase/supabase-js';
import { IconButton, TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class LoanList extends Component {
    render(){
        return(
            <Stack.Navigator initialRouteName="LoanView" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoanList" component={LoanList} />
                <Stack.Screen name="CreateLoan" component={CreateLoan} />
                <Stack.Screen name="LoanView" component={LoanView} />
                <Stack.Screen name="LoanMembers" component={LoanMembers} />
            </Stack.Navigator>
        )
    }
}


class LoanMembers extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            members : [],
            loan : [],
            refresh : false,
            loanname : this.props.route.params.name,
            duration : this.props.route.params.duration,
            amount : this.props.route.params.amount,
            rate : this.props.route.params.rate

        }
    }
    
    componentDidMount(){
      
            this._unsubscribe = this.props.navigation.addListener('focus', async() => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey);
            let { data: data} = await supabase.from('loan').select('*').eq('loanname', this.state.loanname);
            this.setState({members : data});
            })
            
        }
       

    render(){

        const { navigation } = this.props;

        const onRefresh = async() => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey);
            let { data: data} = await supabase.from('loan').select('*').eq('loanname', this.state.loanname);
            this.setState({members : data});
        }


        const DisplayMembers = () => {

           if(this.state.members.length != 0)
            return(
                this.state.members.map((item, index) => {
                    return(
                        <TouchableOpacity key={index} activeOpacity={1} style={{justifyContent : 'center',height : 60, width : width - 50, elevation : 10,backgroundColor : 'white', borderRadius : 10}}>
                            
                            <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                               <Text style={{fontFamily : 'Outfit-Bold', color : 'black' ,fontSize : 15, marginLeft : 20, marginTop : 10}}>{item.name}</Text>
                               <IconButton icon={require('../assets/delete.png')} size={20} onPress={()=>{deleteMember(item.username)}} style={{marginRight : 20, elevation : 10}}/>
                            </View>
                        </TouchableOpacity>
                    );
                })
            )
            else{
                return(
                    <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                            <Image source={require('../assets/nodata.jpg')} style={{height : 170, width : width - 50}} />
                            <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 20, color : 'black'}}>No Members Applied</Text>
                    </View>
                )
            }
        }


        const deleteMember = async (name) => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey);
            Alert.alert('Delete Member', 'Are you sure you want to delete this member from the loan?', [
                {
                    text : 'Yes',
                    onPress : async() => {  
                        await supabase.from('loan').delete().eq('username', name); 
                        onRefresh();
                        DisplayMembers();
                       
                    }
                },
                {
                    text : 'No',
                    
                }
            ])

            
           
        }

        const DeleteLoan = async () => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey);
            Alert.alert('Delete Loan', 'Are you sure you want to delete this loan?', [
                {
                    text : 'Yes',
                    onPress : async() => { 
                        await supabase.from('loan').delete().eq('loanname', this.state.loanname);
                        await supabase.from('Loans').delete().eq('loanname', this.state.loanname);
                        navigation.goBack();
                    }

                },
                {
                    text : 'No'
                }
            ])
        }
        
        
        
        return(
            <View style={{backgroundColor : 'white', flex : 1}}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, marginTop: 20, width: width }}>
                    <TouchableOpacity style={{ marginLeft: 20, marginTop: 15, justifyContent: 'center', alignContent: 'center', elevation: 8, width: 45, height: 45, borderRadius: 50, backgroundColor: 'white', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 }} onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/arrow-left.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginTop: 15, marginLeft: 25 }}>{this.state.loanname}</Text>
                </View>
                <TouchableOpacity disabled style={{ height: 230, elevation : 5, width: width - 40, borderRadius: 10,backgroundColor : 'white',  justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 30, marginLeft : 20 }}>
                    <View style={{flexDirection : 'row',justifyContent : 'space-between',alignItems : 'center'}}>
                       <View style={{justifyContent : 'flex-start', alignItems : 'flex-start', marginLeft : 10}}>
                         <Text style={{ fontSize: 16, fontFamily: 'InterTight-Bold', color: 'black', marginLeft : 10 }}>Loan Details</Text>
                         <Text style={{ fontSize: 15, fontFamily: 'InterTight-Bold', color: '#808080', marginLeft : 10, marginTop : 15 }}>Amount : ₹ {this.state.amount}</Text>
                         <Text style={{ fontSize: 15, fontFamily: 'InterTight-Bold', color: '#808080', marginLeft : 10, marginTop : 5 }}>Duration : {this.state.duration} months</Text>
                         <Text style={{ fontSize: 15, fontFamily: 'InterTight-Bold', color: '#808080', marginLeft : 10, marginTop : 5 }}>Rate :  {this.state.rate} %</Text>
                       </View>
                       <Image source={require('../assets/members.jpg')} style={{height : 150, width : 170, marginLeft : 10, marginTop : 20}}/>
                    </View>

                    <TouchableOpacity onPress={()=>{DeleteLoan()}} style={{marginTop : 10,height : 35, width : 100, backgroundColor : '#FF7F7F', marginLeft : 20,justifyContent : 'center',alignItems : 'center', elevation : 10, borderRadius : 5}}>
                      <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 13, color : 'white'}}>Delete Loan</Text>
                    </TouchableOpacity>

                </TouchableOpacity>

                <Text style={{ fontSize: 20, fontFamily: 'InterTight-Bold', color: 'black', marginLeft : 30, marginTop : 30}}>Members</Text>
                <ScrollView style={{marginTop : 10}} contentContainerStyle={{alignItems : 'center', paddingBottom : 20}}
                    refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={()=>{onRefresh()}} />}>
                {
                    DisplayMembers()
                }
                </ScrollView>


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

        const displayLoans = () => {
            
            if(this.state.loans.length != 0){
            return(
                
                this.state.loans.map((item, index) => {
                    return(
                        <TouchableOpacity key={index} activeOpacity={1} style={{height : 200, width : width - 50, elevation : 10,marginTop : 20 ,backgroundColor : 'white', borderRadius : 10}} onPress={()=>{navigation.navigate('LoanMembers',{name : item.loanname, duration : item.duration, amount : item.amount,rate : item.rate })}}>
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
            )}
            else {
                return(
                    <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                          <Image source={require('../assets/no-data-sorry.jpg')} style={{height : 250, width : width - 50, marginTop : 100}} />
                            <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 20, color : 'black'}}>No Loans Created</Text>
                    </View>
                )
            }
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
               <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, marginTop: 20, width: width }}>
                    <TouchableOpacity style={{ marginLeft: 20, marginTop: 15, justifyContent: 'center', alignContent: 'center', elevation: 8, width: 45, height: 45, borderRadius: 50, backgroundColor: 'white', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 }} onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/arrow-left.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginTop: 15, marginLeft: 25 }}>Loans</Text>
                </View>

                <TouchableOpacity style={{ height: 50, elevation : 5, width: 150, borderRadius: 10,backgroundColor : 'white',  justifyContent: 'center', alignItems: 'flex-start', marginTop: 30, marginLeft : 20 }} onPress={() => { navigation.navigate('CreateLoan') }}>
                    <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'flex-start', marginLeft : 20}}>
                        <Image source={require('../assets/plus.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                        <Text style={{ fontSize: 15, fontFamily: 'InterTight-Bold', color: 'green', marginLeft : 10 }}>Add Loan</Text>
                     </View>
                </TouchableOpacity>
                
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

class CreateLoan extends Component {
    
    constructor(props){
        super(props);
        this.state = {
          loanName : '',
          loanAmount : '',
          loanInterest : '',
          loanDuration : '',
        }
    }


    
    render(){
        
        const { navigation } = this.props;

        const handleAddLoan = async () => {
                const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
                const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
                const supabase = createClient(supabaseUrl, supabaseKey);
                
                this.state.loanAmount = this.state.loanAmount.replace(/[,.]/g, "");
                this.state.loanDuration = this.state.loanDuration.replace(/[,.]/g, "");        
           
                try{
                    await supabase.from('Loans').insert([
                        {
                            loanname : this.state.loanName,
                            amount : Number(this.state.loanAmount),
                            interest_rate : parseFloat(this.state.loanInterest),
                            duration : Number(this.state.loanDuration),
                        }
                    ]);

                    if(await supabase.from('Loans').select('loanname').eq('loanname', this.state.loanName)){
                        Alert.alert('Loan Created', 'Loan has been created successfully');
                        navigation.goBack();
                    }
                
                }
                catch(e){
                    Alert.alert('Loan Was Not Created', e.message);
                
            }
        }

        return(
            <View style={{backgroundColor : 'white', flex : 1}}>
               <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, marginTop: 20, width: width }}>
                    <TouchableOpacity style={{ marginLeft: 20, marginTop: 15, justifyContent: 'center', alignContent: 'center', elevation: 8, width: 45, height: 45, borderRadius: 50, backgroundColor: 'white', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 }} onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/arrow-left.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 30, color: 'black', marginTop: 15, marginLeft: 25 }}>Loan Creation</Text>
                </View>

                <TextInput
                    label="Loan Name"
                    mode="outlined"
                    value={this.state.loanName}
                    onChangeText={text => this.setState({ loanName : text })}
                    style={{marginLeft : 20, marginRight : 20, marginTop : 50}}
                />

                <TextInput
                    label="Loan Amount"
                    mode="outlined"
                    value={this.state.loanAmount}
                    keyboardType='numeric'
                    onChangeText={text => this.setState({ loanAmount : text })}
                    style={{marginLeft : 20, marginRight : 20, marginTop : 20}}
                />

                <TextInput
                    label="Loan Interest"
                    mode="outlined"
                    value={this.state.loanInterest}
                    keyboardType='numeric'
                    onChangeText={text => this.setState({ loanInterest : text })}
                    style={{marginLeft : 20, marginRight : 20, marginTop : 20}}
                />

                <TextInput
                    label="Loan Duration"
                    mode="outlined"
                    value={this.state.loanDuration}
                    keyboardType='numeric'
                    onChangeText={text => this.setState({ loanDuration : text })}
                    style={{marginLeft : 20, marginRight : 20, marginTop : 20}}
                />

                <TouchableOpacity style={{ height: 50, elevation : 5, width: 120, borderRadius: 10,backgroundColor : 'white',  justifyContent: 'center', alignItems: 'flex-start', marginTop: 30, marginLeft : 20 }} onPress={() => { handleAddLoan()}}>
                    <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'flex-start', marginLeft : 20}}>
                        <Text style={{ fontSize: 15, fontFamily: 'InterTight-Bold', color: 'green', marginLeft : 10 }}>Add Loan</Text>
                    </View>
                </TouchableOpacity>


            </View>
        )
    }
}