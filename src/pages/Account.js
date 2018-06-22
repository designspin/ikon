import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from '../components/PasswordChange';
import withAuthorisation from '../components/withAuthorisation';
import { auth } from '../firebase/firebase';

const AccountPage = ({ authUser }) =>
  <div>
    <Typography
      gutterBottom
      variant="headline" 
      component="h1"
      >Account: {authUser.email}</Typography>
    <PasswordForgetForm />
    <PasswordChangeForm />
  </div>

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
})

const authCondition = async (authUser) => { 
  console.log("Auth condition, auth: ", auth);
  if(auth.currentUser) {
    console.log("Auth Condition Has currentUser")
    
    await auth.currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        console.log("Claims: ", !!idTokenResult.claims);
        console.log("Roles: ", !!idTokenResult.claims.roles);
        console.log("Admin: ", !!idTokenResult.claims.roles && !!idTokenResult.claims.roles.admin);
        return !!idTokenResult.claims && !!idTokenResult.claims.roles && idTokenResult.claims.roles.admin;
      })
  } else {
    return false;
  }
}
export default compose(
  withAuthorisation(authCondition),
  connect(mapStateToProps)
)(AccountPage);