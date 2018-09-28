import React from 'react';
import { compose } from 'recompose';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import withMaterial from '../withMaterial';
import Drawer from './ResponsiveDrawer';

import LandingPage from '../pages/Landing';
import SignUpPage from '../pages/SignUp';
import SignInPage from '../pages/SignIn';
import PasswordForgetPage from '../pages/PasswordForget';
import HomePage from '../pages/Home';
import AccountPage from '../pages/Account';

import ManageUsers from '../pages/admin/ManageUsers';
import StaffGroups from '../pages/admin/StaffGroups';

import * as routes from '../constants/routes';

import withAuthentication from './withAuthentication';

const App = () => 
  <Router>
    <Drawer>
      <Route
        exact path={routes.LANDING}
        component={() => <LandingPage />}
      />
      <Route
        exact path={routes.SIGN_UP}
        component={() => <SignUpPage />}
      />
      <Route
        exact path={routes.SIGN_IN}
        component={() => <SignInPage />}
      />
      <Route
        exact path={routes.PASSWORD_FORGET}
        component={() => <PasswordForgetPage />}
      />
      <Route
        exact path={routes.HOME}
        component={() => <HomePage />}
      />
      <Route
        exact path={routes.ACCOUNT}
        component={() => <AccountPage />}
      />
      <Route
        exact path={routes.MANAGE_USERS}
        component={() => <ManageUsers />}
      />
      <Route 
        exact path={routes.STAFF_GROUPS}
        component={() => <StaffGroups />}
      />
    </Drawer>
  </Router>

export default compose(
  withMaterial,
  withAuthentication
)(App);
