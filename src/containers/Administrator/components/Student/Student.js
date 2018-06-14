import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Transcript from '../../../../components/Student/Transcript/Transcript';
import Course from '../../../../components/Student/Course/Course';
import Certificate from '../../../../components/Student/Certificate/Certificate';

import PropTypes from 'prop-types';

import './Student.css'


class Student extends React.Component {
    
    componentDidMount(){
        // console.log('[Student.js]: componentDidMount');
        // console.log(this.props);
        this.props.select(this.props.match.params.studentid);
    }

    render() {
        if (this.props.student.id) {

            let styleClassesArray = ['row', 'StudentAdmin', 'fadein'];

            const styleClasses = styleClassesArray.join(' ');


            let returnToSearchResults = null;

            returnToSearchResults = (
                <div key="display" className="row">
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-lg-12">

                                <h4>Student: {this.props.student ? this.props.student.first_name + ' ' + this.props.student.last_name  : 'not student'} ({this.props.student.id})</h4>

                                <table style={{margin: '16px 32px'}}>
                                    <tbody>
                                        <tr>
                                            <td>User name:</td>
                                            <td>{this.props.student.user_name}</td>
                                        </tr>
                                        <tr>
                                            <td>Password:</td>
                                            <td>{this.props.student.password}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                            </div>
                        </div>
                    </div>
                </div>
            );        
        
            return (
                <div key="display" className={styleClasses}>
                    <div className="col-lg-6">
        
                        {returnToSearchResults}
                        
                        <Transcript 
                            transcript={this.props.student.transcript}
                            sortedTranscript={this.props.student.sortedTranscript} />
        
                    </div>
                    <div className="col-lg-6">
                        <TransitionGroup>
                            <CSSTransition key={this.props.location.key} classNames="fade" timeout={350} unmountOnExit>
                                <Switch>
                                    <Route 
                                        path={this.props.match.url + "/:scid/results"} 
                                        exact 
                                        render={() => <Course 
                                                        student={this.props.student} />} />
                                    <Route 
                                        path={this.props.match.url + "/:scid/certificate"} 
                                        exact 
                                        render={() => <Certificate 
                                                        student={this.props.student} 
                                                        codeSelect={this.props.certificateCodeSelect} />} />
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
}

Student.propTypes = {
    student: PropTypes.object,
    select: PropTypes.func,
    certificateCodeSelect: PropTypes.func
};

export default withRouter(Student);
