import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import {SafeAreaView, withNavigationFocus} from 'react-navigation';

import UserForm from '../components/UserForm';
import {FontAwesome} from '@expo/vector-icons';

const UserCreateScreen = () => {

    return (
        <SafeAreaView forceInset={{top: 'always'}}>
            <Text h2>Create a User</Text>
            <UserForm/>
        </SafeAreaView>
    )
}

UserCreateScreen.navigationOptions = {
    title: 'Add User',
    tabBarIcon: <FontAwesome name="plus" size={20}/>
}

const styles = StyleSheet.create({});

export default withNavigationFocus(UserCreateScreen);