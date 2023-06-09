import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Card, Button } from 'react-native-paper';

export default function EventAttendance({ navigation, username }) {
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    // const [attensees, setAttensees] = useState([]);
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
                    style={{ height: 210, marginTop: 20, width: '100%' }}
                >
                    <Card.Title title={item.event_name} titleStyle={{ fontSize: 18 }} right={() => <Text style={{ color: 'black', marginRight: 30, fontSize: 16, marginBottom: 5 }}>Hello</Text>} />
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
                            style={{ marginTop: 47 }}
                            onPress={() => { }}
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
                style={{ marginTop: 20 }}
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
