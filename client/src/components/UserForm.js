import React, {useContext, useState} from 'react';
import {Input, Button} from 'react-native-elements';
import Spacer from './Spacer';
import {Context as AuthContext} from '../context/AuthContext';
import {Context as UserContext} from '../context/UserContext';

const UserForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {state, createUser} = useContext(UserContext);
    return <>
    <Spacer/>
        <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <Spacer/>
            <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
            />
            <Spacer/>
            <Spacer>
                <Button title='Create User' onPress={()=> createUser({email, password})}/>
            </Spacer>
    </>
}

export default UserForm;