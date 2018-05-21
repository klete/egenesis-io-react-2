import React from 'react';

import * as Raven from 'raven-js';

class ErrorBoundary extends React.Component {

    state = {
        error: null,
        message: null
    }

    componentDidCatch = (error, info) => {
        console.log('[Errorboundary.js] componentDidCatch');
        console.log(error, info);
        this.setState({
            error: error,
            message: info
        });
        if (process.env.NODE_ENV === 'production') {
            console.log('[ErrorBoundary.js] sent Raven message');
            Raven.captureException(error, { 
                extra: info 
            });
        }
    }

    render () {
        if (this.state.error) {
            return (
                <div>
                    <div id="visitors-header">An error occurred!</div>
    
                    <div id="visitors-content">
                        <div>{this.state.error}</div>
                        <div>{this.state.message}</div>
                    </div>
                </div>
            );    
        }
        return this.props.children;
    }
}

export default ErrorBoundary;