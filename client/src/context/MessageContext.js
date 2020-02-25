import createDataContext from './createDataContext';
import usersApi from '../api/cyolo';
import {AsyncStorage} from 'react-native';
import base64 from 'react-native-base64';

const messageReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_me':
            return [action.payload];
        case 'fetch_messages':
            return action.payload;
        default:
            return state;
        }
}
const fetchMe = dispatch => async(req, res) => {
    token = await AsyncStorage.getItem('token');
    text = base64.decode(token);
    [email, password, tenantid] = text.split(':');
    const response = await usersApi.get(`/v1/${tenantid}/users/me`);
    dispatch({type: 'fetch_me', payload: response.data.User});

}

const messageUser = dispatch => async (userid, message) => {
    token = await AsyncStorage.getItem('token');
    text = base64.decode(token);
    [email, password, tenantid] = text.split(':');
    const encMsg = await usersApi.post(`/v1/${tenantid}/users/${userid}/encrypt`, {message});
    dispatch({type: 'message_user', payload: userid});
};

const fetchMessages = dispatch => async(req, res) => {
    token = await AsyncStorage.getItem('token');
    text = base64.decode(token);
    [email, password, tenantid] = text.split(':');
    const response = await usersApi.get(`/v1/${tenantid}/users/me/messages`);
    response.data.forEach(async msgObj => {
        const msg = msgObj.encMsg;
        const response = await usersApi.post(`/v1/${tenantid}/users/me/decrypt`, {msg});
        msgObj.decMsg = response.data;
        });

    dispatch({type: 'fetch_messages', payload: response.data});
};

export const {Provider, Context} = createDataContext(
    messageReducer,
    {messageUser, fetchMe, fetchMessages},
    {decryptedMsg: ''}//initial state
)