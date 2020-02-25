import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Context as UserContext } from '../context/UserContext';
import Spacer from '../components/Spacer';
import { ScrollView } from 'react-native-gesture-handler';


const UserDetailScreen = ({ navigation }) => {
    const { state, fetchUsers } = useContext(UserContext);
    const _id = navigation.getParam('_id');
    console.log({ _id });
    var user = [];
    user = state.find(u => u.id === _id) || [];

    useEffect(() => {
        fetchUsers();
        const listener = navigation.addListener('didFocus', () => {
           fetchUsers();
        })
        return () => {
           listener.remove();
        }
     }, [])

    return (
        <>
            <ScrollView>
                <Text>{user.id}</Text>
                <Spacer />
                <Text>{user.certificate}</Text>
                <Spacer />
                <Text>{JSON.stringify(user.privateKey)}</Text>

                <Spacer />
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({});

export default UserDetailScreen;