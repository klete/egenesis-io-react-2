import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import axios from 'axios';
import * as Raven from 'raven-js';

import ErrorBoundary from '../../boundaries/ErrorBoundary/ErrorBoundary';
import Layout from '../../components/Layout/Layout';
import Modal from '../../components/UI/Modal/Modal';

// Search
import SearchForm from './components/SearchForm/SearchForm';
import SearchResults from './components/SearchResults/SearchResults';

// Reports
import Logins from './components/Reports/Logins/Logins';
import Other from './components/Reports/Other/Other';
import ReportsList from './components/Reports/ReportsList/ReportsList';

import Student from './components/Student/Student';

import { getAccredCode, transformAPICompletedCoursesIntoCompletedCourses, sortTranscriptIntoCategories } from '../../utility';


import './Administrator.css';


class AdministratorContainer extends Component {

    state = {
        reports: {
            selected: null,
            data: {
                logins: null,
                other: null
            }
        },
        search: {
            lastName: null,
            results: null,
            lastEvaluatedKey: null
        },
        student: {
            id: null,
            transcript: null,
            sortedTranscript: null,
            accreditationCode: '',
            certEntity: 0
        },
        loading: false,
        error: null,
        sessionExpired: false,
        message: null,
        loadMessage: null
    };

    /*
        Search
    */

    searchSubmitHandler = (form) => {
        // console.log('[Administrator.js] searchSubmitHandler');

        this.setState({
            loading: true,
            loadMessage: 'Searching...',
            search: {
                lastName: form.lastName.value,
                results: null,
                lastEvaluatedKey: null
            }
        }, () => {
            this.search();
        });
    }

    search = async () => {
        // console.log('[Administrator.js] search');
        
        const payload = {
            last_name: this.state.search.lastName,
            username: this.state.search.lastEvaluatedKey ? this.state.search.lastEvaluatedKey.username : '',
            password: this.state.search.lastEvaluatedKey ? this.state.search.lastEvaluatedKey.password : '',
        };
    
        try {

            const response = await axios.post('/students/search', payload);

            const newResults = this.state.search.results ? this.state.search.results.concat(response.data.Items) : response.data.Items;
            const lastEvaluatedKey = response.data['LastEvaluatedKey'];

            if (lastEvaluatedKey) {
                this.setState({
                    search: {
                        ...this.state.search,
                        results: newResults,
                        lastEvaluatedKey: {
                            username: lastEvaluatedKey.user_name,
                            password: lastEvaluatedKey.password
                        }
                    }
                }, (() => {
                    this.search();
                }));
            } else {
                this.setState({
                    loading: false,
                    loadMessage: null,                    
                    search: {
                        ...this.state.search,
                        results: newResults,                        
                        lastEvaluatedKey: null
                    }
                }, () => {
                    // console.log('Calling /administrator/search');
                    this.props.history.push('/administrator/search');
                });
            }

        } catch (error) {
            console.log(error);

            this.setState({
                loading: false,
                loadMessage: null,    
                search: {
                    lastName: null,
                    results: null,                    
                    lastEvaluatedKey: null
                }
            }, () => this.handleError(error));
        }
    }

    /*
        Student
    */

    studentSelectHandler = (studentId) => {
        // console.log('[Administrator.js] studentSelectHandler: ' + studentId);

        if (studentId === this.state.student.id) {
            // this.props.history.push('/administrator/search/' + studentId);
        } else if (this.state.search.results) {
            const student = this.state.search.results.find(student => student.user_no === +studentId);

            const certEntity =  +student.cert_entity;
            const accreditationCode = certEntity ? getAccredCode(certEntity).code : '';
    
            if (student) {
                this.setState({
                    student: {
                        ...student,
                        id: studentId,
                        transcript: null,
                        sortedTranscript: null,
                        accreditationCode: accreditationCode,
                        certEntity: certEntity
                    },
                    loading: true,
                    loadMessage: 'Loading student transcript...'
                }, () => {
                    this.loadTranscript(studentId);
                });
            }
        }        
    }

