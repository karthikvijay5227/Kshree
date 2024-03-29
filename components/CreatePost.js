import React, { useState, useEffect } from 'react';
import config from '../config';
import { View, TextInput, Image, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Text, Dimensions, BackHandler, Keyboard } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';


export default function CreatePost() {
    const [task, setTask] = useState('');
    const [submittedTasks, setSubmittedTasks] = useState([]);
    const [keyboardStatus, setKeyboardStatus] = useState(false);

    let navigation = useNavigation();

    useEffect(() => {
        fetchSubmittedTasks();
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardStatus(true);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardStatus(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        fetchSubmittedTasks();
    }, []);

    const fetchSubmittedTasks = async () => {
        // Fetch submitted tasks from Supabase
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
        const supabaseKey = config.SUPABASE_API_KEY
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase.from('Posts').select('*');
        if (error) {
            throw new Error('Failed to fetch posts');
        }

        // Format the created_at timestamp to a human-readable format
        const formattedData = data.map((post) => ({
            task: post.posts,
            created_at: moment(post.created_at).format('ddd, MMM DD, YYYY h:mm A'),
        }));

        setSubmittedTasks(formattedData);
    };

    const handleAddTask = async () => {
        if (task.trim() !== '') {
            setSubmittedTasks([...submittedTasks, { task, created_at: moment().format('ddd, MMM DD, YYYY h:mm A') }]);
            setTask('');
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
            const supabaseKey = config.SUPABASE_API_KEY
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data, error } = await supabase
                .from('Posts')
                .insert([{ posts: task, created_at: new Date() }]);

            const channel = supabase.channel('notif');
            channel.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    channel.send({
                        type: 'broadcast',
                        event: 'supa',
                        payload: { task }
                    })
                }
            })
            if (keyboardStatus) {
                Keyboard.dismiss();
            }
            if (error) {
                throw new Error('Failed to create post');
            }
        }
    };

    const handleDeleteTask = async (index) => {
        const submittedTask = submittedTasks[index];
        const updatedTasks = [...submittedTasks];
        updatedTasks.splice(index, 1);
        setSubmittedTasks(updatedTasks);

        // Delete the task from Supabase
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
        const supabaseKey = config.SUPABASE_API_KEY
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
            .from('Posts')
            .delete()
            .match({ posts: submittedTask.task });

        if (error) {
            throw new Error('Failed to delete post');
        }
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => backHandler.remove();
    }, []);

    const handleBackPress = () => {
        navigation.goBack();
        return true;
    };

    return (
        <View style={styles.container}>
            <View style={styles.taskWrapper}>
                <ScrollView
                    style={[
                        styles.items,
                        keyboardStatus && styles.itemsWithKeyboard // Apply conditional style
                    ]}
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    {submittedTasks.map((submittedTask, index) => (
                        <View key={index} style={styles.submittedTask}>
                            <View style={styles.submittedTaskTextContainer}>
                                <Text style={styles.submittedTaskText}>{submittedTask.task}</Text>
                                <Text style={{ color: 'gray', fontSize: 12, marginTop: 6 }}>{submittedTask.created_at}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleDeleteTask(index)}>
                                <Image source={require('../assets/delete.png')} style={styles.deleteIcon} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
            {keyboardStatus ? (
                <View style={styles.keyboardBackground} />
            ) : null}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.writeTaskWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder={'Create a post'}
                    placeholderTextColor="#bfbfbf"
                    value={task}
                    onChangeText={(text) => setTask(text)}
                />
                <TouchableOpacity onPress={handleAddTask}>
                    <View style={styles.addWrapper}>
                        <Image source={require('../assets/paper-plane.png')} style={styles.addImage} />
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8EAED',
    },
    taskWrapper: {
        paddingTop: 25,
        paddingHorizontal: 20,
    },
    items: {
        marginTop: 30,
        maxHeight: "79%",                      //610
        minHeight: '100%',
    },
    submittedTask: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    submittedTaskTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    submittedTaskText: {
        color: 'black',
        flexWrap: 'wrap',
        fontSize: 18
    },
    deleteIcon: {
        width: 20,
        height: 20,
        tintColor: 'red',
    },
    writeTaskWrapper: {
        position: 'absolute',
        bottom: 25,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderRadius: 60,
        borderColor: '#C0C0C0',
        borderWidth: 1,
        width: Dimensions.get('window').width - 100,
        color: 'black',
    },
    addWrapper: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#C0C0C0',
        borderWidth: 1,
    },
    addImage: {
        width: 30,
        height: 30,
    },
    keyboardBackground: {
        position: 'absolute',
        top: "75%",                      //330
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#E8EAED',
    },
    itemsWithKeyboard: {
        maxHeight: "79%",                      //610
        minHeight: '45%',
    },
});