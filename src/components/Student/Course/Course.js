import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import withAuthData from '../../../hoc/withAuthData'
import { timeForSeconds } from '../../../utility';

import moment from 'moment';

import './Course.css';


const course = (props) => {

    if (props.student.course) {
        
        let results = "results";
        let url = props.match.url.slice(0, -results.length) + "certificate" ;
    
        const course = props.student.course;
        const date_enrolled = moment(course.date_enrolled).format('MM/DD/YYYY');
        const date_completed = moment(course.date_completed).format('MM/DD/YYYY');
        const date_lecture_started = moment(course.date_lecture_started).format('MM/DD/YYYY');    
        const ceu = course.allow_certificate ? course.ceu.toFixed(2) : <span>&mdash;</span>;
        const actual_lecture_time = timeForSeconds(course.actual_lecture_time);

        const exams = course.exams.map(exam => {
            let exam_date_completed = moment(exam.date_completed).format('MM/DD/YYYY');
            let actual_exam_time = timeForSeconds(exam.actual_exam_time);
            let exam_result = [];
    
            if (exam.percent_correct*100 < course.pass_percent) {
                exam_result.push(<span key="1">Below minimum passing grade.</span>);
            }
            if ((course.max_exam_time > 0) && ((course.max_exam_time*60) < exam.actual_exam_time)) {
                exam_result.push(<span key="2">Too much time on exam.</span>);
            }
    
            return (
                <tr key={exam.st_no}>
                    <td className="data">{ exam_date_completed }</td>
                    <td className="data">{ exam.percent_correct*100 }%</td>
                    <td className="data">{ actual_exam_time }</td>
                    <td>{exam_result}</td>
                </tr>
            );
        });

        return (

            <div className="Course panel panel-default">
                        
                {props.authData.isAdministrator ? 
                    <div style={{margin: '8px 8px 16px'}}>
                        Student: 
                        <Link to={`/administrator/search/${props.student.user_no}`} style={{paddingLeft: '8px'}}>
                            {props.student.first_name} {props.student.last_name}
                        </Link></div> 
                    : null}
    
                <div className="panel-heading">Course Summary: { props.student.course.name }</div>
            
                <div className="panel-body">
                
                    <div className="panel-group">
    
                        <div className="panel panel-default">
                            
                            <div className="panel-heading">Status: Completed</div>
                            <div className="panel-body">
                                
                                <table className="table data">
                                <tbody>
                                <tr><td>Date Started:</td><td className="data">{ date_enrolled }</td></tr>    
                                <tr><td>Date Completed:</td><td className="data">{ date_completed }</td></tr>    
                                <tr><td>CEU</td><td className="data">{ ceu }</td></tr>    
                                <tr><td>&nbsp;</td>
                                    <td className="certificate">
                                        {course.allow_certificate ?                                              
                                            <Link to={url}>
                                                View Certificate
                                            </Link> 
                                            : <span>&mdash;</span>}
                                    </td>
                                </tr>    
                                </tbody>
                                </table>
                                
                            </div>
                            
                        </div>
    
                        <div className="panel panel-default">
                            
                            <div className="panel-heading">Lecture</div>
                            <div className="panel-body">
                                
                                <table className="table data">
                                <tbody>
                                <tr><td>Date Started:</td><td className="data">{ date_lecture_started }</td></tr>    
                                <tr><td>Time On Lecture:</td><td className="data">{ actual_lecture_time }</td></tr>    
                                </tbody>
                                </table>
                                
                            </div>
                            
                        </div>
    
                        <div className="panel panel-default">
                            
                            <div className="panel-heading">Exam Results</div>
                            <div className="panel-body">
                                
                                <table className="table data exam-results">
                                <tbody>
                                <tr><td>Date Completed:</td><td>Score</td><td>Time on Exam</td><td>&nbsp;</td></tr>                                
                                    {exams}
                                </tbody>
                                </table>
                                
                            </div>
                            
                        </div>
    
                        <div className="panel panel-default">
                            
                            <div className="panel-heading">CE Requirements</div>
                            <div className="panel-body">
                                
                                <table className="table data">
                                <tbody>
                                <tr><td>Passing Percentage:</td><td className="data">{ course.pass_percent } percent</td></tr>    
                                <tr><td>Min. Lecture Time</td><td className="data">
                                    {course.min_lecture_time === 0 ? <span>There was no minimum time limit on the reading.</span> : null}
                                    {course.min_lecture_time > 0 ? <span>{ course.min_lecture_time } minutes</span> : null}
                                            
                                </td></tr>    
                                <tr><td>Max. Exam Time:</td><td className="data">
                                    {course.max_exam_time === 0 ? <span>There was no maximum time limit to complete the exam.</span> : null}
                                    {course.max_exam_time > 0 ? <span>{ course.max_exam_time } minutes</span> : null}
                                </td></tr>    
                                </tbody>
                                </table>
                                
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
        
                <div className="panel-heading">Results</div>
                <div className="panel-body">
                
                    <div className="panel panel-default">
                        
                        <div className="panel-heading">{ course.catalog }</div>
                        <div className="panel-body">                
                            <h5>{ course.syllabus }</h5>
                            <div>Result: <b>{ course.result }</b></div>
                        </div>
                        
                    </div>
                        
                </div>
            </div>
    
        )
    } else {
        return null;
    }
};

export default withAuthData(withRouter(course));