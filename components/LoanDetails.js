import * as React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, StyleSheet, BackHandler } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { CountUp } from 'use-count-up';
import { createStackNavigator } from '@react-navigation/stack';
import LoanUser from '../components/LoanUser';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Stack = createStackNavigator();

export default class LoanDetails extends React.Component {
    render() {
        return (
            <Stack.Navigator initialRouteName="LoanInfo" screenOptions={{ headerShown: false }}>
                <Stack.Screen name='LoanInfo' component={LoanInfo} />
                <Stack.Screen name='LoanUser' component={LoanUser} />
            </Stack.Navigator>
        )
    }
}


class LoanInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            totalAmount: '',
            loanMembers: [],
            color: [].fill('#38E038')
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

    componentDidMount() {

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const { navigation } = this.props;
        this.onNavigate = navigation.addListener('focus', async () => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey)
            this.setState({ totalAmount: await supabase.rpc('calculate_total_amount') })
            let { data: obj1 } = await supabase.rpc('calculatemonthlypayment')
            this.setState({ loanMembers: obj1 })
        })

    }


    render() {

        const amount = parseInt(this.state.totalAmount.data)

        const handleLoanDetails = () => {

            const { navigation } = this.props;

            return (
                this.state.loanMembers.map((item, index) => {

                    return (
                        <TouchableOpacity key={index} activeOpacity={0.8} style={styles.names} onPress={() => navigation.navigate('LoanUser', { name: item.loan_username })}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 15, marginLeft: 10, color: "black" }}>{index + 1}.</Text>
                                <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 15, marginLeft: 10, color: "black" }}>{item.loan_username}</Text>
                            </View>
                            <View style={{ flexDirection: 'column', marginRight: 20 }}>
                                <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 15, color: '#38E038' }}>₹ {Math.round(item.amount).toFixed(2)}</Text>
                                <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 15, color: new Date(item.updatedate).toISOString().slice(0, 10) < new Date().toISOString().slice(0, 10) ? 'red' : '#38E038' }}>{item.updatedate}</Text>
                            </View>
                        </TouchableOpacity>


                    )
                })
            )
        }

        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity disabled style={{ elevation: 10, shadowOffset: 3, backgroundColor: 'white', borderRadius: 20, marginLeft: 20, marginTop: 30, width: width - 180, height: 100, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: "black" }}>Total Amount</Text>
                        <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 30, color: '#38E038', alignSelf: 'flex-end', marginRight: 30 }}>
                            ₹ <CountUp isCounting end={amount} duration={3} />
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity disabled style={{ elevation: 10, shadowOffset: 3, backgroundColor: 'white', borderRadius: 20, marginLeft: 10, marginTop: 30, width: width - 260, height: 100, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: "black" }}>Borrowers</Text>
                        <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 30, color: '#38E038', alignSelf: 'flex-end', marginRight: 30 }}>
                            <CountUp isCounting end={this.state.loanMembers.length} duration={3} />
                        </Text>
                    </TouchableOpacity>

                </View>

                <ScrollView style={{ marginTop: 30 }} contentContainerStyle={{ paddingBottom: 20, marginLeft: 30, width: width - 50, alignItems: 'center' }}>

                    {
                        handleLoanDetails()
                    }
                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    names: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        elevation: 5,
        shadowOffset: { width: 5, height: 2 },
        width: width - 70,
        shadowOpacity: 0.5,
        shadowRadius: 3,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10
    }
})