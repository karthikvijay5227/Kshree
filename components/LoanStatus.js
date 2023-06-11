import React, { useState, useEffect } from 'react';
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

    let navigation = useNavigation();


    async function fetchData() {
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
        const supabase = createClient(supabaseUrl, supabaseKey);
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
    }
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => backHandler.remove();
    }, []);

    const handleBackPress = () => {
        if (backPressCount < 1) {
            setBackPressCount(backPressCount + 1);
            navigation.navigate('Home');
            setTimeout(() => {
                setBackPressCount(0);
            }, 2000); // Reset backPressCount after 2 seconds
            return true;
        } else {
            BackHandler.exitApp();
            return false;
        }
    };

    if (amount != 0) {
        return (
            <View>
                <View style={{ flexDirection: 'row', marginLeft: 30, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20, color: '#1A1110', marginTop: 30, }}>Status</Text>
                    {/* <View style={{ height: 40, width: 150, marginTop: 30, marginRight: 30, backgroundColor: '#90EE90', borderRadius: 10, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, marginLeft: 30, color: 'black' }}>Mark as Paid</Text>
                        </View>
                    </View> */}
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
                            <Text style={{ fontSize: 15, fontFamily: 'Outfit-SemiBold', marginTop: 20, marginLeft: 20, color: 'grey' }}>Intrest Rate</Text>
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
            <View style={{ elevation: 10, shadowOffset: { width: 0, height: 2 }, shadowColor: 'rgba(0, 0, 0, 0.25)', shadowOpacity: 1, shadowRadius: 4, backgroundColor: 'white', borderRadius: 20, marginLeft: 20, marginTop: 30, width: width - 40, height: 200 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 25, fontFamily: 'Outfit-SemiBold', color: 'black' }}>No Loan Applied</Text>
                </View>
            </View>

        );
    }
}

