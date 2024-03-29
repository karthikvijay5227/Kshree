import React, { useEffect, useState } from 'react';
import config from '../config';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import LoanStatus from '../components/LoanStatus';
import AboutUs from '../components/AboutUs';
import Profile from '../components/Profile';
import EventAttendance from '../components/EventAttendance';
import LoanRequests from '../components/LoanRequests';
import Registration from '../Screens/Registration';
import ProfileEdit from '../components/ProfileEdit';
import Notify from '../components/Notify';
import { IconButton } from 'react-native-paper';
import { createClient } from '@supabase/supabase-js';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

function DrawerHeader({ username, ...props }) {
    const navigation = useNavigation();
    const [name, setName] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
                const supabaseKey = config.SUPABASE_API_KEY;
                const supabase = createClient(supabaseUrl, supabaseKey);
                const { data, error } = await supabase
                    .from('users')
                    .select('name')
                    .eq('username', username);

                if (error) {
                    console.log('Error fetching user data:', error.message);
                } else {
                    if (data && data.length > 0) {
                        setName(data[0].name);
                    }
                }
            } catch (error) {
                console.log('Error fetching user data:', error.message);
            }
        };

        fetchUserData();
    }, [username]);

    const handleLogout = async () => {
        try {
                const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
                const supabaseKey = config.SUPABASE_API_KEY;
                const supabase = createClient(supabaseUrl, supabaseKey);
            
            await AsyncStorage.removeItem('user'); // Remove the stored user data
            navigation.reset({
                index: 0,
                routes: [{ name: 'Registration' }],
            });
            await supabase.from('users').update({ login: false }).eq('username', username);
        } catch (error) {
            console.log('Error logging out:', error);
        }
    };

    return (
        <DrawerContentScrollView {...props}>
            <View style={{ marginTop: 8, marginHorizontal: 10, borderRadius: 15, marginBottom: 15, backgroundColor: '#e6eefa', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
                <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 18, marginLeft: 10 }}>
                    <Image
                        source={require('../assets/profile.png')}
                        style={{ width: 50, height: 50, borderRadius: 60 }}
                    />
                    <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 20, color: 'black', marginTop: 10, marginBottom: 15, paddingRight: 18 }}>
                        {name}
                    </Text>
                </View>
            </View>
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
                style={{ marginTop: height * 0.29 }}
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
            <Stack.Screen name="ProfileEdit" options={{ headerShown: false }}>
                {(props) => <ProfileEdit {...props} username={username} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

function DrawerNavigation({ username }) {
    return (
        <Drawer.Navigator initialRouteName="MemberHome" screenOptions={{ headerShown: false }} drawerContent={(props) => (
            <DrawerHeader {...props} username={username} />
        )}>
            <Drawer.Screen name="Home">
                {(props) => <MemberHome {...props} username={username} />}
            </Drawer.Screen>
            <Drawer.Screen name="Profile" options={{ headerShown: true, headerTitle: 'Profile' }}>
                {(props) => <Profile {...props} username={username} />}
            </Drawer.Screen>
            <Drawer.Screen name="Notifications" options={{ headerShown: true, headerTitle: 'Notifications' }}>
                {(props) => <Notify {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="Loan Status" options={{ headerShown: true, headerTitle: 'Loan Status' }} >
                {(props) => <LoanStatus {...props} username={username} />}
            </Drawer.Screen>
            <Drawer.Screen name="Event Attendance" options={{ headerShown: true, headerTitle: 'Event Attendance' }} >
                {(props) => <EventAttendance {...props} username={username} />}
            </Drawer.Screen>
            <Drawer.Screen name="Loan Request" options={{ headerShown: true, headerTitle: 'Loan Request' }} >
                {(props) => <LoanRequests {...props} username={username} />}
            </Drawer.Screen>
            <Drawer.Screen name="InitialPage" component={Registration} options={{ headerShown: false, drawerItemStyle: { height: 0 } }} />
            <Drawer.Screen name="About" component={AboutUs} options={{ headerShown: false, headerTitle: 'About' }} />
        </Drawer.Navigator>
    )
}

function MemberHome({ navigation, username }) {
    const [events, setEvents] = useState([]);
    const userName = username;
    const [user, setUser] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    async function fetchData() {
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
        const supabaseKey = config.SUPABASE_API_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);
        let eventData = await supabase.rpc('events');
        let user = await supabase.from('users').select('name').eq('username', userName);

        PushNotification.channelExists("post", function (exists) {
            if (!exists) {
                PushNotification.createChannel(
                    {
                        channelId: "post", // (required)
                        channelName: "myNotificationChannel", // (required)
                        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
                        playSound: true, // (optional) default: true
                        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
                    },
                    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
                );
            }
        });

        try {
            let date = await supabase.from('loan').select('updatedate').eq('username', userName);
            if (date.data[0].updatedate < new Date().toISOString().slice(0, 10)) {
                PushNotification.localNotification({
                    channelId: "post",
                    title: "Loan Status",
                    message: "Your Have Not Paid your loan for this month",
                })
            }
        }
        catch (e) {
            console.log(e);
        }

        const channel = supabase.channel('notif');
        channel.on('broadcast', { event: 'supa' }, (payload) => {
            PushNotification.localNotification({
                channelId: "post",
                title: "New Notification",
                message: "You have a new notification from the admin",
                onlyAlertOnce: true,
            })
        }).subscribe()

        channel.on('broadcast', { event: 'delete' }, async (payload) => {
            if (payload.payload.task.username === userName) {

                await AsyncStorage.removeItem('user');
                Alert.alert("Your account has been deleted", "Please register again to continue using the app", [
                    {
                        text: "OK"
                    }
                ])

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Registration' }],
                });
            }
        })
        setEvents(eventData.data);
        setUser(user.data[0].name);
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
            const supabaseKey = config.SUPABASE_API_KEY;
            const supabase = createClient(supabaseUrl, supabaseKey);
            let eventData = await supabase.rpc('events');
            let user = await supabase.from('users').select('name').eq('username', userName);
            setEvents(eventData.data);
            setUser(user.data[0].name);
        })
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const handleBellPress = () => {
        navigation.navigate('Notifications');
    };

    useFocusEffect(
        React.useCallback(() => {
            const handleBackPress = () => {
                BackHandler.exitApp();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', handleBackPress);

            return () => {
                // Clean up event listener when the screen loses focus or unmounts
                BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            };
        }, [])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData(); // Fetch the data from the database
        setRefreshing(false);
    };

    const getDayOrdinalSuffix = (day) => {
        if (day === 1 || day === 21 || day === 31) {
            return 'st';
        } else if (day === 2 || day === 22) {
            return 'nd';
        } else if (day === 3 || day === 23) {
            return 'rd';
        } else {
            return 'th';
        }
    };

    const displayEvents = () => {
        return events.length != 0 ? events.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', height: 80, width: width - 80, alignItems: 'center', borderColor: '#808080', borderBottomWidth: 1, marginTop: 10 }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontSize: 18, fontFamily: 'Outfit-Light', color: '#808080' }}>
                        {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3).toUpperCase()}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Outfit-Bold', color: '#000000', letterSpacing: 2, marginTop: 5, alignItems: 'flex-end' }}>{new Date(item.date).getDate()}</Text>
                        <Text style={{ fontSize: 18, fontFamily: 'Outfit-Light', color: '#000000', marginLeft: 5 }}>
                            {getDayOrdinalSuffix(new Date(item.date).getDate())}
                        </Text>
                    </View>
                </View>
                <Text style={{ fontSize: 25, fontFamily: 'Outfit-Medium', color: '#1A1110', marginLeft: 30 }}>{item.event_name}</Text>
            </View>
        )) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/nodata.jpg')} style={{ height: 150, width: width - 50, marginTop: 40 }} />
                <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20, color: 'black' }}>No Upcoming Events</Text>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                <IconButton icon={require('../assets/hamburger-menu.png')} size={30} onPress={() => navigation.openDrawer()} />
                <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginLeft: 10, marginBottom: 5 }}>Homepage</Text>
            </View>
            <View style={styles.deleteIconContainer}>
                <TouchableOpacity onPress={handleBellPress}>
                    <Image source={require('../assets/notifications.png')} style={{ width: 27, height: 27 }} />
                </TouchableOpacity>
            </View>
            <View style={{ width: 150, height: 150, borderRadius: 75, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                <Image source={require('../assets/profile.png')} style={{ width: 120, height: 120, borderRadius: 60, marginTop: 93 }} />
                <View style={{ width: "170%" }}>
                    <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 25, color: 'black', textAlign: 'center' }}>{"\n"}{`Hello, ${user}`}</Text>
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, margin: width / 4.3 }}>
            </View>
            <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 25, color: 'black', marginLeft: 20, marginTop: 20 }}>Upcoming Events</Text>
            <ScrollView style={{ marginTop: 10, marginLeft: 30 }} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }>
                {displayEvents()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    deleteIconContainer: {
        position: 'absolute',
        top: 45,
        right: 20,
        zIndex: 1,
    },
});