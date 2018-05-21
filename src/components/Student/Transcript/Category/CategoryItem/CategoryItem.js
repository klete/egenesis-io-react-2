import React from 'react';

import moment from 'moment';

import './CategoryItem.css';

const categoryItem = (props) => {

    const date_completed = moment(props.date_completed).format('MM/DD/YYYY');        
    const ceu = props.allow_certificate ? props.ceu.toFixed(2) : <span>&mdash;</span>;

    return (
        <tr key={props.sc_no}>
            <td className="completed">{date_completed}</td>
            <td className="course">{props.name}</td>
            <td className="ceu">
                {ceu}
            </td>
            <td className="results link" 
                onClick={() => props.select(props.sc_no, 'results')}>
                Results
            </td>
            {props.allow_certificate ?                     
                <td 
                    className="certificate link" 
                    onClick={() => props.select(props.sc_no, 'certificate')}>
                    Certificate
                </td>
                : 
                <td className="certificate">
                    <span>&mdash;</span>
                </td>
            }
        </tr>
    );
};

export default categoryItem;