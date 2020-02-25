import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import AccountScreen from './src/screens/AccountScreen';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import UserListScreen from './src/screens/UserListScreen';
import UserCreateScreen from './src/screens/UserCreateScreen';
import UserDetailScreen from './src/screens/UserDetailScreen';
import UserMessagesScreen from './src/screens/UserMessagesScreen';


import { setNavigator } from './src/navigationRef';
import { FontAwesome } from '@expo/vector-icons';

import { Provider as UserProvider } from './src/context/UserContext';
import { Provider as MessageProvider } from './src/context/MessageContext';
import { Provider as AuthProvider } from './src/context/AuthContext';

const UserListFlow = createStackNavigator({
  UserList: UserListScreen,
  UserDetail: UserDetailScreen,
  UserCreate: UserCreateScreen
})

UserListFlow.navigationOptions = {
  title: 'Users',
  tabBarIcon: <FontAwesome name="th-list" size={20} />
}

const switchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    Signup: SignupScreen,
    Signin: SigninScreen
  }),
  mainFlow: createBottomTabNavigator({
    UserListFlow,
    UserMessages: UserMessagesScreen,
    Account: AccountScreen
  })
})

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <UserProvider>
        <AuthProvider>
        <MessageProvider>
          <App ref={(navigator) => { setNavigator(navigator) }} />
        </MessageProvider>
      </AuthProvider>
    </UserProvider>
  )
};