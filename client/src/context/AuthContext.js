import {AsyncStorage} from 'react-native';
import createDataContext from './createDataContext';
import cyoloApi from '../api/cyolo';
import {navigate} from '../navigationRef';
import base64 from 'react-native-base64';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'add_error':
            return {...state, errorMessage: action.payload};
        case 'signin':
            return {errorMessage: '', token: action.payload};
        case 'clear_error_message':
                return {...state, errorMessage: ''};
        case 'signout':
            return {token: null, errorMessage: ''};
        case 'create_user':
                return {...state, token: action.payload};
        default:
            return state;
    }
}

const clearErrorMessage = dispatch => () => {
    dispatch({type: 'clear_error_message'});
}

const signup = (dispatch) => async ({email, password}) => {
        try {
            const response = await cyoloApi.post('/v1/register', {email, password});
            const token = response.data.token;
            await AsyncStorage.setItem('token', token);
            dispatch({type: 'signin', payload: token});
            navigate('UserList');
        }
        catch (err){
            dispatch({type: 'add_error', payload: err})
        }
    }


const signin = (dispatch) => async ({email, password}) => {
    try {
        const tenantid = '!';
        var text = `${email}:${password}:${tenantid}`;
        var token = base64.encode(text);
        await AsyncStorage.setItem('token', token);
        const response = await cyoloApi.get(`/v1/!/users`);
        text = `${email}:${password}:${response.data[0].tenantid}`;
        token = base64.encode(text);
        await AsyncStorage.setItem('token', token);
        dispatch({type: 'signin', payload: response.data.token});
        navigate('UserList'); 
    } catch(err) {
        console.log(err);
        dispatch({
            type: 'add_error',
            payload: 'Something went wrong with sign in'
        })

    }
}

const signout = (dispatch) => async() => {
        await AsyncStorage.removeItem('token');
        dispatch({type: 'signout'})
        navigate('loginFlow');
    }

const createUser = (dispatch) => async ({email, password}) => {
        try {
            token = await AsyncStorage.getItem('token');
            text = base64.decode(token);
            [loggedemail, loggedpassword, tenantid] = text.split(':');

            const response = await cyoloApi.post(`/v1/${tenantid}/users`, {email, password});
            const userid = response.data.id;
            const certificate = response.data.UserPem;

            dispatch({type: 'create_user', payload: {userid, certificate}});
            navigate('UserList');
        }
        catch (err){
            dispatch({type: 'add_error', payload: err})
        }

    }

export const {Provider, Context} = createDataContext(
    authReducer,
    {signin, signout, signup, clearErrorMessage, createUser},
    {token: null, errorMessage: ''}
)