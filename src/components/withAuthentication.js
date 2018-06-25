import React from 'react';
import { connect } from 'react-redux';
import { firebase } from '../firebase';
import { auth } from '../firebase/firebase';

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    componentDidMount() {
      const { onSetAuthUser, onResetAuth } = this.props;

      firebase.auth.onAuthStateChanged(authUser => {
        authUser
          ? onSetAuthUser(authUser)
          : onResetAuth();
        });
    }
    
    render() {
      return (
          <Component />
      );
    }
  }

  const mapDispatchToProps = (dispatch) => ({
    onSetAuthUser: (authUser) => { 
      dispatch({ type: 'AUTH_USER_SET', authUser })
      auth.currentUser.getIdToken(true);
      auth.currentUser.getIdTokenResult()
          .then((idTokenResult) => {
            if(!!idTokenResult.claims.roles) {
              const authRoles = idTokenResult.claims.roles;
              dispatch({ type: "AUTH_ROLE_SET", authRoles })
            }
          });
    },
    onResetAuth: () => dispatch({ type: "AUTH_RESET"})
  });

  return connect(null, mapDispatchToProps)(WithAuthentication)
}

export default withAuthentication;