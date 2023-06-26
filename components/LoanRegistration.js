import * as React from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { createClient } from '@supabase/supabase-js';
import { TextInput } from 'react-native-paper';
import { duration } from 'moment/moment';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class LoanRegistartion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            selectedUser: '',
            amount: '',
            purpose: '',
            rate: '',
            duration: '',
            bank: '',
            account: '',
            ifsc: '',
            branch: '',
            error: false
        }
    }

    async componentDidMount() {
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
        const supabase = createClient(supabaseUrl, supabaseKey);
        let { data: obj2 } = await supabase.from('users').select('name');
        obj2 = obj2.map((item) => {
            return item.name;
        })
        this.setState({ users: obj2 })

    }

    render() {

        const handleLoanMembers = async () => {

            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey);

            if (this.state.selectedUser == '' || this.state.amount == '' || this.state.purpose == '' || this.state.rate == '' || this.state.duration == '' || this.state.bank == '' || this.state.account == '' || this.state.ifsc == '' || this.state.branch == '') {
                Alert.alert("Please Fill All the Fields");

            }
            else {

                const finalDate = new Date(new Date().setMonth(parseInt(new Date().getMonth()) + parseInt(this.state.duration) - 1)).toISOString().slice(0, 10);


                try {
                    await supabase.from('loan').insert([{
                        username: this.state.selectedUser,
                        amount: this.state.amount,
                        purpose: this.state.purpose,
                        rate: this.state.rate,
                        duration: this.state.duration.valueOf(),
                        bank: this.state.bank,
                        account: this.state.account,
                        ifsc: this.state.ifsc,
                        branch: this.state.branch,
                        finaldate: finalDate
                    }])
                }
                catch (e) {
                    Alert.alert("Error in Registering Loan");
                }
            }
            Alert.alert("Loan Registered Successfully");

        }

        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'white' }}>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: width - 80, marginTop: 50 }}>

                        <SelectList
                            placeholder='Member Name'
                            search={false}
                            setSelected={(value) => this.setState({ selectedUser: value })}
                            data={this.state.users}
                            save='value'
                        />
                    </View>

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Amount"
                        mode='outlined'
                        value={this.state.amount}
                        onChangeText={text => this.setState({ amount: text })}
                        keyboardType='numeric'
                        left={<TextInput.Affix text="₹" />}
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Loan Purpose"
                        mode='outlined'
                        value={this.state.purpose}
                        onChangeText={text => this.setState({ purpose: text })}
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Interest Rate"
                        mode='outlined'
                        value={this.state.rate}
                        onChangeText={text => this.setState({ rate: text })}
                        keyboardType='numeric'
                        left={<TextInput.Affix text="%" />}
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Duration"
                        mode='outlined'
                        value={this.state.duration}
                        onChangeText={text => this.setState({ duration: text })}
                        keyboardType='numeric'
                        right={<TextInput.Affix text="Months" />}
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Bank Name"
                        mode='outlined'
                        value={this.state.bank}
                        onChangeText={text => this.setState({ bank: text })}
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Account Number"
                        mode='outlined'
                        error={this.state.error}
                        value={this.state.account}
                        onChangeText={text => this.setState({ account: text })}
                        keyboardType='numeric'
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="IFSC Code"
                        mode='outlined'
                        value={this.state.ifsc}
                        onChangeText={text => this.setState({ ifsc: text })}
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Branch"
                        mode='outlined'
                        value={this.state.branch}
                        onChangeText={text => this.setState({ branch: text })}
                    />

                    <TouchableOpacity style={{ height: 40, width: 80, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: 30, paddingBottom: 20 }} onPress={() => { handleLoanMembers() }}>
                        <ImageBackground source={require('../assets/bg.jpg')} borderRadius={5} style={{ height: 40, width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 15, fontFamily: 'InterTight-Bold', color: 'white' }}>Submit</Text>
                        </ImageBackground>
                    </TouchableOpacity>

                    <View style={{ marginBottom: 20 }}></View>


                </ScrollView>



            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
