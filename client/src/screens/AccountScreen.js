import React, { useContext, useEffect } from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import {Button} from 'react-native-elements';
import {SafeAreaView} from 'react-navigation';
import Spacer from '../components/Spacer';
import {Context as AuthContext} from '../context/AuthContext';
import {Context as UserContext} from '../context/UserContext';
import { NavigationEvents } from 'react-navigation';

import {FontAwesome} from '@expo/vector-icons';

const AccountScreen = ({navigation}) => {
    const {signout} = useContext(AuthContext);
    const {state, fetchMe} = useContext(UserContext);

    return (
        <>
        <NavigationEvents onWillFocus={fetchMe} />
    <SafeAreaView forceInset={{top: 'always'}}>
        <FlatList
         data={state}
         keyExtractor={item => item.id}
         renderItem={({ item }) => {
            return (
                  <>
                     <Text>Your ID:</Text>
                     <Text>{item.id}</Text>
                     <Spacer/>
                     <Text>Your Email:</Text>
                     <Text>{item.email}</Text>
                     <Spacer/>
                     <Text>Your Certificate:</Text>
                     <Text>{item.certificate}</Text>
                     <Spacer/>
                     <Text>Your Private Key:</Text>
                     <Text>{JSON.stringify(item.privatekey)}</Text>
                     <Spacer/>
                     <Button title="Sign Out" onPress={signout}/>
                  </>
            )
         }}
      />
    </SafeAreaView>
    </>
    )
}

AccountScreen.navigationOptions = {
 title: 'Account',
 tabBarIcon: <FontAwesome name="gear" size={20} />
}

const styles = StyleSheet.create({});

export default AccountScreen;