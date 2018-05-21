import React from 'react';

import Category from './Category/Category';

import './Transcript.css';


const transcript = (props) => {

    let transcript = [];

    if (props.student.sortedTranscript) {

        if (props.student.transcript.length === 0) {
            transcript = 'This student has no completed courses.';
        } else {
            transcript = props.student.sortedTranscript.map(category => {
                return (
                    <Category 
                        key={category.cecat_no} 
                        select={props.select}
                        {...category} />
                );                               
            });    
        }

    }

    return (
        <div className="row">
            <div className="col-lg-12">
                <h4>Transcript</h4>
                <div style={{margin: '16px'}}>
                    {transcript}
                </div>
            </div>
        </div>
    );
}

export default transcript;
