import React, { Component } from 'react';

import { loadAuthData } from '../localStorage';


const withAuthData = (WrappedComponent, axios) => {
    class WithAuthData extends Component {
 
        render() {            

            const authState = loadAuthData();

            const authData = {
                user: null,
                isAdministrator: false,
                isStudent: false,
                isAuthenticated: false
            };
        
            if (authState) {
                authData.user = authState.user;
                authData.isAdministrator = authState.user ? authState.user.roles.indexOf('ADMIN') >= 0 : false;
                authData.isStudent = authState.user ? authState.user.roles.indexOf('STUDENT') >= 0 : false;
                authData.isAuthenticated = !!authState.token;
            }
        
            return (
                <WrappedComponent authData={authData} {...this.props} />
            );
        };
    }
    WithAuthData.displayName = `WithAuthData(${getDisplayName(WrappedComponent)})`;
    return WithAuthData;
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuthData;