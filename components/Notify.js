import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, TouchableOpacity, Image } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Card } from 'react-native-paper';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function Notify() {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

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

    const handleDeleteTask = async (index) => {
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const postToDelete = posts[index];

        const { data, error } = await supabase
            .from('Posts')
            .delete()
            .eq('id', postToDelete.id);

        if (error) {
            throw new Error('Failed to delete post');
        }
        // Refresh the data after successful deletion
        fetchData();
    };


    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    };

    const renderPosts = () => {
        if (posts.length === 0) {
            return (
                <View style={styles.noNotificationsContainer}>
                    <View style={styles.noNotificationsBox}>
                        <Text style={styles.noNotificationsText}>No Notifications</Text>
                    </View>
                </View>
            );
        }

        return posts.map((post, index) => {
            const createdAt = new Date(post.created_at).toLocaleString();
            return (
                <Card
                    key={index}
                    style={{ height: 110, marginTop: 10, width: '100%', marginBottom: 20 }}
                >
                    <Card.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ marginLeft: 5, color: '#000000', fontSize: 20 }}>
                                {post.posts}
                            </Text>
                            <TouchableOpacity onPress={() => handleDeleteTask(index)}>
                                <Image source={require('../assets/delete.png')} style={styles.deleteIcon} />
                            </TouchableOpacity>
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
