import React from 'react';
import Typography from '@material-ui/core/Typography';
import withAuthorisation from '../components/withAuthorisation';

const HomePage = () =>
  <div>
    <Typography
      gutterBottom
      variant="headline" 
      component="h1"
      >Home Page</Typography>
    <Typography>This page is accesible to any signed in user.</Typography>
  </div>

const authCondition = (authRoles) => true;

export default withAuthorisation(authCondition)(HomePage);