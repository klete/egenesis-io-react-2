import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import imgScottR from './assets/ScottR.gif';
import imgGaryVincent from "./assets/GaryVincent.gif";

import withAuthData from '../../../hoc/withAuthData'

import moment from 'moment';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

import { getCategory, getAccredCodes, getCourse } from '../../../utility';

import './Certificate.css';


class Certificate extends React.Component {

    constructor(props) {
        // console.log('[Certificate.js] constructor: ');
        super(props);

        this.state = {
            certificate: null,
            course: setCourse(props),
            url: getResultsUrl(props)
        };        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log('[Certificate.js] getDerivedStateFromProps: ');
        // console.log(nextProps);

        if (+nextProps.match.params.scid !== prevState.sc_no) {
            const course = setCourse(nextProps);
            const student = nextProps.student;
            return {
                course: course,
                certificate: loadCertificate(student, course),
                url: getResultsUrl(nextProps)
            };
        } else {
            return null;
        }        
    }

    handlePrintingTips() {
        window.open('/printing-tips', 'printingtips', 'width=680, height=550, scrollbars=yes, resizable=yes');
    }

    handlePdfRequest = () => {
        // console.log('[Certificate.js] handlePdfRequest');
        const elementToPrint = document.getElementById('canvas');
        const m = new Date(this.state.certificate.date_completed);
        const dateString = m.getUTCFullYear() + '_' + (m.getUTCMonth() + 1) + '_' + m.getUTCDate();
        const pdf_title = this.state.certificate.title + '_' + dateString;

        html2canvas(elementToPrint).then(canvas => {
            const ctx = canvas.getContext('2d');
            ctx['imageSmoothingEnabled'] = false;
            ctx['mozImageSmoothingEnabled'] = false;
            ctx['oImageSmoothingEnabled'] = false;
            ctx['webkitImageSmoothingEnabled'] = false;
            ctx['msImageSmoothingEnabled'] = false;

            const imgData = canvas.toDataURL('image/jpg');
            const pdf = new jsPDF('l', 'pt', 'a4');
            const width = pdf.internal.pageSize.width;
            const height = pdf.internal.pageSize.height;

            pdf.addImage(imgData, 'JPG', 0, 0, width, height);
            pdf.save(pdf_title);
        });            
    }

