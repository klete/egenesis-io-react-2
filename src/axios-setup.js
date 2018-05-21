import axios from 'axios';
import * as Raven from 'raven-js';

import { loadAuthData } from './localStorage';


const apiUrl = 'https://api.egenesis.io/dev';
// const apiUrl = 'https://api.egenesis.io/prod';

// Global axios defaults
axios.defaults.baseURL = apiUrl;

axios.interceptors.request.use(request => {
    // console.log('[Axios] interceptor');

    const authState = loadAuthData();

    const token = authState ? authState.token : null;

    if (token) {
        request.headers['Authorization'] = token;
    }

    return request;
}, error => {
    if (process.env.NODE_ENV === 'production') {
        console.log('[axios-setup.js] sent Raven message (1)');
        Raven.captureException(error);
    }
    return Promise.reject(error);    
});
