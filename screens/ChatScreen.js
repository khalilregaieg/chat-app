import React, { useLayoutEffect, useCallback, useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { auth, db } from '../firebase'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { GiftedChat } from 'react-native-gifted-chat';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import _ from 'lodash';


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

    return (

        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                showAvatarForEveryMessage={true}
                onSend={messages => onSend(messages)}
                user={{
                    _id: auth?.currentUser?.email,
                    name: auth?.currentUser?.displayName,
                    avatar: auth?.currentUser?.photoURL
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})

export default ChatScreen