import React from 'react';

import AuthUserContext from '../components/AuthUserContext';
import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from '../components/PasswordChange';
import withAuthorisation from '../components/withAuthorisation';

const AccountPage = () =>
  <AuthUserContext.Consumer>
    {authUser =>
      <div>
        <h1>Account: {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser;

export default withAuthorisation(authCondition)(AccountPage);