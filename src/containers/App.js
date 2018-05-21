import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

// Containers
import Administrator from './Administrator/Administrator';
import Home from './Home/Home';
import Other from './Other/Other';
import Student from './Student/Student';

import PrintingTips from '../components/PrintingTips/PrintingTips';

import withAuthData from '../hoc/withAuthData'

import PropTypes from 'prop-types';

import './App.css';


class App extends Component {

  render () {
    // console.log('[App.js] render');

    return (
      <div className="App">
          <Switch>
            <Route path="/" exact component={Home} />
            {this.props.authData.isStudent ? <Route path="/student" component={Student} /> : null }
            {this.props.authData.isAdministrator ? <Route path="/administrator" component={Administrator} /> : null }
            <Route path="/printing-tips" component={PrintingTips} />
            <Route component={Other} />
          </Switch>
      </div>
    );

  }
}

App.propTypes = {
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

export default withAuthData(App);
