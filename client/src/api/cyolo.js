import axios from 'axios';
import {AsyncStorage} from 'react-native';

const instance = axios.create({
    baseURL:'http://192.168.1.112:3000'
    
})

instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (err) => {
        console.log(`ERROR ON PROMISE: ${err}`);
        return Promise.reject(err);
    }
);

export default instance;