import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, BackHandler, Modal, Alert } from "react-native";
import { createClient } from '@supabase/supabase-js';
import { Calendar } from 'react-native-calendars';
import { TextInput } from 'react-native-paper';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class LoanUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loanDetails: [],
      monthlyPayment: '',
      expired: false,
      currentDate: null,
      startDate: null,
      finalDate: null,
      duration: null,
      updatedDate: null,
      paidText: null,
      showWarning: false,
      error: false,
    }
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

    const currentDate = (await supabase.from('loan').select('updatedate').eq('username', name)).data[0].updatedate;
    const startDate = (await supabase.from('loan').select('date').eq('username', name)).data[0].date;
    const finalDate = (await supabase.from('loan').select('finaldate').eq('username', name)).data[0].finaldate;

    this.setState({
      currentDate: currentDate,
      startDate: startDate,
      finalDate: finalDate,

    })

    console.log(this.state.updatedDate)

    if (diff > 0) {
      this.setState({ expired: false })
    }
    else {
      this.setState({ expired: true })
    }
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

  render() {

    const updateDate = async () => {


      if (this.state.paidText === 'Update') {
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
        const supabase = createClient(supabaseUrl, supabaseKey)
        let name = this.props.route.params.name;

        const currentDate = (await supabase.from('loan').select('updatedate').eq('username', name)).data[0].updatedate;
        const finalDate = (await supabase.from('loan').select('finaldate').eq('username', name)).data[0].finaldate;
        const updatedDate = new Date(new Date(currentDate).setMonth(new Date(currentDate).getMonth() + 1)).toISOString().slice(0, 10);

        console.log(this.state.updatedDate)

        if (updatedDate <= finalDate) {
          await supabase.from('loan').update({ updatedate: updatedDate }).eq('username', name);
          this.props.navigation.goBack();
        }
        else {
          await supabase.from('loan').delete().eq('username', name);
          Alert.alert('Loan Completed', 'The loan has been fully paid and completed', [{
            text: 'Ok',
          }])
          this.props.navigation.goBack();
        }
      } else {
        this.setState({ error: true })
      }
    }

    const revertMarked = async () => {

      const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
      const supabase = createClient(supabaseUrl, supabaseKey)
      let name = this.props.route.params.name;

      const currentDate = (await supabase.from('loan').select('updatedate').eq('username', name)).data[0].updatedate;
      const finalDate = (await supabase.from('loan').select('finaldate').eq('username', name)).data[0].finaldate;
      const updatedDate = new Date(new Date(currentDate).setMonth(new Date(currentDate).getMonth() - 1)).toISOString().slice(0, 10);

      if (updatedDate <= finalDate && updatedDate >= this.state.startDate) {
        await supabase.from('loan').update({ updatedate: updatedDate }).eq('username', name);
        Alert.alert('Success', 'Reverted Marked Date', [{
          text: 'Ok',
        }])
        this.props.navigation.goBack();
      }
      else {
        Alert.alert('Error', 'Cannot revert marked date')
      }
    }

    const updateLoan = () => {

      if (this.state.expired) {
        return <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 14, color: 'red', marginTop: 30, marginRight: 30 }} >Loan Expired</Text>
      }
      else {
        return (
          <TouchableOpacity style={{ height: 40, width: 150, marginTop: 30, marginRight: 30, backgroundColor: '#90EE90', borderRadius: 10, justifyContent: 'center' }} onPress={() => { this.setState({ showWarning: true }) }}>
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
        <View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showWarning}
            onRequestClose={() => {
              this.setState({ showWarning: !this.state.showWarning })
            }}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(45, 45, 45, 0.5)' }}>
              <TouchableOpacity disabled style={{ backgroundColor: 'white', height: height / 2 - 10, width: width - 100, borderRadius: 20, elevation: 6, justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }} >
                  <Image source={require('../assets/warning.png')} style={{ height: 40, width: 40 }} />
                  <Text style={{ fontFamily: 'InterTight-Bold', color: '#454545', fontSize: 20, marginLeft: 10, marginTop: 5 }}>Warning!</Text>
                </View>

                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, marginTop: 30, width: 250 }}>
                  You are updating loan details of the user : <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 15, marginTop: 5, width: 'auto' }}>{this.state.deleteName}</Text>
                </Text>

                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, marginTop: 5, width: 250 }}>
                  To make sure that you are updating the loan type <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 15, marginTop: 5, width: 'auto', color: 'red' }}>Update</Text>
                  <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15 }}> in the below text feild</Text>
                </Text>

                <TextInput
                  label={'Update Loan'}
                  placeholder='Type in Update'
                  mode='outlined'
                  error={this.state.error}
                  value={this.state.paidText}
                  onChangeText={text => this.setState({ paidText: text })}
                  style={{ width: 250, marginTop: 20, alignSelf: 'center', backgroundColor: 'white' }}

                />

                <TouchableOpacity style={{ width: 250, height: 40, marginTop: 20, backgroundColor: '#D0312D', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => { updateDate() }}>
                  <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 15, color: 'white' }}>Update</Text>
                </TouchableOpacity>

              </TouchableOpacity>
            </View>
          </Modal>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
          <TouchableOpacity style={{ marginLeft: 20, marginTop: 20, justifyContent: 'center', alignContent: 'center', elevation: 8, width: 45, height: 45, borderRadius: 50, backgroundColor: 'white', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 }} onPress={() => this.props.navigation.goBack()}>
            <Image source={require('../assets/arrow-left.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginLeft: 20, marginTop: 15 }}>Loan Users</Text>
        </View>
        <View style={{ flexDirection: 'row', marginLeft: 30, paddingBottom: 30, justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 30, color: '#1A1110', marginTop: 30, }}>Details</Text>
          <View style={{ flexDirection: 'column' }}>
            {
              updateLoan()
            }
            <TouchableOpacity style={{ height: 40, width: 150, marginTop: 10, marginRight: 30, backgroundColor: '#FF7276', borderRadius: 10, justifyContent: 'center' }} onPress={() => { revertMarked() }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/cross.png')} style={{ height: 25, width: 25, alignSelf: 'center', marginLeft: 10 }} />
                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, marginLeft: 7, marginTop: 3, color: 'black' }}>Revert Marked</Text>
              </View>
            </TouchableOpacity>
          </View>
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
              marginBottom: 30,
              height: 500
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
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Interest Rate</Text>
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
          <Text style={{ fontFamily: 'InterTight-Bold', marginLeft: 30, marginTop: 20, fontSize: 20, color: 'black' }}>Calendar</Text>
          <View style={{ width: width - 30, height: 100, marginLeft: 40 }}>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity style={{ height: 20, width: 20, backgroundColor: '#90EE90', borderRadius: 50 }} />
              <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, color: '#1A1110' }} >  Indicates the Start Date of the Loan</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity style={{ height: 20, width: 20, backgroundColor: '#A2BAF5', borderRadius: 50 }} />
              <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, color: '#1A1110' }}>  Indicates the Last Payment Date that month</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity style={{ height: 20, width: 20, backgroundColor: '#FF7276', borderRadius: 50 }} />
              <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, color: '#1A1110' }}>  Indicates the Loan End Date</Text>
            </View>
          </View>

          <Calendar style={{ marginTop: 20, marginLeft: 30, marginRight: 30, paddingBottom: 30, borderRadius: 20 }} markedDates={{
            [String(this.state.startDate)]: { selected: true, marked: true, selectedColor: '#90EE90' },
            [String(this.state.currentDate)]: { selected: true, marked: true, selectedColor: '#A2BAF5' },
            [String(this.state.finalDate)]: { marked: true, selected: true, selectedColor: '#FF7276', activeOpacity: 0 }
          }}
            minDate={String(this.state.startDate)}
            maxDate={String(this.state.finalDate)}
          />
        </ScrollView>
      </View>
    )
  }
}