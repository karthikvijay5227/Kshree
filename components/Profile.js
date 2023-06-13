import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, BackHandler, ImageBackground, Dimensions } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function Profile({ navigation, username }) {
  const [user, setUser] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [backPressCount, setBackPressCount] = useState(0);

  navigation = useNavigation();

  async function fetchData() {
    const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
    const supabase = createClient(supabaseUrl, supabaseKey);
    let user = await supabase.from('users').select('name').eq('username', username);
    setUser(user.data[0].name);
    let phone = await supabase.from('users').select('phone_number').eq('username', username);
    setPhone(phone.data[0].phone_number);
    let address = await supabase.from('users').select('address').eq('username', username);
    setAddress(address.data[0].address);
    let role = await supabase.from('users').select('admin').eq('username', username);
    setRole(role.data[0].admin);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user'); // Remove the stored user data
      navigation.reset({
        index: 0,
        routes: [{ name: 'Registration' }],
      });
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/bg2.jpg')} style={{ height: 200, width: width }}>
        <View style={styles.profilePicContainer}>
          <Image source={require('../assets/profile.png')} style={styles.profilePic} />
          <View style={{ flexDirection: 'column', marginLeft: 20, marginBottom: 15 }}>
            <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 25, color: 'white' }}>{user}</Text>
            <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, color: 'white' }}>{role ? "Admin" : "Member"}</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.boxContainer}>
        <View style={styles.box}>
          <Text style={styles.aboutText}>
            <Text style={styles.boldText}>Name:</Text> {user}
            {"\n\n"}
            <Text style={styles.boldText}>Username:</Text> {username}
            {"\n\n"}
            <Text style={styles.boldText}>Phone:</Text> {phone}
            {"\n\n"}
            <Text style={styles.boldText}>Address:</Text> {address}
            {"\n\n"}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white'

  },
  profilePicContainer: {
    width: width - 50,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 30

  },
  profilePic: {
    width: 70,
    height: 70,
    marginLeft: 20,
  },
  boxContainer: {
    marginTop: height / 5,
    width: '92%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
  },
  box: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 8,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 50, // Add this to give some space at the top of the scroll view
  },
  aboutText: {
    fontSize: 20,
    lineHeight: 23,
    color: '#000',
    marginTop: 10,
  },
  boldText: {
    fontFamily: 'InterTight-Bold',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 45, // Adjust the spacing from the box view
    backgroundColor: '#e0453d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: 150,
    alignSelf: 'center',
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3
  },
  logoutButtonText: {
    color: 'white', // Set the text color to black
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});