import React from 'react';


const contact = () => {

    const style1 = {
        margin: 0, 
        padding: 0,
        fontWeight: 900,
        fontSize: '1.1em'
    };
    const style2 = {
        margin: '0 0 0 1em' 
    };
    const style3 = {
        textAlign: 'right', 
        verticalAlign: 'top',
        padding: '.3em 0'
    };
    const style4 = {
        padding: '0.3em',
        fontWeight: 900
    };
    const style5 = {
        margin: '.5em 0', 
        padding: 0, 
        fontWeight: 900, 
        fontSize: '1.1em'
    };
    const style6 = {
        padding: '.3em 0', 
        textAlign: 'right'
    };
    const style7 = {
        padding: '.3em'
    };
    const style8 = {
        padding: '.3em 0'
    };

    return (
        <div className="ontainer-fluid">
            <div className="row">
                <div id="visitors-header">Contact Us</div>
            </div>
            <div className="row" id="visitors-content">
                            
                <div style={style1}>To contact eGenesis, please write or call:</div>
            
                <table border="0" cellPadding="0" cellborder="0" style={style2}>
                <tbody>
                    <tr>
                        <td style={style3}>Address:</td>
                        <td style={style4}>
                            eGenesis, Inc.<br />
                            2306 Blodgett St. Unit 1<br />
                            Houston, Texas 77004
                        </td>
                    </tr>
                    <tr>
                        <td style={style3}>Office:</td>
                        <td style={style4}>281-538-9911</td>
                    </tr>
                    <tr>
                        <td style={style3}>Fax:</td>
                        <td style={style4}>281-538-9905</td>
                    </tr>
                </tbody>
                </table>
            
                <div style={style5}>Or send us an e-mail at:</div>
            
                <table border="0" cellPadding="0" cellborder="0" style={style2}>
                <tbody>
                    <tr>
                        <td style={style6}>To Report a Website Problem:</td>
                        <td style={style7}><b>webmaster@egenesis.cc</b></td>
                    </tr>
                    <tr>
                        <td style={style6}>To Reach the eGenesis Offices:</td>
                        <td style={style7}><b>inquiry@egenesis.cc</b></td>
                    </tr>
                </tbody>
                </table>
            
                <div style={style5}>Office Hours:</div>
            
                <table border="0" cellPadding="0" cellborder="0" style={style2}>
                <tbody>
                    <tr>
                        <td style={style8}>9am - 4pm Central US, Mon - Fri</td>
                    </tr>
                </tbody>
                </table>
                
            </div>

        </div>
    );
};

export default contact;