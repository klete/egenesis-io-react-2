import React from 'react';

const pageNotFound = () => (
    <div className="ontainer-fluid">
        <div className="row">
            <div id="visitors-header">Page not found!</div>
        </div>
        <div className="row" id="visitors-content">
            The page you requested was not found.
        </div>
    </div>
);


export default pageNotFound;