import React, { Component } from 'react';

import SignInBar from './components/SignInBar/SignInBar';

import axios from 'axios';

import { saveAuthData, saveCredentials } from '../../localStorage';

import logo from './assets/logo.png';
import './Home.css';


class HomeContainer extends Component {

    state = {
        loading: false,
        error: null
    };

    componentDidMount() {
        // console.log('[Home.js] componentDidMount ');
        document.body.style.backgroundColor = '#fff';
    }
    
    componentWillUnmount() {
        // console.log('[Home.js] componentWillUnmount');
        document.body.style.backgroundColor = null;
    }

    loginHandler = async (authData) => {

        const {username, rememberCredentials} = authData;

        this.setState({
            loading: true, 
            error: null
        });

        try {
            const response = await axios.post('/login', authData);
            const { token, user } = response.data;
            
            this.setState({loading: false});
    
            saveAuthData({
                token: token,
                user: user
            })
            saveCredentials({
                savedUsername: username,
                rememberCredentials: rememberCredentials
            })
    
            if (user.is_student) {
                this.props.history.push('/student');
            } else {
                this.props.history.push('/administrator');                    
            }     
        } catch(error) {
            console.log(error);
            this.setState({
                loading: false,
                error: error
            });
        }       
    };

    render() {
        return (
            <div className="home">
               <SignInBar loginHandler={this.loginHandler}/>
        
               {this.state.loading &&
                    <div className="alert">
                        &bull; Sending request...
                    </div>
                }
                {this.state.error &&
                    <div className="alert alert--status-error">
                        &bull; Authentication failed. Please check your username and password and try again.
                    </div>
                }
                <img alt="eGenesis: The Next eGeneration in Education" className="logo" src={logo} />
            </div>
        );
    }
} 

export default HomeContainer;