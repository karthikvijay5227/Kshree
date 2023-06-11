import * as React from 'react';
import { View, Text, Alert, Platform, KeyboardAvoidingView, Dimensions, BackHandler } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { createClient } from '@supabase/supabase-js'
import RNDateTimePicker from '@react-native-community/datetimepicker';


const height = Dimensions.get('window').height
const width = Dimensions.get('window').width


export default class CreateEvent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            deterror: false,
            description: '',
            location: '',
            profit: '',
            contact: '',
            date: new Date(),
            time: new Date().getHours() + ':' + new Date().getMinutes(),
            showDate: false,
            showTime: false,
            avoidKey: false,

        }
    }

    componentDidMount() {
        // Add a back button event listener
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        // Remove the back button event listener
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        // Handle the back button press
        this.props.navigation.goBack();
        return true; // Prevent the default back button action
    }
    render() {
        const createEvent = async () => {
            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey)

            if (this.state.name == '' || this.state.description == '' || this.state.location == '' || this.state.profit == '' || this.state.contact == '') {
                this.setState({ deterror: true });
                Alert.alert("No Data Entered In the Feilds", "Please fill all the details", [
                    {
                        text: 'OK',
                        onPress: () => { this.setState({ deterror: false }) }
                    }
                ])
            }
            else {
                try {
                    await supabase.from('events').insert([
                        {
                            event_name: this.state.name,
                            event_description: this.state.description,
                            location: this.state.location,
                            profit: this.state.profit,
                            contact: this.state.contact,
                            date: this.state.date.toDateString(),
                            time: this.state.time
                        }])

                    await supabase.from('EventAttendies').insert([{
                        eventname: this.state.name
                    }]);

                }
                catch (e) {
                    Alert.alert("Failed to Create Event")
                }

                Alert.alert("Event Created Successfully")
                this.props.navigation.goBack()
            }
        }

        return (
            <View style={{ flex: 1, alignContent: 'center', backgroundColor: 'white' }}>
                <KeyboardAvoidingView enabled={this.state.avoidKey} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', marginBottom: height - 600, position: 'absolute' }} behavior={Platform.OS == 'android' ? "position" : "padding"} keyboardVerticalOffset={height - 650} >
                    <TextInput
                        label={'Event Name'}
                        mode='outlined'
                        error={this.state.deterror}
                        value={this.state.name}
                        onChangeText={text => this.setState({ name: text })}
                        style={{ alignSelf: 'center', width: width - 50, marginTop: height - 700 }}
                    />

                    <TextInput
                        label={'Event Description'}
                        mode='outlined'
                        error={this.state.deterror}
                        value={this.state.description}
                        onChangeText={text => this.setState({ description: text })}
                        style={{ width: width - 50, alignSelf: 'center', marginTop: 20, height: 80 }}
                        numberOfLines={10}
                        multiline={true}
                        editable={true}
                    />

                    <View style={{ flexDirection: 'row', alignSelf: 'center', width: width - 50 }}>
                        <TextInput
                            label={'Event Date'}
                            mode='outlined'
                            error={this.state.deterror}
                            value={this.state.date.toDateString()}
                            style={{ width: width - 230, marginTop: 20 }}
                            onPressIn={() => { this.setState({ showDate: true }) }}
                        />

                        <TextInput
                            label={'Event Time'}
                            mode='outlined'
                            error={this.state.deterror}
                            value={this.state.time}
                            style={{ width: width - 230, marginLeft: 20, marginTop: 20 }}
                            onPressIn={() => { this.setState({ showTime: true }) }}
                        />
                    </View>

                    {
                        this.state.showDate && (
                            <RNDateTimePicker mode='date' value={this.state.date} onChange={(event, date) => {
                                if (event.type == 'dismissed')
                                    this.setState({ showDate: false })
                                else if (event.type == 'set')
                                    this.setState({ date: date, showDate: false })
                            }}
                            />
                        )
                    }

                    {
                        this.state.showTime && (
                            <RNDateTimePicker mode='time' value={this.state.date} onChange={(event, date) => {
                                if (event.type == 'dismissed')
                                    this.setState({ showDate: false })
                                else if (event.type == 'set')
                                    this.setState({ time: date.getHours() + ':' + date.getMinutes(), showTime: false })
                            }} />
                        )
                    }

                    <TextInput
                        label={'Event Location'}
                        mode='outlined'
                        error={this.state.deterror}
                        value={this.state.location}
                        onChangeText={text => this.setState({ location: text })}
                        style={{ width: width - 50, marginTop: 20, alignSelf: 'center' }}
                    />

                    <TextInput
                        label={'Profit Distribution'}
                        mode='outlined'
                        error={this.state.deterror}
                        value={this.state.profit}
                        onChangeText={text => this.setState({ profit: text })}
                        style={{ width: width - 50, marginTop: 20, alignSelf: 'center' }}
                        onPressIn={() => { this.setState({ avoidKey: true }) }}
                    />

                    <TextInput
                        label={'Contact Details'}
                        mode='outlined'
                        error={this.state.deterror}
                        value={this.state.contact}
                        onChangeText={text => this.setState({ contact: text })}
                        style={{ width: width - 50, marginTop: 20, alignSelf: 'center' }}
                        numberOfLines={3}
                        multiline={true}
                        editable={true}
                        onPressIn={() => { this.setState({ avoidKey: true }) }}
                    />

                    <View style={{ flex: 1, marginTop: height - 730 }}>
                        <Button mode='contained' style={{ justifyContent: 'center', fontSize: 20, width: width - 50, height: 50, fontWeight: 'bold', marginTop: 30, }}
                            onPress={() => { createEvent() }}>
                            <Text style={{ fontSize: 18, justifyContent: 'center' }}>Create Event</Text>
                        </Button>
                    </View>
                </KeyboardAvoidingView>
            </View>
        )
    }
}