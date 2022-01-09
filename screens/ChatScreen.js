import React, { useLayoutEffect } from 'react'
import { View, Text ,Button} from 'react-native'
import { auth } from '../firebase'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';

const ChatScreen = ({ navigation }) => {


    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft:()=>(
                <View style={{marginLeft:20}}>
                    <Avatar
                        rounded
                        source={{
                            uri:auth?.currentUser?.photoURL,
                        }}
                    />
                </View>
            ),
            headerRight:()=>(
                <View  style ={{marginRight:20}}>
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
        <View>
            <Text>
                hello chat screens
               

            </Text>
        </View>
    )
}

export default ChatScreen
