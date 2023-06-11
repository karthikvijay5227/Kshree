import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';

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

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Registration' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePicContainer}>
        <Image source={require('../assets/profile.png')} style={styles.profilePic} />
        <View style={{ width: '170%' }}>
          <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 25, color: 'black', textAlign: 'center' }}>
            {"\n"}
            {`Hello, ${user}`}
          </Text>
        </View>
      </View>
      <View style={styles.boxContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
              <Text style={styles.boldText}>Role:</Text> {role ? 'Admin' : 'Member'}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  profilePicContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 305,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  boxContainer: {
    marginTop: 30, // Adjust this value to move the box closer to the profile picture
    width: '92%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#f7edf6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
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
    shadowRadius: 3,
  },
  logoutButtonText: {
    color: 'white', // Set the text color to black
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
