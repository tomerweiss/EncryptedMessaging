import createDataContext from './createDataContext';
import usersApi from '../api/cyolo';
import { AsyncStorage } from 'react-native';
import base64 from 'react-native-base64';
import { navigate } from '../navigationRef';

const userReducer = (state, action) => {
    var [token, text, email, password, tenantid] = '';
    switch (action.type) {
        case 'fetch_users':
            return action.payload;
        case 'create_user':
            return state;
        case 'delete_user':
            return state.filter((user) => user.id !== action.payload);
        case 'fetch_me':
            return [action.payload];
        case 'fetch_messages':
            return action.payload;
        case 'decrypt_message':
            return action.payload;
        default:
            return state;
    }
}
const fetchMe = dispatch => async (req, res) => {
    token = await AsyncStorage.getItem('token');
    text = base64.decode(token);
    [email, password, tenantid] = text.split(':');
    const response = await usersApi.get(`/v1/${tenantid}/users/me`);
    dispatch({ type: 'fetch_me', payload: response.data.User });

}
const fetchUsers = dispatch => async (req, res) => {
    token = await AsyncStorage.getItem('token');
    text = base64.decode(token);
    [email, password, tenantid] = text.split(':');
    const response = await usersApi.get(`/v1/${tenantid}/users`);
    dispatch({ type: 'fetch_users', payload: response.data });
};

const createUser = (dispatch) => async ({ email, password }) => {
    try {
        token = await AsyncStorage.getItem('token');
        text = base64.decode(token);
        [loggedemail, loggedpassword, tenantid] = text.split(':');
        const response = await usersApi.post(`/v1/${tenantid}/users`, { email, password });
        const userid = response.data.id;
        const certificate = response.data.UserPem;

        dispatch({ type: 'create_user', payload: { userid, certificate } });
        navigate('UserList');
    }
    catch (err) {
        dispatch({ type: 'add_error', payload: 'Something went wrong with sign up' })
    }

}

const deleteUser = dispatch => async (userid) => {
    try {
        token = await AsyncStorage.getItem('token');
        text = base64.decode(token);
        [email, password, tenantid] = text.split(':');
        const response = await usersApi.delete(`/v1/${tenantid}/users/${userid}`);
        fetchUsers();
    }
    catch (err) {
        alert('Not Authorized');
    }
};

const messageUser = dispatch => async (userid, message) => {
    token = await AsyncStorage.getItem('token');
    text = base64.decode(token);
    [email, password, tenantid] = text.split(':');
    const encMsg = await usersApi.post(`/v1/${tenantid}/users/${userid}/encrypt`, { message });
    dispatch({ type: 'message_user', payload: userid });
};

export const { Provider, Context } = createDataContext(
    userReducer,
    { fetchUsers, createUser, deleteUser, messageUser, fetchMe},
    []//initial state
)