import React from 'react';

import Category from './Category/Category';

import './Transcript.css';


const transcript = (props) => {

    let transcript = null;
    let classes = ['Transcript'];

    if (props.sortedTranscript) {
        
        if (props.transcript.length === 0) {
            transcript = 'This student has no completed courses.';
        } else {
            transcript = props.sortedTranscript.map(category => {
                return (
                    <Category     
                        key={category.cecat_no}                                                
                        {...category} />                    
                );                               
            });    
        }

        classes.push('show');
    }

    return (
        <div className="row">
            <div className="col-lg-12">
                    
                <div className={classes.join(' ')}>                    
    
                    <h4>Transcript</h4>

                    <div className="transcript">                    
                        {transcript}
                    </div>

                </div>
                
            </div>
        </div>
    );
}

export default transcript;
