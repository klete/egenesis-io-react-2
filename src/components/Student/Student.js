import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


import Transcript from './Transcript/Transcript';
import Course from './Course/Course';
import Certificate from './Certificate/Certificate';

import PropTypes from 'prop-types';

import './Student.css';


const student = (props) => {
    
    if (props.student.id) {
        let returnToSearchResults = null;       
    
        return (
            <div key="display" className="row Student">
                <div className="col-lg-6">
    
                    {returnToSearchResults}
                    
                    <Transcript 
                        transcript={props.student.transcript}
                        sortedTranscript={props.student.sortedTranscript} />
    
                </div>
                <div className="col-lg-6">
                    <TransitionGroup>
                        <CSSTransition key={props.location.key} classNames="fade" timeout={350} unmountOnExit>
                            <Switch location={props.location}>
                                <Route 
                                    path={props.match.url + "/:scid/results"} 
                                    exact 
                                    render={() => <Course 
                                                    unmountOnExit
                                                    student={props.student} {...props} />} />
                                <Route 
                                    path={props.match.url + "/:scid/certificate"} 
                                    exact 
                                    render={() => <Certificate 
                                                    student={props.student} 
                                                    codeSelect={props.certificateCodeSelect} {...props} />} />
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>
                </div>
            </div>        
        );
    } else {
        return null;
    }
}

student.propTypes = {
    student: PropTypes.object
};

export default withRouter(student);
