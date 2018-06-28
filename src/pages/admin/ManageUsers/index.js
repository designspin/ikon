import React from 'react';
import DynamicComponent from '../../../utilities/dynamicImport';
import withAuthorisation from '../../../components/withAuthorisation';

const ManageUsers = props => (
  <DynamicComponent
    load={() => import(/* webpackChunkName: "manage_users" */'./component')}
>
  {Component => (Component === null ? <p>Loading...</p> : <Component {...props} />)}
  </DynamicComponent>
);

const authCondition = (authUser, authRoles) => {
  return !!authUser && !!authRoles && authRoles.admin;
}

export default withAuthorisation(authCondition)(ManageUsers);