import React, { useLayoutEffect, useCallback, useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { auth, db } from '../firebase'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { GiftedChat } from 'react-native-gifted-chat';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import _ from 'lodash';
import { Audio } from 'expo-av';


const ChatScreen = ({ navigation }) => {

    const [recording, setRecording] = React.useState();

    const [messages, setMessages] = useState([]);
    /*
    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: '',
                audio: "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])
    }, [])
    */

    useLayoutEffect(() => {

        LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
        LogBox.ignoreAllLogs(); // ignore all logs
        const _console = _.clone(console);
        console.warn = message => {
            if (message.indexOf('Setting a timer') <= -1) {
                _console.warn(message);
            }
        };

        const unsubscribe = db.collection('chats').orderBy('createdAt', 'desc').onSnapshot(snapshot => setMessages(
            snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
            }))
        ))
        return unsubscribe;
    })

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {
            _id,
            createdAt,
            text,
            user,
        } = messages[0]
        db.collection('chats').add({
            _id,
            createdAt,
            text,
            user,
        })
    }, [])


    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <Avatar
                        rounded
                        source={{
                            uri: auth?.currentUser?.photoURL,
                        }}
                    />
                </View>
            ),
            headerRight: () => (
                <View style={{ marginRight: 20 }}>
                    <Button
                        onPress={signOut}
                        title='logout'
                    />
                </View>
            )
        })

    }, [navigation])

    const signOut = () => {
        auth.signOut().then(() => {
            // Sign-out successful.
            navigation.replace('Login');
        }).catch((error) => {
            // An error happened.

        });
    }

    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }


    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        }
        

        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {
            _id,
            createdAt,
            text,
            user,
        } = messages[0]
        db.collection('chats').add({
            _id,
            createdAt,
            text,
            user,
        })
    }

    const playAudio = () => {

    }


    const renderAudio = () => {
        return (
            <View>
                <Button title="Audio" onPress={playAudio} />
            </View>
        );
    }

    return (

        <View style={styles.container}>


            <GiftedChat
                renderMessageAudio={renderAudio}
                messages={messages}
                showAvatarForEveryMessage={true}
                onSend={messages => onSend(messages)}
                user={{
                    _id: auth?.currentUser?.email,
                    name: auth?.currentUser?.displayName,
                    avatar: auth?.currentUser?.photoURL
                }}
            />

            <TouchableOpacity
                onLongPress={startRecording}
                onPressOut={stopRecording}
                style={styles.buttonVocal}
            >
                <Text>Record</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonVocal: {
        alignItems: 'center',
        padding: 10

    }
})

export default ChatScreen
