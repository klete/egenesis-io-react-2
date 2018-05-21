import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { clearAuthData } from '../../localStorage';

class Logout extends Component {

    componentDidMount() {
        clearAuthData();
    }

    render() {
        return <Redirect to="/" />;
    }
}

export default Logout;