import React, { useState, useLayoutEffect, useCallback, useEffect, } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { auth } from '../firebase';
import { GiftedChat } from 'react-native-gifted-chat'


const RegisterScreen = ({navigation}) => {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                user.updateProfile({
                    displayName: name, photoURL: imageUrl ? imageUrl : "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png"
                }).then(() => {
                    // Profile updated!
                    // ...
                }).catch((error) => {
                    // An error occurred
                    // ...
                });

                navigation.popToTop();


                // ...
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);

            });

    }

    return (
        <View style={styles.container}>
            <Input
                placeholder="Enter your name"
                label="Name"
                leftIcon={{ type: 'material', name: 'badge' }}
                value={name}
                onChangeText={text => setName(text)}
            />
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
            <Input
                placeholder="Enter your image url"
                label="Profile Picture"
                leftIcon={{ type: 'material', name: 'face' }}
                value={imageUrl}
                onChangeText={text => setImageUrl(text)}
            />
            <Button title="Register" style={styles.button} onPress={register} />
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 150,
        height: 400,
        marginTop: 10,
    },
    container: {
        flex: 1,
        alignContent: 'center',
        padding: 10,
    },
})

export default RegisterScreen
