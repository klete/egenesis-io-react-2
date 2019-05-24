import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

// import Copyright from '../Copyright/Copyright';

import withAuthData from '../../hoc/withAuthData'

import PropTypes from 'prop-types';



import './Layout.css';


class Layout extends Component {

    state = {
        showCollapse: false,
        isIn: false,
        minHeight: null
    }

    toggleState() {
        const bool = this.state.isIn;
        this.setState({
            isIn: bool === false
        });
    }    

    componentDidMount() {
        this.onResize();
        window.addEventListener("resize", this.onResize);
        window.addEventListener("scroll", this.onResize);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
        window.removeEventListener("scroll", this.onResize);
    }

    onResize = () => {
        let topOffset = 50;
        const width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
        let showCollapse;
        let height;
        let minHeight;
    
        if (width < 768) {
            showCollapse = true;   // $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            showCollapse = false;  // $('div.navbar-collapse').removeClass('collapse');
        }
    
        height = ((document.body.scrollHeight > 0) ? document.body.scrollHeight : window.screen.height) - 1;
        height = height - topOffset;
    
        if (height < 1) {
            height = 1;
        }
    
        if (height > topOffset) {
            minHeight = height;    // $('#page-wrapper').css('min-height', (height) + 'px');
        }
    
        this.setState({
            minHeight: minHeight,
            showCollapse: showCollapse
        });
    }

    render() {
        let collapseStyles = 'sidebar-nav navbar-collapse collapse';

        if (this.state.isIn){
            collapseStyles += ' in';
        }

        const pageWrapperStyle= {
            minHeight: this.state.minHeight
        };
    
        let home = [];

        if (this.props.authData.isAuthenticated) {
            
            if (this.props.authData.isAdministrator) {
                home.push(<li key="administrator"><NavLink to="/administrator" activeClassName="activeLink" exact>Administration</NavLink></li>);
                // home.push(<li key="reports"><NavLink to="/administrator/reports" activeClassName="activeLink" exact>Reports</NavLink></li>);
            } 
            if (this.props.authData.isStudent) {
                home.push(<li key="student"><NavLink to="/student" activeClassName="activeLink">Home</NavLink></li>);
            }
        }

        return (
                        
            <div id="wrapper">

                <nav className="navbar navbar-default" style={{ marginBottom: 0 }}>
        
                    <div className="container-fluid">
                    
                        <div className="navbar-header">
                        
                            <button type="button" className="navbar-toggle" onClick={ this.toggleState.bind(this) }>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span> 
                            </button>
                            <Link className="navbar-brand" to="/">eGenesis</Link>
                            <div style={{float: 'left', padding: '15px 0'}}>
                                {this.props.authData.user ? this.props.authData.user.first_name : null} {this.props.authData.user ? this.props.authData.user.last_name : null} 
                            </div>
                                    
                        </div>

                        <div className={ collapseStyles }>

                            <ul className="nav navbar-default sidebar">
                                {home}
                                <li><NavLink to="/visitor" activeClassName="activeLink">Visitors</NavLink></li>
                                <li><NavLink to="/contact" activeClassName="activeLink">Contact Us</NavLink></li>
                                <li><NavLink to="/refund-policy" activeClassName="activeLink">Refund Policy</NavLink></li>
                                <li><NavLink to="/terms-of-use" activeClassName="activeLink">Terms of Use</NavLink></li>
                            </ul>                                                            

                            { this.props.authData.isAuthenticated 
                                ?   <ul className="nav navbar-default navbar-right">
                                        <li><NavLink to="/logout">Logout</NavLink></li>
                                    </ul>
                                : null
                            }

                        </div>
                        
                    </div>

                </nav>

                <div id="page-wrapper" style={pageWrapperStyle}>

                    <div style={{margin: '0', padding: '1em .5em', height: '100%'}}>
                        {this.props.children}
                        {/* <Copyright /> */}
                    </div>
                    
                </div>                    
            </div>
            
        );

    }

};

Layout.propTypes = {
    authData: PropTypes.shape({
        user: PropTypes.shape({
            first_name: PropTypes.string,
            middle_name: PropTypes.string,
            last_name: PropTypes.string,
            user_no: PropTypes.number,
            cert_name: PropTypes.string,
            cert_entity: PropTypes.number,
            email: PropTypes.string,
            roles: PropTypes.array,
            is_admin: PropTypes.bool,
            is_student: PropTypes.bool
        }),
        isAdministrator: PropTypes.bool,
        isStudent: PropTypes.bool,
        isAuthenticated: PropTypes.bool
    })
}


export default withAuthData(Layout);
