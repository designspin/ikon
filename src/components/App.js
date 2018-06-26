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

import DynamicComponent from '../utilities/dynamicImport';

import * as routes from '../constants/routes';

import withAuthentication from './withAuthentication';

const ManageUsers = props => (
  <DynamicComponent
    load={() => import(/* webpackChunkName: "manage_users" */'../pages/admin/ManageUsers')}
  >
  {Component => (Component === null ? <p>Loading...</p> : <Component {...props} />)}
  </DynamicComponent>
);

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
    </Drawer>
  </Router>

export default compose(
  withMaterial,
  withAuthentication
)(App);
