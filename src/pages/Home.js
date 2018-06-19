import React from 'react';

import withAuthorisation from '../components/withAuthorisation';

const HomePage = () =>
  <div>
    <h1>Home Page</h1>
    <p>This page is accesible to any signed in user.</p>
  </div>

const authCondition = (authUser) => !!authUser;

export default withAuthorisation(authCondition)(HomePage);