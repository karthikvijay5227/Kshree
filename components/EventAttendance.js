import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Card, Button } from 'react-native-paper';

export default function EventAttendance({ navigation, username }) {
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [attend, setAttend] = useState([]);
    // const [eventname, setEventName] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

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
        return events.map((item, index) => {
            return (
                <Card
                    key={index}
                    style={{ height: 210, marginTop: 5, width: '100%', marginBottom: 20 }}
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
        });
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
