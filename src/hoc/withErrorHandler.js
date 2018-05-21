import React, { Component } from 'react';

import * as Raven from 'raven-js';

import Modal from '../components/UI/Modal/Modal';
import Aux from './Aux/Aux';


const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {

        state = {
            error: null
        }
        componentDidUpdate() {
            console.log('[ErrorHandler] componentDidUpdate');
        }

        componentWillMount() {
            console.log('[ErrorHandler] componentWillMount');

            this.reqInterceptor = axios.interceptors.request.use(req => {
                    this.setState({error: null});
                    return req;
                }, error => {
                    this.setState({error: error});
                    if (process.env.NODE_ENV === 'production') {
                        Raven.captureMessage(error);
                    }
                });

            this.resInterceptor = axios.interceptors.response.use(
                res => res, 
                error => {
                    this.setState({error: error});
                    if (process.env.NODE_ENV === 'production') {
                        Raven.captureMessage(error);
                    }
                });
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.request.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render() {
            
            let output = null;

            console.log(this.state);

            output = (
                <Aux>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
                

            return output;
        };
    };
}

export default withErrorHandler;