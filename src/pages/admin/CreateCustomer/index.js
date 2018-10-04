import React from 'react';
import DynamicComponent from '../../../utilities/dynamicImport';
import withAuthorisation from '../../../components/withAuthorisation';

const CreateCustomers = props => (
  <DynamicComponent
    load={() => import(/* webpackChunkName: "create_customers" */'./component')}
>
  {Component => (Component === null ? <p>Loading...</p> : <Component {...props} />)}
  </DynamicComponent>
);

const authCondition = (authUser, authRoles) => {
  return !!authUser && !!authRoles && authRoles.admin;
}

export default withAuthorisation(authCondition)(CreateCustomers);