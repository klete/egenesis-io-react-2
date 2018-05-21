import React from 'react';


const termsOfUse = () => {

    const headerStyle = {
        fontWeight: '900',
        fontSize: '1.1em'
    };

    const currentYear = (new Date()).getFullYear();

    return (
        <div className="container-fluid">
            <div className="row">
                <div id="visitors-header">Terms Of Use, Privacy Policy, Copyrights</div>
            </div>
            <div className="row" id="visitors-content">        
                <p>Thank you for taking the time to visit the eGenesis website and reviewing our privacy and security statement. eGenesis is strongly committed to maintaining 
                the privacy of your personal information and of course the security of our computer and related systems. Regarding the collection, use and disclosure of 
                personal information, eGenesis makes every effort to ensure compliance with applicable Federal laws, including, but not limited to, the Privacy Act of 1974, 
                the Paperwork Reduction Act of 1995, and the Freedom of Information Act.</p>
            
                <p>As a general rule, eGenesis does not collect information which is personally-identifying about you when you visit our site, unless you choose to provide 
                this information to us. The information we receive from you depends upon what you do and how you interact with the website when visiting our site.</p>
            
                <hr />
            
                <p style={headerStyle}>When you visit our site to read or download information, we collect and store the following information:</p>
            
                <ul>
                    <li>The name of the domain from which you access the Internet (for example, eGenesis.cc, if you are connecting from one of our internal computers).</li>
                    <li>The date and time you access our site.</li>
                    <li>The Internet address of the website from which you linked directly to our site.</li>
                </ul>
            
                <p>The above information is used by software programs on our website to create summary statistics which allow us to assess the number of visitors to the 
                different sections of our site, identify what information is of most and least interest, determine technical design specifications, monitor system performance, 
                and help us make our site more useful to visitors.</p>
            
                <hr />
            
                <p style={headerStyle}>If you identify yourself by sending an E-mail containing personal information:</p>
            
                <p>You also may decide to send us personally-identifying information, for example your mailing address, in an electronic mail message requesting that information be mailed to you. Information collected in this manner is used solely for responding to requests for information or records.</p>
            
                <hr />
            
                <p style={headerStyle}>If you link to other sites outside eGenesis:</p>
            
                <p>Our website has many links to other sites. When you link to any of these sites, you are no longer on our site and are subject to the privacy policy of the new site.</p>
            
                <hr />
            
                <p style={headerStyle}>Cookie Use Notice</p>
            
                <p>Due to the nature of the information flow with in our web site, eGenesis employs "cookies" to provide continuity of flow through our site and therefore, better 
                service to our customers. eGenesis does not use cookies to collect any personally identifying information from users or to track user activities beyond our web site. 
                eGenesis does not maintain copies of cookies on our web site after you leave our web site.</p>
            
                <p>Cookies are small pieces of temporary data that are exchanged between a web site and a user's computer which enable a "session", or "dialog", to be established 
                between the two machines. With the session established, eGenesis is able to tailor its responses (i.e., identify and provide you with the information you want) and 
                help you traverse our web pages in the most efficient and effective manner possible. The session is often broken when eGenesis's server does not receive further 
                requests from your computer or you simply exit your browser.</p>
            
                <p>eGenesis limits its use of cookies to "session cookies" types of cookies that are temporarily stored in your computer's memory. Session cookies are normally 
                deleted from a user's computer when the user logs off the computer or the user exits the browser.</p>
            
                <hr />
            
                <p>For security purposes and to ensure that this service remains available to all users, our website also employs software programs to monitor network traffic to 
                identify unauthorized attempts to upload or change information, or otherwise cause damage. Unauthorized attempts to upload information or change information 
                on this service are strictly prohibited and may be punishable under the Computer Fraud and Abuse Act of 1986 and the National Information Infrastructure Protection 
                Act of 1996.</p>
            
                <hr />
            
                <p style={headerStyle}>Copyright Notice</p>
            
                <p>All art, logos, lesson text and code are &copy; { currentYear } eGenesis, Inc. all rights reserved, unless otherwise noted.</p>
            
            </div>
        </div>
    );
};

export default termsOfUse;