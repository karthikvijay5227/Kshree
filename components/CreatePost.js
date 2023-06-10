import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Text } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import moment from 'moment';

export default function CreatePost() {
    const [task, setTask] = useState('');
    const [submittedTasks, setSubmittedTasks] = useState([]);

    const handleAddTask = async () => {
        if (task.trim() !== '') {
            setSubmittedTasks([...submittedTasks, { task, created_at: moment().format('YYYY-MM-DD HH:mm:ss') }]);
            setTask('');
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data, error } = await supabase
                .from('Posts')
                .insert([{ posts: task, created_at: new Date() }]);
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
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase
            .from('Posts')
            .delete()
            .match({posts: submittedTask.task });


        if (error) {
            throw new Error('Failed to delete post');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.taskWrapper}>
                <ScrollView style={styles.items}>
                    {submittedTasks.map((submittedTask, index) => (
                        <View key={index} style={styles.submittedTask}>
                            <Text style={{ color: 'black' }}>{submittedTask.task}</Text>
                            <Text style={{ color: 'gray', fontSize: 12 }}>{submittedTask.created_at}</Text>
                            <TouchableOpacity onPress={() => handleDeleteTask(index)}>
                                <Image source={require('../assets/delete.png')} style={styles.deleteIcon} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
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
        maxHeight: 640,
    },
    submittedTask: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    writeTaskWrapper: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 60,
        borderColor: '#C0C0C0',
        width: '80%',
        borderWidth: 1,
        color: 'black',
    },
    addWrapper: {
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#C0C0C0',
        borderWidth: 1,
    },
    addImage: {
        width: 25,
        height: 25,
    },
    deleteIcon: {
        width: 25,
        height: 25,
    },
});