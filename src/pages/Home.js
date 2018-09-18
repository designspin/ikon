import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withAuthorisationRedirect } from '../components/withAuthorisation';

const HomePage = (props) =>
  <div>
    <Typography
      gutterBottom
      variant="headline" 
      component="h1"
      >{`Home Page`}</Typography>
    <Typography>This page is accesible to any signed in user.</Typography>
  </div>

const authCondition = (authUser) => { 
  return authUser;
}

export default withAuthorisationRedirect(authCondition)(HomePage);