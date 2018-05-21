import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { loadSavedCredentials } from '../../../../localStorage';


import './SignInForm.css';

class SignInForm extends Component {

    constructor(props) {
        super(props);

        const savedCredentials = loadSavedCredentials();
        let savedUsername = '';

        if (savedCredentials && savedCredentials.savedUsername) {
            savedUsername = savedCredentials.savedUsername;
        }

        this.state = {
            username: savedUsername,
            password: '',
            rememberCredentials: savedUsername !== '',
        };
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };

    onSubmit = (event) => {
        event.preventDefault();

        this.props.loginHandler({
            username: this.state.username,
            password: this.state.password,
            rememberCredentials: this.state.rememberCredentials,
        });
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>

                <div className="sign-in-form">

                    <div className="sign-in-form__top-row">

                        <label className="sign-in-form__label">User Name:</label>

                        <input
                            autoComplete="off"
                            className="sign-in-form__text-box"
                            name="username"
                            onChange={this.handleInputChange}
                            type="text"
                            value={this.state.username}
                        />

                        <label className="sign-in-form__label">Password:</label>

                        <input
                            autoComplete="off"
                            className="sign-in-form__text-box"
                            name="password"
                            onChange={this.handleInputChange}
                            type="password"
                            value={this.state.password}
                        />

                        <button type="submit">Sign In</button>

                    </div>
                    <div className="sign-in-form__bottom-row">

                        <div className="sign-in-form__bottom-row-item">
                            <Link to="/credentials">Forgot your password?</Link>
                        </div>

                        <div className="sign-in-form__bottom-row-item">
                            <label>
                                <input
                                    checked={this.state.rememberCredentials}
                                    name="rememberCredentials"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                />
                                Remember my information
                            </label>
                        </div>

                    </div>

                </div>

            </form>
        );
    }
}

export default SignInForm;
