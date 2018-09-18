import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter, Redirect } from 'react-router-dom';
import { firebase } from '../firebase';
import * as routes from '../constants/routes';

const withAuthorisation = (authCondition) => (Component) => {
  
  const AuthorisedComponent = ({ authUser, authRoles }) => {
    return authCondition(authUser, authRoles) ? <Component /> : null;
  }

  const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
    authRoles: state.sessionState.authRoles
  });

  return connect(mapStateToProps)(AuthorisedComponent)
}

export const withAuthorisationRedirect = (authCondition) => (Component) => {
  class WithAuthorisation extends React.Component {
    
    componentWillMount() {
      
      firebase.auth.onIdTokenChanged(authUser => {
        if(!authCondition(authUser, this.props.authRoles)) {
          this.props.history.push(routes.SIGN_IN);
        }
      });
    }
    
    render() {
      return authCondition(this.props.authUser, this.props.authRoles) ? <Component /> : null;
    }
  }

  const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
    authRoles: state.sessionState.authRoles
  });

  return compose(
    withRouter,
    connect(mapStateToProps)
  )(WithAuthorisation);
}

export default withAuthorisation;