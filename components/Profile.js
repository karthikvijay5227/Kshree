import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { createClient } from '@supabase/supabase-js';

export default function Profile({ username }) {
  const [user, setUser] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
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
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profilePicContainer}>
        <Image source={require('../assets/profile.png')} style={styles.profilePic} />
        <Text style={{ fontFamily: 'InterTight-Bold', fontSize: 25, color: 'black', textAlign: 'center' }}>{"\n"}{`Hello, ${user}`}</Text>
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
              <Text style={styles.boldText}>Role:</Text> {role ? "Admin" : "Member"}
            </Text>
          </View>
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
    // backgroundColor: '#E0E0E0',
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
});

