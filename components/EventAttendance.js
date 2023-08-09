import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, BackHandler, Dimensions,Image } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const width = Dimensions.get('window').width;

export default function EventAttendance({ navigation, username }) {
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [attend, setAttend] = useState([]);

    navigation = useNavigation();
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


    const fetchData = async () => {
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.from('events').select('*');

        if (error) {
            console.error('Error fetching events:', error);
            return;
        }
        setEvents(data);

        // Fetch presence data for each event
        const presencePromises = data.map(async (event) => {
            const { data: presence, error: presenceError } = await supabase.rpc('checkuser', {
                eventname: event.event_name,
                username: username,
            });
            if (presenceError) {
                console.error('Error fetching presence:', presenceError);
                return null;
            }
            return presence;
        });
        const presenceData = await Promise.all(presencePromises);
        setAttend(presenceData);
    };


    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    };

    const mapEvents = () => {
        return events.length != 0 ?
            events.map((item, index) => {
                return (
                    <Card
                        key={index}
                        style={{ height: 210, marginTop: 5, width: width - 40, marginBottom: 20 }}
                    >
                        <Card.Title title={item.event_name} titleStyle={{ fontSize: 18 }} right={() => {
                            const presence = attend[index];
                            const status = presence ? "Present" : "Absent";
                            const statusColor = presence ? "green" : "red";
                            return <Text style={{ color: statusColor, marginRight: 30, fontSize: 16, marginBottom: 5 }}>{status}</Text>;
                        }} />
                        <Card.Content>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', color: '#000000' }}>
                                    Event Description:{' '}
                                </Text>
                                <Text style={{ marginLeft: 5, color: '#000000' }}>
                                    {item.event_description}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', color: '#000000' }}>
                                    Location:{' '}
                                </Text>
                                <Text style={{ marginLeft: 5, color: '#000000' }}>
                                    {item.location}
                                </Text>
                            </View>
                            <Button
                                mode='contained'
                                style={{ marginTop: 30 }}
                            >
                                Price: {item.profit}
                            </Button>
                        </Card.Content>
                    </Card>
                );
            })
            : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/nodata.jpg')} style={{ height: 150, width: width - 50, marginTop: 40 }} />
                    <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20, color: 'black' }}>No Upcoming Events</Text>
                </View>
            );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={{ marginTop: 20, height: "90%" }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {mapEvents()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});