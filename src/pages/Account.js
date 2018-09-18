import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import PasswordChangeForm from '../components/PasswordChange';
import withAuthorisation from '../components/withAuthorisation';

const AccountPage = ({authUser}) => {
  console.log(authUser);
  return (
    <div>
      <Typography
        gutterBottom
        variant="headline" 
        component="h1"
        >Account: { authUser.email }</Typography>
      <PasswordChangeForm />
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
})

const authCondition = (authUser, authRoles) => {
  return authRoles && Object.keys(authRoles).includes('admin');
}

export default compose(
  withAuthorisation(authCondition),
  connect(mapStateToProps),
)(AccountPage);