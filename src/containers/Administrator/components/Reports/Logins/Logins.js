import React from 'react';

import './Logins.css';


const logins = (props) => {

    let logins_report_table = null;

    if (props.report) {

        if (props.report.length === 0) {

            logins_report_table = <div style={{ margin: '16px' }}>No login records found.</div>;
        
        } else {
        
            const logins_report = props.report.map(login => {                
                const date = new Date(login.dateandtime);
                const id = Math.floor(date / 1000); // get epoch
                const userName = login.name;

                return (
                    <tr key={id}>
                        <td>{date.toLocaleString()}</td>
                        <td>{userName}</td>
                    </tr>);
            });

            logins_report_table = (
                <table id="loginsReport">
                    <tbody>
                        {logins_report}
                    </tbody>
                </table>
            );    
        }
    }

    return (
        <div>
            <h4 style={{ width: '100%' }}>
                Recent Logins: 
                <button onClick={() => props.load(true)} style={{ float: 'right' }}>
                    Refresh
                </button>
            </h4>

            {logins_report_table}
        </div>
    );
    
}
    
export default logins;    
