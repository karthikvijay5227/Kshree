import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Dimensions, Image, ScrollView } from 'react-native';
import LoanStatus from '../components/LoanStatus';
import AboutUs from '../components/AboutUs';
import Profile from '../components/Profile';
import EventAttendance from '../components/EventAttendance';
import Registration from '../Screens/Registration';
import { IconButton } from 'react-native-paper';
import { createClient } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

function Logout(props) {
    const navigation = useNavigation();

    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Registration' }],
        });
    };

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
                label={() => (
                    <Text
                        style={{
                            color: "white",
                            textAlign: 'center',
                            backgroundColor: '#e34444',
                            padding: 10,
                            borderRadius: 18,
                            fontWeight: 'bold',
                        }}
                    >
                        Log Out
                    </Text>
                )}
                style={{ marginTop: height - 370 }}
                onPress={handleLogout}
            />
        </DrawerContentScrollView>
    );
}


export default function Members({ route }) {
    const { username } = route.params;

    return (
        <Stack.Navigator initialRouteName="Drawer" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Drawer">
                {(props) => <DrawerNavigation {...props} username={username} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

function DrawerNavigation({ username }) {
    return (
        <Drawer.Navigator initialRouteName="MemberHome" screenOptions={{ headerShown: false }} drawerContent={(props) => (
            <Logout {...props} />
        )}>
            <Drawer.Screen name="Home">
                {(props) => <MemberHome {...props} username={username} />}
            </Drawer.Screen>
            <Drawer.Screen name="Profile" options={{ headerShown: true, headerTitle: 'Profile' }}>
                {(props) => <Profile {...props} username={username} />}
            </Drawer.Screen>
            <Drawer.Screen name="Loan Status" options={{ headerShown: true, headerTitle: 'Loan Status' }} >
              {(props) => <LoanStatus {...props} username={username} />}
            </Drawer.Screen>
            <Drawer.Screen name="Event Attendance" options={{ headerShown: true, headerTitle: 'Event Attendance' }} >
                {(props) => <EventAttendance {...props} username={username} />}
            </Drawer.Screen>
            <Drawer.Screen name="InitialPage" component={Registration} options={{ headerShown: false, drawerItemStyle: { height: 0 } }} />
            <Drawer.Screen name="About" component={AboutUs} options={{ headerShown: true, headerTitle: 'About' }} />
        </Drawer.Navigator>
    )
}

function MemberHome({ navigation, username }) {
    const [events, setEvents] = useState([]);
    const userName = username;
    const [user, setUser] = useState('');

    useEffect(() => {
        async function fetchData() {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
            const supabase = createClient(supabaseUrl, supabaseKey);
            let eventData = await supabase.rpc('events');
            let user = await supabase.from('users').select('name').eq('username', userName);
            setEvents(eventData.data);
            setUser(user.data[0].name);
        }
        fetchData();
    }, []);

    const getDayOrdinalSuffix = (day) => {
        if (day === 1 || day === 21 || day === 31) {
            return 'st';
        } else if (day === 2 || day === 22) {
            return 'nd';
        } else if (day === 3 || day === 23) {
            return day + 'rd';
        } else {
            return 'th';
        }
    };

    const displayEvents = () => {
        return events.map((item, index) => {
            return (
                <View
                    key={index}
                    style={{
                        flexDirection: 'row',
                        height: 80,
                        width: width - 80,
                        alignItems: 'center',
                        borderColor: '#808080',
                        borderBottomWidth: 1,
                        marginTop: 10,
                    }}
                >
                    <View style={{ flexDirection: 'column' }}>
                        <Text
                            style={{
                                fontSize: 18,
                                fontFamily: 'Outfit-Light',
                                color: '#808080',
                            }}
                        >
                            {new Date(item.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                            }).slice(0, 3).toUpperCase()}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontFamily: 'Outfit-Bold',
                                    color: '#000000',
                                    letterSpacing: 2,
                                    marginTop: 5,
                                    alignItems: 'flex-end',
                                }}
                            >
                                {new Date(item.date).getDate()}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontFamily: 'Outfit-Light',
                                    color: '#000000',
                                    marginLeft: 5,
                                }}
                            >
                                {getDayOrdinalSuffix(new Date(item.date).getDate())}
                            </Text>
                        </View>
                    </View>
                    <Text
                        style={{
                            fontSize: 25,
                            fontFamily: 'Outfit-Medium',
                            color: '#1A1110',
                            marginLeft: 30,
                        }}
                    >
                        {item.event_name}
                    </Text>
                </View>
            );
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                <IconButton icon={require('../assets/hamburger-menu.png')} size={30} onPress={() => navigation.openDrawer()} />
                <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginLeft: 10, marginBottom: 5 }}>Homepage</Text>
            </View>
            <View style={{ width: 150, height: 150, borderRadius: 75, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                <Image source={require('../assets/profile.png')} style={{ width: 120, height: 120, borderRadius: 60, marginTop: 93 }} />
                <View style={{width:"170%"}}>
                    <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 25, color: 'black', textAlign: 'center' }}>{"\n"}{`Hello, ${user}`}</Text>
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, margin: width / 4.3 }}>
            </View>
            <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 25, color: 'black', marginLeft: 20, marginTop: 20 }}>Upcoming Events</Text>
            <ScrollView style={{ marginTop: 10, marginLeft: 30 }} showsVerticalScrollIndicator={false}>
                {displayEvents()}
            </ScrollView>
        </View>
    );
}