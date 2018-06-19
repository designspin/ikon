import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
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
      return this.props.authUser ? <Component /> : null;
    }
  }

  const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
  })

  return compose(
    withRouter,
    connect(mapStateToProps)
  )(WithAuthorisation);
}

export default withAuthorisation;