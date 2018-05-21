import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '../../components/Layout/Layout';
import Logout from '../../components/Logout/Logout';

import Visitor from './components/Visitor/Visitor';
import TermsOfUse from './components/TermsOfUse/TermsOfUse';
import RefundPolicy from './components/RefundPolicy/RefundPolicy';
import Contact from './components/Contact/Contact';
import CredentialRetrieval from './components/CredentialRetrieval/CredentialRetrieval';
import ErrorPage from './components/ErrorPage/ErrorPage';
import PageNotFound from './components/PageNotFound/PageNotFound';

import withAuthData from '../../hoc/withAuthData'

import ErrorBoundary from '../../boundaries/ErrorBoundary/ErrorBoundary';


class OtherContainer extends Component {
    render () {
        return (
            <ErrorBoundary>
                <Layout>
                    <Switch>
                        {this.props.authData.isAuthenticated ? <Route path="/logout" exact component={Logout} /> : null }
                        <Route path="/visitor" exact component={Visitor} />
                        <Route path="/terms-of-use" component={TermsOfUse} />
                        <Route path="/refund-policy" component={RefundPolicy} />        
                        <Route path="/contact" component={Contact} />
                        <Route path="/credentials" component={CredentialRetrieval} />
                        <Route path="/error" exact component={ErrorPage} />
                        <Route component={PageNotFound} />
                    </Switch>
                </Layout>
            </ErrorBoundary>
        );
    }
}

export default withAuthData(OtherContainer);