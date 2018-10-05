import React from 'react';
import DynamicComponent from '../../../utilities/dynamicImport';
import withAuthorisation from '../../../components/withAuthorisation';

export const ClientEventApplication = props => (
  <DynamicComponent
    load={() => import(/* webpackChunkName: "client_event_application" */'./client-event-application.js')}
>
  {Component => (Component === null ? <p>Loading...</p> : <Component {...props} />)}
  </DynamicComponent>
);

const authCondition = (authUser, authRoles) => {
  return !!authUser && !!authRoles && authRoles.client;
}

export default withAuthorisation(authCondition)(ClientEventApplication);