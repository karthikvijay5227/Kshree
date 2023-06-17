import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, BackHandler } from "react-native";
import { createClient } from '@supabase/supabase-js';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class LoanUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loanDetails: [],
      monthlyPayment: '',
      expired: false
    }
  }

  componentDidMount() {
    // Add a back button event listener
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
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

  async componentDidMount() {
    const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
    const supabase = createClient(supabaseUrl, supabaseKey)
    let { data: obj1 } = await supabase.from('loan').select('*').eq('username', this.props.route.params.name)
    this.setState({ loanDetails: obj1 })
    let name = this.props.route.params.name
    let { data, error } = await supabase.rpc('monthly_payment', { p_username: name })
    this.setState({ monthlyPayment: data })

    let expirationDate = new Date(this.state.loanDetails[0]?.date);
    expirationDate.setMonth(expirationDate.getMonth() + Number(this.state.loanDetails[0]?.duration));
    let expiration = new Date(expirationDate).toISOString().slice(0, 10);
    let today = new Date().toISOString().slice(0, 10);

    let diff = Math.floor((Date.parse(expiration) - Date.parse(today)) / 86400000);

    if (diff > 0) {
      this.setState({ expired: false })
    }
    else {
      this.setState({ expired: true })
    }
  }

  render() {

    const updateDate = async () => {
      const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
      const supabase = createClient(supabaseUrl, supabaseKey)
      let name = this.props.route.params.name;
      const currentDate = (await supabase.from('loan').select('updatedate').eq('username', name)).data[0].updatedate;
      const startDate = (await supabase.from('loan').select('date').eq('username', name)).data[0].date;
      const duration = (await supabase.from('loan').select('duration').eq('username', name)).data[0].duration;
      const updatedDate = new Date(new Date(currentDate).setMonth(new Date(currentDate).getMonth() + 1)).toISOString().slice(0, 10);
      const finalDate = new Date(new Date(startDate).setMonth(new Date(currentDate).getMonth() + Number(duration))).toISOString().slice(0, 10);
      if (updateDate <= finalDate) {
        await supabase.from('loan').update({ updatedate: updatedDate }).eq('username', name);
        this.props.navigation.goBack();
      }
      else {
        await supabase.from('loan').delete().eq('username', name);
        this.props.navigation.goBack();
      }
    }


    const updateLoan = () => {

      if (this.state.expired) {
        return <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 14, color: 'red', marginTop: 30, marginRight: 30 }} >Loan Expired</Text>
      }
      else {
        return (
          <TouchableOpacity style={{ height: 40, width: 150, marginTop: 30, marginRight: 30, backgroundColor: '#90EE90', borderRadius: 10, justifyContent: 'center' }} onPress={() => { updateDate() }}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={require('../assets/checkmark.png')} style={{ height: 20, width: 20, alignSelf: 'center', marginLeft: 10 }} />
              <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, marginLeft: 10, color: 'black' }}>Mark as Paid</Text>
            </View>
          </TouchableOpacity>

        )
      }
    }
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignContent: 'flex-start', backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
          <TouchableOpacity style={{ marginLeft: 20, marginTop: 20, justifyContent: 'center', alignContent: 'center', elevation: 8, width: 45, height: 45, borderRadius: 50, backgroundColor: 'white', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 }} onPress={() => this.props.navigation.goBack()}>
            <Image source={require('../assets/arrow-left.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginLeft: 20, marginTop: 15 }}>Loan Users</Text>
        </View>
        <View style={{ flexDirection: 'row', marginLeft: 30, justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20, color: '#1A1110', marginTop: 30, }}>Details</Text>
          {
            updateLoan()
          }
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {this.state.loanDetails.length > 0 && (
            <TouchableOpacity style={{
              flex: 1,
              elevation: 10,
              shadowOffset: { width: 3, height: 3 },
              backgroundColor: 'white',
              borderRadius: 20,
              marginLeft: 20,
              marginTop: 30,
              width: width - 40,
              marginBottom: 20,
            }}
              disabled
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ fontSize: 18, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: '#1A1110' }}>Simple Credit</Text>
                  <Text style={{ fontSize: 13, fontFamily: 'Outfit-SemiBold', marginTop: 5, marginLeft: 20, color: '#808080' }}>Cash Loan</Text>
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 5, marginLeft: 20, color: '#1A1110' }}>{this.state.loanDetails[0]?.bank}</Text>
                </View>

                <View style={{ justifyContent: 'center', alignContent: 'center', borderRadius: 50, borderWidth: 2, height: 60, width: 60, marginRight: 30 }}>
                  <Image source={require('../assets/money.png')} style={{ height: 30, width: 30, alignSelf: 'center' }} />
                </View>
              </View>
              <View style={{ height: 1.2, width: width - 40, backgroundColor: '#d3d3d3', marginTop: 20, borderRadius: 20 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Loan Amount</Text>
                  <Text style={{ fontSize: 25, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>₹ {this.state.loanDetails[0]?.amount}</Text>
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Intrest Rate</Text>
                  <Text style={{ fontSize: 20, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>{this.state.loanDetails[0]?.rate}%</Text>
                </View>
                <View style={{ flexDirection: 'column', marginRight: 30 }}>
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Monthly Payment</Text>
                  <Text style={{ fontSize: 25, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>₹ {Math.round(this.state.monthlyPayment).toFixed(2)} </Text>
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Duration</Text>
                  <Text style={{ fontSize: 20, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>{this.state.loanDetails[0]?.duration} months</Text>
                </View>
              </View>

              <View style={{ height: 1.2, width: width - 40, backgroundColor: '#d3d3d3', marginTop: 20, borderRadius: 20 }} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'column', marginRight: 30 }}>
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Account Number</Text>
                  <Text style={{ fontSize: 16, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>{this.state.loanDetails[0]?.account} </Text>
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>IFSC code</Text>
                  <Text style={{ fontSize: 18, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>{this.state.loanDetails[0]?.ifsc}</Text>
                </View>
                <View style={{ flexDirection: 'column', marginRight: 50 }}>
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Branch</Text>
                  <Text style={{ fontSize: 16, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>{this.state.loanDetails[0]?.branch} </Text>
                </View>
              </View>

            </TouchableOpacity>

          )}
        </ScrollView>
      </View>
    )
  }
}