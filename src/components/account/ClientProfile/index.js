import React from 'react';
import DynamicComponent from '../../../utilities/dynamicImport';
import withAuthorisation from '../../../components/withAuthorisation';

const ClientProfile = props => (
  <DynamicComponent
    load={() => import(/* webpackChunkName: "client_profile" */'./client-profile.js')}
>
  {Component => (Component === null ? <p>Loading...</p> : <Component {...props} />)}
  </DynamicComponent>
);

const authCondition = (authUser, authRoles) => {
  return !!authUser && !!authRoles && authRoles.client;
}

export default withAuthorisation(authCondition)(ClientProfile);