    render () {
        // console.log('[Certificate.js] render');

        if (this.state.certificate) {

            const accreditationCodes = getAccredCodes(this.state.certificate.departmentid);
    
            const outputCodes = accreditationCodes.map(code => {
                return <option key={code.id} value={code.id}>{code.state}</option>;
            });
    
            const options = [<option key='0' value=''></option>, ...outputCodes];

            return (
                <div className="Certificate panel panel-default">
    
                    {this.props.authData.isAdministrator ? 
                        <div style={{margin: '8px 8px 16px'}}>
                            Student: 
                            <Link to={`/administrator/search/${this.props.student.user_no}`} style={{paddingLeft: '8px'}}>
                                {this.props.student.first_name} {this.props.student.last_name}
                            </Link>
                        </div> 
                        : null}
    
                    <div className="panel-heading">
                        Course Summary: <Link to={this.state.url}>{ this.state.certificate.title }</Link>
                    </div>
                    <div className="panel-body">
    
                        <div id="links-bar">
                                                
                            <form noValidate style={{float: 'left'}}>
                        
                                <label style={{marginRight: '12px', marginBottom: '24px'}}>Approval Code</label>
                                <select value={this.props.student.certEntity} onChange={(event) => this.props.codeSelect(event)}>
                                    {options}
                                </select>
                        
                            </form>
                        
                            <div className="pop-up-link" onClick={this.handlePdfRequest}>Download Certificate</div>
                            <div className="pop-up-link" onClick={this.handlePrintingTips}>Printing Tips</div>
    
                        </div>
    
                        <div id="canvas">
                            
                            {this.props.student.certEntity === 3 ? 
                                <div id="california">
                                    This course has been approved for {this.state.certificate.ceu} {+this.state.certificate.ceu > 1 ? 'hours' : 'hour' } of continuing education by an approved EMS CE provider and was instructor-based.  This document must be retained for a period of four years.
                                </div>
                                : null
                            }
                                                        
                             <div id="certify">
                                 This is to certify that
                             </div>
                             <div id="certname">
                                 { this.state.certificate.certname }
                             </div>
                             <div id="has-successfully-completed-the-course">
                                 has successfully completed the course
                             </div>
                             <div id="certificate-title">
                                 { this.state.certificate.title }
                             </div>
                             <div id="in-the-category-of">
                                 in the category of
                             </div>
                             <div id="certificate-category">
                                 { this.state.certificate.category }
                             </div>
                             <div id="certificate-date-completed">
                                 { this.state.certificate.date_completed }
                             </div>
                             <div id="certificate-ceu">
                                 { this.state.certificate.ceu }&nbsp;hours&nbsp;CE&nbsp;Lecture
                             </div>                    
                             <div id="ems-coordinator-signature">                    
                                 <img src={imgScottR} alt="Scott R Signature" border="0" height="28" width="145" />
                             </div>
                             <div id="ems-coordinator-a">
                                 Scott Reichel
                            </div>
                            <div id="ems-coordinator-b">
                                 EMS Training Coordinator
                             </div>
                             <div id="accreditation-code">
                                 { this.props.student.accreditationCode ? this.props.student.accreditationCode : '' }
                             </div>
                             <div id="fire-coordinator-signature">
                                 <img src={imgGaryVincent} alt="Gary V Signature" border="0" height="28" width="145" />                    
                             </div>
                             <div id="fire-coordinator-a">
                                 Gary Vincent
                            </div>
                            <div id="fire-coordinator-b">
                                 Fire Training Coordinator
                             </div>
                             <div id="egenesis-address">
                                 eGenesis, Inc. &bull; 2306 Blodgett St. &bull; Unit 1 &bull; Houston, TX 77004
                             </div>
                             <div id="reference-number">
                                 Ref #{ this.state.certificate.scid }
                             </div>
                        
                         </div> 

                    </div>
                    
                </div>
            );
    
        } else {
            return null;
        }
    }
}

const setCourse = (props) => {
    if (props.student.transcript) {
        return props.student.transcript.find(trs_course => {
            return trs_course.sc_no === +props.match.params.scid;
        });    
    } else {
        return null;
    }
}; 

const getResultsUrl = (props) => {
    // Remove "certificate" from the end of the current url and add "results"
    let certificateStr = "certificate";
    const url = props.match.url.slice(0, -certificateStr.length) + "results" ;    
    return url;
};


const getCertName = (student) => {
    const firstname = student.first_name;
    const middlename = student.middle_name;
    const lastname = student.last_name;
    let name = null;

    if (
        middlename !== null &&
        middlename !== undefined &&
        middlename.length
    ) {
        name = firstname + ' ' + middlename + ' ' + lastname;
    } else {
        name = firstname + ' ' + lastname;
    }

    return name;
}

const loadCertificate = (student, course) => {
    // console.log('[Certificate.js] loadCertificate: ');    
    // Can reload the student since it may be stored in local storage, but can't reload the selected course.

    if (student && course) {
        // console.log('[Certificate.js] loadCertificate: setting data');
        const courseData = getCourse(course.course_no);
        const dateCompleted = moment(course.date_completed).format('MM/DD/YYYY');
        const ceu = course.allow_certificate ? course.ceu.toFixed(2) : null;
        const category = getCategory(+course.cecat_no).name;            

        const certificate = {
            scid: +course.sc_no,
            title: course.name,
            category: category,
            date_completed: dateCompleted,
            ceu: ceu,
            certname: student.cert_name,
            certEntity: student.certEntity,
            departmentid: courseData.department_no
        };

        if (!certificate.certname) {
            certificate.certname = getCertName(student);
        }            

        return certificate;
    } else {
        return null;
    }
}

export default withAuthData(withRouter(Certificate));