import React, { useState, useEffect } from 'react';
import config from '../config';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import LoanDetails from '../components/LoanDetails';
import LoanList from '../components/CreateLoan';
import LoanApproval from '../components/LoanApproval';
import KudumbashreeRegistration from '../components/KudumbashreeRegistration';
import Events from '../components/Events';
import Profile from '../components/Profile';
import Registration from '../Screens/Registration';
import CreatePost from '../components/CreatePost';
import AboutUs from '../components/AboutUs';
import { IconButton } from 'react-native-paper';
import { createClient } from '@supabase/supabase-js';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import ProfileEdit from '../components/ProfileEdit';
import UserDetails from '../components/UserDetails';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const width = Dimensions.get('window').width;

function DrawerHeader({ username, ...props }) {
    const [name, setName] = useState(null);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
                const supabaseKey = config.SUPABASE_API_KEY;
                const supabase = createClient(supabaseUrl, supabaseKey);
                const { data, error } = await supabase.from('users').select('name').eq('username', username);
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
        </DrawerContentScrollView>
    );
}

export default function Admin({ route }) {
    const { username } = route.params;
    return (
        <Stack.Navigator
            initialRouteName="Drawer"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Drawer" options={{ headerShown: false }}>
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
        <Drawer.Navigator initialRouteName="AdminHome" drawerContent={(props) => (
            <DrawerHeader {...props} username={username} />
        )}>
            <Drawer.Screen name="Home" options={{ headerShown: false }}>
                {(props) => <AdminHome {...props} username={username} />}
            </Drawer.Screen>
            <Drawer.Screen name="Profile" options={{ headerShown: true, headerTitle: 'Profile' }}>
                {(props) => <Profile {...props} username={username} />}
            </Drawer.Screen>
            <Drawer.Screen name="User Details" component={UserDetails} options={{ headerShown: false }} />
            <Drawer.Screen name="Create Post" component={CreatePost} />
            <Drawer.Screen name="Loan Details" component={LoanDetails} />
            <Drawer.Screen name="Loan Creation" component={LoanList} options={{ headerShown: false }} />
            <Drawer.Screen name="Loan Approval" component={LoanApproval} />
            <Drawer.Screen name="Kudumbashree Registration" component={KudumbashreeRegistration} options={{ headerTitle: 'Member Registration' }} />
            <Drawer.Screen name="Events" component={Events} />
            <Drawer.Screen name="Registration" component={Registration} options={{ headerShown: false, drawerItemStyle: { height: 0 } }} />
            <Drawer.Screen name="About" component={AboutUs} options={{ headerShown: false, headerTitle: 'About' }} />
        </Drawer.Navigator>
    );
}

function AdminHome({ username }) {

    const navigation = useNavigation();
    const [events, setEvents] = useState([]);
    const [userNumber, setUserNumber] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
        const supabaseKey = config.SUPABASE_API_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);
        const unsubscribe = navigation.addListener('focus', async () => {

            let eventData = await supabase.rpc('events');
            setEvents(eventData.data);
            let userNumber = await supabase.rpc('get_total_users');
            setUserNumber(userNumber.data);
        });
    }, []);


    const fetchEvents = async () => {
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
        const supabaseKey = config.SUPABASE_API_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);
        let eventData = await supabase.rpc('events');
        setEvents(eventData.data);
        let userNumber = await supabase.rpc('get_total_users');
        setUserNumber(userNumber.data);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchEvents(); // Fetch the data from the database
        setRefreshing(false);
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

    const handleLogout = async () => {
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
        const supabaseKey = config.SUPABASE_API_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);
        try {
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

    const displayEvents = () => {
        function getDayOrdinalSuffix(day) {
            if (day === 1 || day === 21 || day === 31) {
                return 'st';
            } else if (day === 2 || day === 22) {
                return 'nd';
            } else if (day === 3 || day === 23) {
                return 'rd';
            } else {
                return 'th';
            }
        }

        if (events.length != 0) {
            return events.map((item, index) => (
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
            ));
        }
        else {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/nodata.jpg')} style={{ height: 150, width: width - 50, marginTop: 40 }} />
                    <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20, color: 'black' }}>No Upcoming Events</Text>
                </View>
            )
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginLeft: 15 }}>
                <IconButton icon={require('../assets/hamburger-menu.png')} size={30} onPress={() => navigation.openDrawer()} />
                <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 30, color: 'black', marginLeft: 10, marginBottom: 5 }}>Homepage</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: 200, width: width - 200, marginTop: 30, marginLeft: 20, borderRadius: 20, backgroundColor: 'white', elevation: 8, shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.5, shadowRadius: 3 }} disabled >
                    <AnimatedCircularProgress
                        size={150}
                        width={25}
                        fill={userNumber / 50 * 360}
                        tintColor="#38E038"
                        backgroundColor="white"
                        padding={10}
                        duration={2000}
                        lineCap='round'
                    >
                        {(fill) => (
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 25, color: 'black' }}>{userNumber}</Text>
                                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, color: 'black' }}>Users</Text>
                            </View>
                        )}
                    </AnimatedCircularProgress>
                </TouchableOpacity>

                <View style={{ flexDirection: 'column' }}>
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: 150, marginTop: 30, marginLeft: 10, borderRadius: 10, backgroundColor: 'white', elevation: 8, shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.5, shadowRadius: 3 }} activeOpacity={0.9} onPress={() => { navigation.navigate('Events') }} >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Image source={require('../assets/event.png')} style={{ height: 20, width: 20 }} />
                            <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 14, color: 'black', letterSpacing: 0.5, marginLeft: 10 }} >Create Event</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: 150, marginTop: 20, marginLeft: 10, borderRadius: 10, backgroundColor: 'white', elevation: 8, shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.5, shadowRadius: 3 }} activeOpacity={0.8} onPress={() => { navigation.navigate('Kudumbashree Registration') }} >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Image source={require('../assets/plus.png')} style={{ height: 20, width: 20 }} />
                            <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 15, color: 'black', letterSpacing: 0.5, marginLeft: 10 }} >Add User</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: 150, marginTop: 20, marginLeft: 10, borderRadius: 10, backgroundColor: '#EE4A4A', elevation: 8, shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.5, shadowRadius: 3 }} onPress={handleLogout}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 18, color: 'white', letterSpacing: 0.5 }} >Logout</Text>
                            <Image source={require('../assets/logout.png')} style={{ height: 20, width: 20, marginLeft: 20 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 25, color: 'black', marginLeft: 30, marginTop: 40 }}>Upcoming Events</Text>
            <ScrollView style={{ alignSelf: 'center' }} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }>{displayEvents()}</ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    }
});