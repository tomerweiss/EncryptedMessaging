import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {Context} from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';

const SigninScreen = ({navigation}) => {
    const {state, signin, clearErrorMessage} = useContext(Context);

    return (
        <View style={styles.container}>
            <NavigationEvents
                onWillBlur={clearErrorMessage}
            />
            <AuthForm
                headerText="Sign In for Cyolo"
                errorMessage={state.errorMessage}
                submitButtonText="Sign in"
                onSubmit={signin}
            />
            <NavLink
                routeName="Signup"
                text="Don't have an account? Sign up instead!"
            />
            
        </View>
    )
}

SigninScreen.navigationOptions = {
    header:null
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 250
    }
});

export default SigninScreen;