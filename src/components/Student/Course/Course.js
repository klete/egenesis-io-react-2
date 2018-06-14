import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import withAuthData from '../../../hoc/withAuthData'
import { timeForSeconds } from '../../../utility';

import moment from 'moment';

import './Course.css';


const getCertificateUrl = (props) => {
    // Remove "results" from the end of the current url and add "certificate"
    let results = "results";
    return props.match.url.slice(0, -results.length) + "certificate" ;
};

const formatAsDate = (item) => {
    return moment(item).format('MM/DD/YYYY');
};

const setCEU = (ceu, allow_certificate) => {
    return allow_certificate ? ceu.toFixed(2) : <span>&mdash;</span>;
};

const setExams = (exams, max_exam_time, pass_percent) => {
    return exams.map(exam => {
        const exam_date_completed = formatAsDate(exam.date_completed);
        const actual_exam_time = timeForSeconds(exam.actual_exam_time);
        let exam_result = [];
    
        if (exam.percent_correct*100 < pass_percent) {
            exam_result.push(<span key="1">Below minimum passing grade.</span>);
        }
        if ((max_exam_time > 0) && ((max_exam_time*60) < exam.actual_exam_time)) {
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
};

const setCourse = (props) => {
    if (!props.student.transcript) {
        return null;
    }
    return props.student.transcript.find(trs_course => {
        return trs_course.sc_no === +props.match.params.scid;
    });    
}; 

class Course extends React.Component {

    constructor(props) {
        console.log('[Course.js] constructor');
        super(props);

        this.state = {
            course: setCourse(props)
        };
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (+nextProps.match.params.scid !== prevState.sc_no) {
            return {
                course: setCourse(nextProps)
            };
        } else {
            return null;
        }        
    }

    render() {
        if (this.state.course) {

            const course = this.state.course;

            const { name, 
                    date_enrolled, 
                    date_completed, 
                    date_lecture_started, 
                    allow_certificate, 
                    ceu, 
                    actual_lecture_time, 
                    exams, 
                    max_exam_time, 
                    pass_percent } = course;

            const dateEnrolled = formatAsDate(date_enrolled);
            const dateCompleted = formatAsDate(date_completed);
            const dateLectureStarted = formatAsDate(date_lecture_started);   
            const ceuAwarded = setCEU(ceu, allow_certificate);
            const actualLectureTime = timeForSeconds(actual_lecture_time);
            const examsOutput = setExams(exams, max_exam_time, pass_percent);
            const courseName = name;

            const adminReturnLink = this.props.authData.isAdministrator ? 
                <div style={{margin: '8px 8px 16px'}}>
                    Student: 
                    <Link to={`/administrator/search/${this.props.student.user_no}`} style={{paddingLeft: '8px'}}>
                        {this.props.student.first_name} {this.props.student.last_name}
                    </Link>
                </div> 
                : null;

            const linkToCertificate = course.allow_certificate ?                                              
                                        <Link to={getCertificateUrl(this.props)}>
                                            View Certificate
                                        </Link> 
                                        : <span>&mdash;</span>;

            return (

                <div className="Course panel panel-default">
                            
                    { adminReturnLink }
        
                    <div className="panel-heading">Course Summary: { courseName }</div>
                
                    <div className="panel-body">
                    
                        <div className="panel-group">
        
                            <div className="panel panel-default">
                                
                                <div className="panel-heading">Status: Completed</div>
                                <div className="panel-body">
                                    
                                    <table className="table data">
                                        <tbody>
                                        <tr>
                                            <td>Date Started:</td>
                                            <td className="data">{ dateEnrolled }</td>
                                        </tr>    
                                        <tr>
                                            <td>Date Completed:</td>
                                            <td className="data">{ dateCompleted }</td>
                                        </tr>    
                                        <tr>
                                            <td>CEU</td>
                                            <td className="data">{ ceuAwarded }</td>
                                        </tr>    
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td className="certificate">{ linkToCertificate }</td>
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
                                        <tr>
                                            <td>Date Started:</td>
                                            <td className="data">{ dateLectureStarted }</td>
                                        </tr>    
                                        <tr>
                                            <td>Time On Lecture:</td>
                                            <td className="data">{ actualLectureTime }</td>
                                        </tr>    
                                    </tbody>
                                    </table>
                                    
                                </div>
                                
                            </div>
        
                            <div className="panel panel-default">
                                
                                <div className="panel-heading">Exam Results</div>
                                <div className="panel-body">
                                    
                                    <table className="table data exam-results">
                                    <tbody>
                                        <tr><td>Date Completed:</td>
                                            <td>Score</td>
                                            <td>Time on Exam</td>
                                            <td>&nbsp;</td>
                                        </tr>                                
                                        {examsOutput}
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
                                    <tr>
                                        <td>Min. Lecture Time</td>
                                        <td className="data">
                                            {course.min_lecture_time === 0 ? <span>There was no minimum time limit on the reading.</span> : null}
                                            {course.min_lecture_time > 0 ? <span>{ course.min_lecture_time } minutes</span> : null}                                            
                                        </td>
                                    </tr>    
                                    <tr>
                                        <td>Max. Exam Time:</td>
                                        <td className="data">
                                            {course.max_exam_time === 0 ? <span>There was no maximum time limit to complete the exam.</span> : null}
                                            {course.max_exam_time > 0 ? <span>{ course.max_exam_time } minutes</span> : null}
                                        </td>
                                    </tr>    
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
    }
};

export default withAuthData(withRouter(Course));