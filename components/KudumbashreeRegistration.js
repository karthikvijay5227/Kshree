/* The KudumbashreeRegistartion class is a React component that allows users to register as either an
admin or member, with their name, username, password, address, and phone number. */

import * as React from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, BackHandler } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createClient } from '@supabase/supabase-js'
import { Alert } from 'react-native';

export default class KudumbashreeRegistartion extends React.Component {

    /**
     * This is a constructor function that initializes the state of a component in a React application.
     * @param props - props is an object that contains properties passed down from a parent component to
     * this component. It can include any data or functions that the parent component wants to share with
     * this component. In this case, the constructor is using props to initialize the state of the
     * component.
     */
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            username: '',
            password: '',
            address: '',
            admin: '',
            phone: '',
            pherror: false,
            deterror: false,
            isPasswordFocused: false,
            passwordError: false
        }
    }

    componentDidMount() {
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
        const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(this.state.password);

        const list = [{ label: "Admin", value: true }, { label: "Member", value: false }]
        const height = Dimensions.get('window').height;
        const width = Dimensions.get('window').width;
        const addUser = async () => {

            /* This code is creating a Supabase client object using the Supabase URL and API key.
            Supabase is a cloud-based service that provides a backend for web and mobile
            applications. The client object is used to interact with the Supabase database and
            perform operations such as inserting data into the database. */

            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWJ4cXhmb3B0cGpyc2Z1enh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTc1NTM4NSwiZXhwIjoxOTk3MzMxMzg1fQ.SWDMCer4tBPEVNfrHl1H0iJ2YiWJmitGtJTT3B6eTuA'
            const supabase = createClient(supabaseUrl, supabaseKey)


            /* This code is checking if any of the required fields (name, username, password, address,
            admin, and phone) are empty. If any of these fields are empty, it sets the `deterror`
            and `pherror` state variables to `true`, which will display an error message to the
            user. If the phone number is not 10 digits long, it sets the `error` state variable to
            `true`, which will also display an error message to the user. If all the required fields
            are filled out and the phone number is valid, it inserts the user's information into a
            Supabase database using the `supabase.from('users').insert()` method. If there is an
            error during the insertion process its displays an Alert */

            if (this.state.name == '' || this.state.username == '' || this.state.password == '' || this.state.address == '' || this.state.phone == '') {
                this.setState({ deterror: true });
                this.setState({ pherror: true });
                Alert.alert("Please fill all the details")
            }
            else if (this.state.phone.length != 10) {
                this.setState({ pherror: true });
                Alert.alert("Please enter a valid phone number");
            } else if (!isPasswordValid) {
                this.setState({ passwordError: true }); // Set passwordError state to true
                Alert.alert("Please enter a password that meets the requirements.");
                return;
            }
            else {
                try {
                    await supabase.from('users').insert([
                        {
                            username: this.state.username,
                            password: this.state.password,
                            admin: this.state.admin,
                            address: this.state.address,
                            name: this.state.name,
                            phone_number: this.state.phone
                        }])

                } catch (e) {
                    Alert.alert("Failed to add user");
                }
                Alert.alert("User added successfully");
                this.props.navigation.goBack()
            }
            if (!isPasswordValid) {
                Alert.alert("Please enter a password that meets the requirements.");
                return;
            }
        }

        return (
            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={styles.textHeaderContainer}>
                            <Text style={styles.textHeader}>Member Registration</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                label={'Name'}
                                mode='outlined'
                                error={this.state.deterror}
                                value={this.state.name}
                                onChangeText={text => this.setState({ name: text })}
                                style={{ width: width - 50, marginTop: 20 }}
                            />

                            <TextInput
                                label={'UserName'}
                                mode='outlined'
                                error={this.state.deterror}
                                value={this.state.username}
                                onChangeText={text => this.setState({ username: text })}
                                style={{ width: width - 50, marginTop: 20 }}
                            />

                            <TextInput
                                label={'Password'}
                                mode='outlined'
                                error={this.state.deterror || (!isPasswordValid && this.state.isPasswordFocused)}
                                secureTextEntry={true}
                                value={this.state.password}
                                onChangeText={text => this.setState({ password: text })}
                                style={[
                                    {
                                        width: width - 50, marginTop: 20
                                    },
                                    (!isPasswordValid && this.state.isPasswordFocused) && styles.errorTextInput
                                ]}
                                onFocus={() => this.setState({ isPasswordFocused: true })}
                                onBlur={() => this.setState({ isPasswordFocused: false })}
                            />
                            {this.state.isPasswordFocused && (
                                <View style={styles.passwordRequirementsContainer}>
                                    <HelperText type="info" visible={true}>
                                        Password requirements:
                                    </HelperText>
                                    <HelperText type="info" visible={true}>
                                        - At least 8 characters
                                    </HelperText>
                                    <HelperText type="info" visible={true}>
                                        - Must contain at least one uppercase letter, one lowercase letter, and one number
                                    </HelperText>
                                </View>
                            )}
                            {!isPasswordValid  && (
                                <HelperText type="error" visible={true} style={styles.passwordErrorText}>
                                    Password does not meet the requirements.
                                </HelperText>
                            )}

                            <TextInput
                                label={'Address'}
                                mode='outlined'
                                error={this.state.deterror}
                                value={this.state.address}
                                onChangeText={text => this.setState({ address: text })}
                                style={{ width: width - 50, marginTop: 20 }}
                                numberOfLines={10}
                                multiline={true}
                                editable={true}
                            />

                            <TextInput
                                label={'Phone Number'}
                                mode='outlined'
                                value={this.state.phone}
                                error={this.state.pherror}
                                onChangeText={text => this.setState({ phone: text })}
                                keyboardType={'number-pad'}
                                style={{ width: width - 50, marginTop: 20 }}
                            />

                            <View style={{ width: width - 50, marginTop: 20 }}>
                                <SelectList
                                    placeholder='Role'
                                    search={false}
                                    setSelected={(value) => this.setState({ admin: value })}
                                    data={[{ key: 1, value: 'Admin', }, { key: 2, value: 'Member' }]}
                                    save='value'
                                    onSelect={() => {
                                        if (this.state.admin == 'Admin') {
                                            this.setState({ admin: true })
                                        }
                                        else {
                                            this.setState({ admin: false })
                                        }
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 40, width: '30%' }}>
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ADD8E6', width: '100%', height: 50, borderRadius: 10, marginBottom: 30 }} onPress={() => { addUser() }}>
                                <Text>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textHeaderContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginRight:"49.4%"
    },
    textHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    passwordRequirementsContainer: {
        marginHorizontal: 20,
        marginTop: 10
    },
    passwordErrorText: {
        marginTop: 5
    },
    textInputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    errorTextInput: {
        borderColor: 'red', // Add any desired styles for error state
    }
})