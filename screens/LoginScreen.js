import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });

    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                navigation.replace('Chat');
                // ...
            } else {
                // User is signed out
                navigation.canGoBack() && navigation.popToTop();
                // ...
            }
        });

        return unsubscribe
    }, [])
    return (
        <View style={styles.container}>
            <Input
                placeholder="Enter your email"
                label="Email"
                leftIcon={{ type: 'material', name: 'email' }}
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input
                placeholder="Enter your password"
                label="Password"
                leftIcon={{ type: 'material', name: 'lock' }}
                value={password}
                onChangeText={password => setPassword(password)}
                secureTextEntry
            />

            <View style={styles.buttonsContainer}>
                <View style={styles.buttonContainer}>
                    <Button title="Sign in" style={styles.buttonI} onPress={signIn} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Register" style={styles.button} onPress={() => navigation.navigate('Register')} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonContainer: {
        width: 150,
        margin: 10,
    },

    container: {
        flex: 1,
        alignContent: 'center',
        padding: 10,
    },
})

export default LoginScreen
