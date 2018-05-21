import React, { Component } from 'react';

import axios from 'axios';
import * as Raven from 'raven-js';

import { transformAPICompletedCoursesIntoCompletedCourses, sortTranscriptIntoCategories } from '../../utility';

import ErrorBoundary from '../../boundaries/ErrorBoundary/ErrorBoundary';
import Layout from '../../components/Layout/Layout';
import Modal from '../../components/UI/Modal/Modal';
import Student from '../../components/Student/Student';

import withAuthData from '../../hoc/withAuthData'
import { getAccredCode } from '../../utility';

import PropTypes from 'prop-types';


import './Student.css';


class StudentContainer extends Component {

    constructor (props) {
        // console.log('[Student.js] constructor');
        super(props);

        const student = props.authData.user;        
        const certEntity =  +student.cert_entity;
        const accreditationCode = certEntity ? getAccredCode(certEntity).code : '';

        this.state = {
            student: {
                ...student,
                id: student.user_no,
                transcript: null,
                sortedTranscript: null,
                course: null,
                accreditationCode: accreditationCode,
                certEntity: certEntity
            },
            loading: false,
            error: null,
            sessionExpired: false,
            message: null,
            loadMessage: null
        };
    }

    loadTranscript = async () => {
        try {
            const response = await axios.get('/students');
            let transcript = transformAPICompletedCoursesIntoCompletedCourses(response.data);
            let sortedTranscript = sortTranscriptIntoCategories(transcript);
            
            this.setState({
                student: {
                    ...this.state.student,
                    transcript: transcript,
                    sortedTranscript: sortedTranscript,
                    course: null
                },
                loading: false,
                loadMessage: null
            });
        } catch (error) {                
            console.log(error);

            this.setState({
                loading: false,
                loadMessage: null
            }, () => this.handleError(error));
        }        
    }

    componentDidMount() {
        if (!this.state.student.transcript) {

            this.setState({
                loading: true,
                loadMessage: 'Loading transcript...'
            }, () => {    
                this.loadTranscript();
            });

        }
    }

    /*
        Errors
    */

   errorConfirmedHandler = () => {
        this.setState({error: null});

        if (this.state.sessionExpired) {
            this.props.history.push('/');
        }
    }

    handleError = (error) => {
        console.log(error.response);

        if (process.env.NODE_ENV === 'production') {
            console.log('[Student.js] sent Raven message');
            Raven.captureException(error);
        }

        let message = null;
        let sessionExpired = false;

        if (error.response && (error.response.status === 401)) {
            message = (<div>Your session has expired.<br /><br />Please click anywhere to return to the home page.</div>);
            sessionExpired = true;
        } else {
            message = (<div>An error occurred retrieving courses.<br /><br />Please try again later.</div>);
        }

        this.setState({
            error: error,
            loading: false,
            message: message,
            sessionExpired: sessionExpired
        });
    }

    /*
        Utilities
    */

   setLoadMessage = (message) => {
        // console.log('[Student.js] setLoadMessage: ' + message);

        this.setState({
            loadMessage: message,
            loading: !!message
        });
    }

    resultsSelectHandler = (scId, item) => {
        // console.log('[Student.js] resultsSelectHandler');

        let crs = null;

        if (this.state.student.transcript) {
            crs = this.state.student.transcript.find(course => {
                return course.sc_no === +scId;
            });
        }

        this.setState({
            student: {
                ...this.state.student,
                course: crs
            }            
        }, () => this.props.history.push('/student/' + scId + '/' + item));
    }

    handleAccredCodeChange = (event) => {
        event.preventDefault();

        const certEntity =  +event.target.value;
        const accreditationCode = certEntity ? getAccredCode(certEntity).code : '';

        this.setState({
            student: {
                ...this.state.student,
                accreditationCode: accreditationCode,
                certEntity: certEntity
            }
        });
    }

    render() {
        return (
            <ErrorBoundary>
                <Layout>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.message : null}
                    </Modal>

                    {this.state.loading ?
                        <div className="alert">
                            &bull; {this.state.loadMessage}...
                        </div>
                        : null
                    }  

                    <div className="container-fluid">
                        <div className="row" id="visitors-content">                            
                            <div className="col-lg-12">
                                                            
                                <Student
                                    select={this.resultsSelectHandler}
                                    certificateCodeSelect={this.handleAccredCodeChange}
                                    student={this.state.student} />

                            </div>
                        </div>
                    </div>

                </Layout>
            </ErrorBoundary>
        );    
    }
}

StudentContainer.propTypes = {
    authData: PropTypes.shape({
        user: PropTypes.shape({
            first_name: PropTypes.string,
            middle_name: PropTypes.string,
            last_name: PropTypes.string,
            user_no: PropTypes.number,
            cert_name: PropTypes.string,
            cert_entity: PropTypes.number,
            email: PropTypes.string,
            roles: PropTypes.array,
            is_admin: PropTypes.bool,
            is_student: PropTypes.bool
        }),
        isAdministrator: PropTypes.bool,
        isStudent: PropTypes.bool,
        isAuthenticated: PropTypes.bool
    })
}

export default withAuthData(StudentContainer);