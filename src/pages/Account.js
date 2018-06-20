import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from '../components/PasswordChange';
import withAuthorisation from '../components/withAuthorisation';

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

const authCondition = (authUser) => !!authUser;

export default compose(
  withAuthorisation(authCondition),
  connect(mapStateToProps)
)(AccountPage);