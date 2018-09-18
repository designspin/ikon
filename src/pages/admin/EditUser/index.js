import React from 'react';
import DynamicComponent from '../../../utilities/dynamicImport';
import { withAuthorisationRedirect as withAuthorisation } from '../../../components/withAuthorisation';

const EditUser = props => (
  <DynamicComponent
    load={() => import(/* webpackChunkName: "edit_user" */'./component')}
>
  {Component => (Component === null ? <p>Loading...</p> : <Component {...props} />)}
  </DynamicComponent>
);

const authCondition = (authUser, authRoles) => {
  return !!authUser && !!authRoles && authRoles.admin;
}

export default withAuthorisation(authCondition)(EditUser);