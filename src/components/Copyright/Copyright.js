import React from 'react';

import './Copyright.css';

const copyright = (props) => {

    const currentYear = (new Date()).getFullYear();

    return (

        <div className="Copyright">
        <div className="cprBox">

            <div style={{ 'backgroundColor': 'transparent', height: '18em' }}>&nbsp;</div>

            <div className="welcomeFooter">
                <div id="siteFooter2">&copy; { currentYear } eGenesis. All rights reserved.</div>
            </div>

        </div>
        </div>

    );

};

export default copyright;