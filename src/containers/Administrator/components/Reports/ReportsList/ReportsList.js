import React from 'react';

import './ReportsList.css';


const reportsList = (props) => {    
    return (
        <div>
            <h4>Reports</h4>
            <ul className="with-links">
                <li onClick={() => props.select('logins')}>Recent Logins</li>
                <li onClick={() => props.select('other')}>Other Report</li>                
            </ul>
        </div>
    )
};

export default reportsList;