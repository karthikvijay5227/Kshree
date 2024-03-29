import React, { useState, useEffect } from 'react';
import config from '../config';
import { View, Text, Image, TouchableOpacity, Dimensions, BackHandler } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function LoanStatus({ username }) {
    let p_username = username;
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState('');
    const [duration, setDuration] = useState('');
    const [bank, setBank] = useState('');
    const [account, setAccount] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [branch, setBranch] = useState('');
    const [pay, setPay] = useState('');
    const [backPressCount, setBackPressCount] = useState(0);
    const [loanpaid, setLoanpaid] = useState(true);

    let navigation = useNavigation();


    async function fetchData() {
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
        const supabaseKey = config.SUPABASE_API_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);
        try {
            let amount = await supabase.from('loan').select('amount').eq('username', username);
            setAmount(amount.data[0].amount);
            let rate = await supabase.from('loan').select('rate').eq('username', username);
            setRate(rate.data[0].rate);
            let duration = await supabase.from('loan').select('duration').eq('username', username);
            setDuration(duration.data[0].duration);
            let bank = await supabase.from('loan').select('bank').eq('username', username);
            setBank(bank.data[0].bank);
            let account = await supabase.from('loan').select('account').eq('username', username);
            setAccount(account.data[0].account);
            let ifsc = await supabase.from('loan').select('ifsc').eq('username', username);
            setIfsc(ifsc.data[0].ifsc);
            let branch = await supabase.from('loan').select('branch').eq('username', username);
            setBranch(branch.data[0].branch);
            let pays = await supabase.rpc('monthly_payment', { p_username })
            setPay(pays.data);
            let date = await supabase.from('loan').select('updatedate').eq('username', username);
            if (date.data[0].updatedate < new Date().toISOString().slice(0, 10)) {
                setLoanpaid(false);
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => backHandler.remove();
    }, []);

    const handleBackPress = () => {
        navigation.goBack();
        return true;
    };

    if (amount != 0) {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row', marginLeft: 30, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20, color: '#1A1110', marginTop: 30, }}>Status : </Text>
                    {
                        loanpaid ? <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20, color: '#38E038', marginTop: 30, marginLeft: 10 }}>Loan Paid</Text> : <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20, color: 'red', marginTop: 30, marginLeft: 20 }}>Loan Not Paid</Text>
                    }
                </View>
                <TouchableOpacity style={{ elevation: 10, shadowOffset: 3, backgroundColor: 'white', borderRadius: 20, marginLeft: 20, marginTop: 30, width: width - 40, height: height - 200 }} disabled>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: '#1A1110' }}>Simple Credit</Text>
                            <Text style={{ fontSize: 13, fontFamily: 'Outfit-SemiBold', marginTop: 5, marginLeft: 20, color: '#808080' }}>Cash Loan</Text>
                            <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 5, marginLeft: 20, color: '#1A1110' }}>{bank}</Text>
                        </View>

                        <View style={{ justifyContent: 'center', alignContent: 'center', borderRadius: 50, borderWidth: 2, height: 60, width: 60, marginRight: 30 }}>
                            <Image source={require('../assets/money.png')} style={{ height: 30, width: 30, alignSelf: 'center' }} />
                        </View>
                    </View>
                    <View style={{ height: 1.2, width: width - 40, backgroundColor: '#d3d3d3', marginTop: 20, borderRadius: 20 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Loan Amount</Text>
                            <Text style={{ fontSize: 25, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>₹ {amount}</Text>
                            <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Interest Rate</Text>
                            <Text style={{ fontSize: 20, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>{rate}%</Text>
                        </View>
                        <View style={{ flexDirection: 'column', marginRight: 30 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Monthly Payment</Text>
                            <Text style={{ fontSize: 25, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>₹ {Math.round(pay).toFixed(2)} </Text>
                            <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Duration</Text>
                            <Text style={{ fontSize: 20, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>{duration} months</Text>
                        </View>
                    </View>

                    <View style={{ height: 1.2, width: width - 40, backgroundColor: '#d3d3d3', marginTop: 20, borderRadius: 20 }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'column', marginRight: 30 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Account Number</Text>
                            <Text style={{ fontSize: 16, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>{account} </Text>
                            <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>IFSC code</Text>
                            <Text style={{ fontSize: 18, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>{ifsc}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', marginRight: 50 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Branch</Text>
                            <Text style={{ fontSize: 16, fontFamily: 'Outfit-SemiBold', marginTop: 2, marginLeft: 20, color: 'black' }}>{branch} </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:"white" }}>
                <Image source={require('../assets/nodata.jpg')} style={{ height: 150, width: width - 50, marginTop: 40 }} />
                <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20, color: 'black' }}>No Loans Applied</Text>
            </View>
        )
    }
}
