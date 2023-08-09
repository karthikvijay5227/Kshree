import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, BackHandler, Image } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Card } from 'react-native-paper';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function Notify() {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    let navigation = useNavigation();
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
        const { data, error } = await supabase.from('Posts').select('id,posts, created_at').order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching posts:', error);
            return;
        }
        setPosts(data);
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    };

    const renderPosts = () => {
        if (posts.length === 0) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/nodata.jpg')} style={{ height: 150, width: width - 50, marginTop: 40 }} />
                    <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 20, color: 'black' }}>No New Notifications</Text>
                </View>
            )
        }

        return posts.map((post, index) => {
            const createdAt = moment(post.created_at).format('ddd, MMM DD, YYYY h:mm A');
            return (
                <Card
                    key={index}
                    style={{ height: 110, marginTop: 10, width: '100%', marginBottom: 20 }}
                >
                    <Card.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ marginLeft: 5, color: '#000000', fontSize: 18 }}>
                                {post.posts}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ marginLeft: 5, color: 'gray' }}>
                                {createdAt}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>
            );
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={{ marginTop: 20, height: '100%', width: '90%' }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {renderPosts()}
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
    noNotificationsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noNotificationsBox: {
        elevation: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOpacity: 1,
        shadowRadius: 4,
        backgroundColor: '#d3d3d3',
        borderRadius: 20,
        width: width - 40,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noNotificationsText: {
        fontSize: 25,
        fontFamily: 'Outfit-SemiBold',
        color: 'black',
    },
    deleteIcon: {
        width: 25,
        height: 25,
    },
});