    loadTranscript = async (studentId) => {
        // console.log('[Administrator.js] loadTranscript');

        const payload = {
            studentId: studentId
        };

        try {
            const response = await axios.post('/administration/student-courses', payload)
            const transcript = transformAPICompletedCoursesIntoCompletedCourses(response.data);
            const sortedTranscript = sortTranscriptIntoCategories(transcript);

            this.setState({
                student: {
                    ...this.state.student,
                    transcript: transcript,
                    sortedTranscript: sortedTranscript
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
            console.log('[Administrator.js] sent Raven message');
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
        Reports
    */

    loadOther = (refresh = false) => {
        this.setLoadMessage('Loading Other report');
        this.props.history.push('/administrator/reports/other');
        this.setLoadMessage(null);
    }

    loadLogins = async ({refresh} = {refresh: false}) => {

        if (!this.state.reports.data.logins || refresh) {

            this.setLoadMessage('Loading Recent Logins report');

            try {
                const response = await axios.get('/administration/reports/logins');
                // const response = await axios.get('/test/session-expired'); 
                const report = response.data.Items;

                this.setState({
                    reports: {
                        selected: 'logins',
                        data: {
                            logins: report
                        }
                    }
                }, () => {
                    this.props.history.push('/administrator/reports/logins');
                });

                this.setLoadMessage(null);
                
            } catch (error) {
                console.log('ERROR');
                console.log(error);

                this.setLoadMessage(null);
                this.handleError(error);
            }
        } else {
            this.props.history.push('/administrator/reports/logins');
        }
    }           

    reportSelectHandler = (selectedReport) => {
        // console.log('[Administrator.js] reportSelectHandler: ' + selectedReport);

        if (selectedReport) {
            switch(selectedReport) {
                case 'logins':
                    this.loadLogins();
                    break;
                case 'other':
                    this.loadOther();    
                    break;
                case 'search':
                    this.props.history.push('/administrator/search');  
                    break;
                default:
            }            
        }     
    }

    /*
        Utilities
    */

    setLoadMessage = (message) => {
        // console.log('[Administrator.js] setLoadMessage: ' + message);

        this.setState({
            loadMessage: message,
            loading: !!message
        });
    }

    render() {

        // console.log(Route);

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

                        <div className="row">
                            <div id="header">Administration</div>
                        </div>

                        <div className="row">
                            <div className="col-lg-4">
                            
                                <SearchForm 
                                    loading={this.state.loading}
                                    results={this.state.search.results}
                                    select={this.reportSelectHandler}
                                    submitted={this.searchSubmitHandler} />

                            </div>
                            <div className="col-lg-4 col-lg-offset-1">

                                <ReportsList 
                                    select={this.reportSelectHandler} />
                                    
                            </div>
                        </div>                                

                        <div className="row">
                            <div className="col-lg-12">
                                <Switch>
                                    <Route 
                                        path="/administrator/reports/logins" 
                                        exact 
                                        render={() => 
                                            <Logins 
                                                load={() => this.loadLogins({refresh: true})}
                                                report={this.state.reports.data.logins} /> } />
                                    <Route 
                                        path="/administrator/reports/other" 
                                        exact 
                                        render={() => 
                                            <Other 
                                                report={this.state.reports.data.other} /> } />
                                    <Route
                                        path="/administrator/search"
                                        exact
                                        render={() => <SearchResults 
                                                        loading={this.state.loading}
                                                        results={this.state.search.results} />} />
                                    <Route 
                                        path="/administrator/search/:studentid" 
                                        render={() => <Student                                                         
                                                        certificateCodeSelect={this.handleAccredCodeChange}
                                                        select={this.studentSelectHandler}
                                                        student={this.state.student} />} />
                                </Switch>

                            </div>
                        </div>

                    </div>

                </Layout>
            </ErrorBoundary>     
        );    
    }
}

const stuffToExport = withRouter(AdministratorContainer);

export default stuffToExport;
