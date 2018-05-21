import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './assets/css/sb-admin-2.css';
import './index.css';

import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

import './axios-setup';

import * as Raven from 'raven-js';

Raven
    .config('https://e76b326c2ae945a0a3f1dd576f122246@sentry.io/290545')
    .install();

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>, 
    document.getElementById('root')
);

registerServiceWorker();
