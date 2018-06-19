import React from 'react';
import Button from '@material-ui/core/Button';
import { auth } from '../firebase';

const SignOutButton = () =>
  <Button
    color="light"
    type="button"
    onClick={ auth.doSignOut }
  >Sign Out</Button>

export default SignOutButton;