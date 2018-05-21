import React from 'react';
import { Link } from 'react-router-dom';

import SignInForm from '../SignInForm/SignInForm';

import './SignInBar.css';

const SignInBar = (props) => (
    <div className="sign-in-bar">
        <div className="sign-in-bar__inner-container">

            <div className="sign-in-bar__link">
                <Link to="/visitor">Enroll Now</Link>
            </div>
            <div className="sign-in-bar__link">
                <Link to="/visitor">Visitors</Link>
            </div>

            <SignInForm loginHandler={props.loginHandler}/>

        </div>
    </div>
);

export default SignInBar;
