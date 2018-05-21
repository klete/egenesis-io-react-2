import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import Transcript from './Transcript/Transcript';
import Course from './Course/Course';
import Certificate from './Certificate/Certificate';

import withAuthData from '../../hoc/withAuthData'


const student = (props) => {

    // console.log(JSON.stringify(props.student));

    if (props.student.id) {
        let returnToSearchResults = null;

        if (props.authData.isAdministrator) {
            returnToSearchResults = (
                <div key="display" className="row">
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-lg-12">

                                <h4>Student: {props.student ? props.student.first_name + ' ' + props.student.last_name  : 'not student'} ({props.student.id})</h4>

                                <table style={{margin: '16px 32px'}}>
                                    <tbody>
                                        <tr>
                                            <td>User name:</td>
                                            <td>{props.student.user_name}</td>
                                        </tr>
                                        <tr>
                                            <td>Password:</td>
                                            <td>{props.student.password}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    
        return (
            <div key="display" className="row">
                <div className="col-lg-6">
    
                    {returnToSearchResults}
                    
                    <Transcript 
                        student={props.student}
                        select={props.select} />
    
                </div>
                <div className="col-lg-6">
                    <Switch>
                        <Route 
                            path={props.match.url + "/:scid/results"} 
                            exact 
                            render={() => <Course 
                                            student={props.student} />} />
                        <Route 
                            path={props.match.url + "/:scid/certificate"} 
                            exact 
                            render={() => <Certificate 
                                            student={props.student} 
                                            codeSelect={props.certificateCodeSelect} />} />
                    </Switch>
                </div>
            </div>        
        );
    } else {
        return null;
    }
}

export default withAuthData(withRouter(student));
