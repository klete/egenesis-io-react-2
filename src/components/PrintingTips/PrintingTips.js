import React from 'react';
import './PrintingTips.css';


const tips = () => {
    
        return (
        <div className="PrintingTips" id="printing-tips">
    
            <div className="pop-up-link" onClick={() => window.close()}>Close Window</div>

            <p>
            <b><i>When I go to print my certificates, I don't get the border or background picture.  How do I fix this?</i></b>
            </p>

            <p>There is a setting in the internet browser that allows you to print backgrounds.  Normally, this is turned off. </p>

            <p>Where it is depends on the browser you are using.  Usually people are using Internet Explorer, so I'll give you the directions for that.  The procedure for other browsers is similar.</p>

            <p>Look for an option/menu item called "Tools".  On the version I am using, this can be found on the top left next to "File", "Edit", "View", "Favorites", etc.  Click on this.</p>

            <p>Go to "Internet Options", possibly the last item in the drop down menu.  Click on this.</p>

            <p>Go to the "Advanced" tab, found to the far right on top. Click on this.</p>

            <p>There is a lot of stuff in this menu.  Look for an item about three-fourths the way down with the label "Printing."  You'll see a check box labeled, "Print background colors and images".
            Check this.</p>

            <p>Click "Apply" at the bottom.  Now you should be ready to go.  If you do some printing from the browser you might want to turn this off when you aren't printing certificates.</p>

            {/* <p>
                <b>Update For Internet Explorer 8:</b> 
                <a href="http://www.brightworksupport.com/forum/default.aspx?g=posts&t=24">Printing Background Images in IE8</a>
            </p>

            <p>
                Or this link to a Microsoft Support Article, <a href="http://support.microsoft.com/kb/974128">Background colors and images may not print when enabling the Print background colors and images setting in Internet Explorer 8</a>
            </p>

            <p>If you are using a different browser, you can google directions for printing backgrounds.</p> */}

            <div style={{ width: '640px', textAlign: 'center'}} id="site-footer">&copy; {new Date().getFullYear()} eGenesis. All rights reserved.</div>

        </div>
    );
};

export default tips;