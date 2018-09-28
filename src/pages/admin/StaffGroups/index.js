import React from 'react';
import DynamicComponent from '../../../utilities/dynamicImport';
import withAuthorisation from '../../../components/withAuthorisation';

const StaffGroups = props => (
  <DynamicComponent
    load={() => import(/* webpackChunkName: "staff_groups" */'./component')}
>
  {Component => (Component === null ? <p>Loading...</p> : <Component {...props} />)}
  </DynamicComponent>
);

const authCondition = (authUser, authRoles) => {
  return !!authUser && !!authRoles && authRoles.admin;
}

export default withAuthorisation(authCondition)(StaffGroups);