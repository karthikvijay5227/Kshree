import react, {Component} from "react";
import config from '../config';
import { View, Text, Image, ScrollView, Dimensions, Alert, LayoutAnimation, BackHandler, RefreshControl } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { createClient } from '@supabase/supabase-js';
import { createStackNavigator } from "@react-navigation/stack";


const width = Dimensions.get('window').width;
const Stack = createStackNavigator();

export default class LoanApproval extends Component {

 render(){
    return(
       <Stack.Navigator initialRouteName="Loan Member Request" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Loan Member Request" component={LoanMemberRequest} />
         </Stack.Navigator>
    )
 }

}

class LoanMemberRequest extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            loanMemberRequest : [],
            height : [],
            toggled : [],
            image : [],
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
    
    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
        const supabaseKey = config.SUPABASE_API_KEY
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.from('loan').select('*').eq('approved', false);
        this.setState({loanMemberRequest : data});
        this.setState({height : Array(this.state.loanMemberRequest.length).fill(100)});
        this.setState({toggle : Array(this.state.loanMemberRequest.length).fill(false)});
        this.setState({image : Array(this.state.loanMemberRequest.length).fill(require('../assets/than.png'))})        
    }

    render(){

        const increaseHeight = (index) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            const newValues = [...this.state.height];
            const newToggled = [...this.state.toggled];
            newValues[index] = this.state.toggled[index] ? 100 : 150;
            newToggled[index] = !this.state.toggled[index];
            this.setState({ height: newValues, toggled: newToggled });
            
          
        }

        const approve =  async(name, index) => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = config.SUPABASE_API_KEY
            const supabase = createClient(supabaseUrl, supabaseKey);
            await supabase.from('loan').update({approved : true}).eq('username', name);
            const ImageChange = [...this.state.image];
            ImageChange[index] = require('../assets/correct.png');
            this.setState({image : ImageChange});

        }

        const reject = async(name,index) => {
           
            const ImageChange = [...this.state.image];
            ImageChange[index] = require('../assets/wrong.png');
            this.setState({image : ImageChange});
            await supabase.from('loan').update({approved : false}).eq('username', name);
        }

        const onRefresh = async() => {
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
        const supabaseKey = config.SUPABASE_API_KEY
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.from('loan').select('*').eq('approved', false);
        this.setState({loanMemberRequest : data});
        this.setState({height : Array(this.state.loanMemberRequest.length).fill(100)});
        this.setState({toggle : Array(this.state.loanMemberRequest.length).fill(false)});
        this.setState({image : Array(this.state.loanMemberRequest.length).fill(require('../assets/than.png'))});
        }


        const displayRequest = () => {
            
            if(this.state.loanMemberRequest.length != 0){
            return(                               
                this.state.loanMemberRequest.map((item, index) => {
                    return(
                     <View key={index} style={{flexDirection : 'row', justifyContent : 'center',marginTop : 10, bottom : 10,}}>
                        <TouchableOpacity onPress={()=>{increaseHeight(index)}} style={[{elevation: 10, shadowOffset: 3, backgroundColor: 'white', borderRadius: 20,height : 100, marginLeft: 10 ,marginTop: 10, width: width - 50, justifyContent: 'flex-start', alignItems: 'flex-start'},{height: this.state.height[index] }]}>
                        <View style={{marginTop : 20, marginLeft : 20}}>
                            <Text style={{fontFamily : 'Outfit-SemiBold',color : 'black' ,fontSize : 15}}>{item.name}</Text>
                            <View style={{flexDirection : 'row', justifyContent : 'space-between', width : width - 110}}>
                                <View style={{flexDirection : 'column'}}>
                                    <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 13}}>Requesting an Amount of  ₹ {item.amount}</Text>
                                    <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 13}}>for {item.duration} months</Text>
                                </View>
                                <TouchableOpacity style={{height : 40, width : 40}}>
                                    <Image source={this.state.image[index]} style={{height : 40, width : 40}} />
                                </TouchableOpacity>
                            </View>
                        {
                            this.state.toggled[index] && (
                
                                <View style={{flexDirection : 'row', justifyContent : 'flex-end', width : width - 110, marginTop : 20}}>
                                 <TouchableOpacity onPress={()=>{approve(item.username, index)}} style={{height : 35, width : 75, backgroundColor : 'green', justifyContent : 'center',alignItems : 'center', elevation : 10, borderRadius : 30}}>
                                    <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 13, color : 'white'}}>Approve</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{reject(item.username, index)}} style={{height : 35, width : 75, backgroundColor : 'red', marginLeft : 5,justifyContent : 'center',alignItems : 'center', elevation : 10, borderRadius : 30}}>
                                    <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 13, color : 'white'}}>Reject</Text>
                                    </TouchableOpacity>
                                </View>
                              
                            )
                        }

                        </View>
                        </TouchableOpacity>
                        </View>
                    )
                })

            )}
            else{
                return(
                    <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                       <Image source={require('../assets/requests.jpg')} style={{height : 250, width : width - 50, marginTop : 100}} />
                       <Text style={{fontFamily : 'Outfit-SemiBold', fontSize : 20, color : 'black'}}>No Requests</Text>
                    </View>
                )
            }
        }

    
        return(
            <View style={{flex : 1, backgroundColor : 'white'}}>
                <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginTop: 15, marginLeft: 25 }}>Requests</Text>
                <ScrollView  refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={()=>{onRefresh()}} />}>
                {
                  displayRequest()
                }
                </ScrollView>
            
            </View>
    
        )

       
    }

}


