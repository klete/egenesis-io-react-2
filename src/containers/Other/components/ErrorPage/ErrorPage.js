import React from 'react';

import './ErrorPage.css';

const errorPage = () => (
    <div className="container-fluid">
        <div className="row">
            <div id="visitors-header">Error Page</div>
        </div>
        <div className="row" id="visitors-content">
            An error occurred!
        </div>
    </div>
);

export default errorPage;