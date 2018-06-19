import React from 'react';
import { withRouter } from 'react-router-dom';
import AuthUserContext from './AuthUserContext';
import { firebase } from '../firebase';
import * as routes from '../constants/routes';

const withAuthorisation = (authCondition) => (Component) => {
  class WithAuthorisation extends React.Component {
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if(!authCondition(authUser)) {
          this.props.history.push(routes.SIGN_IN);
        }
      });
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => authUser ? <Component /> : null}
        </AuthUserContext.Consumer>
      )
    }
  }

  return withRouter(WithAuthorisation);
}

export default withAuthorisation;