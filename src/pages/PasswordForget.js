import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { SoloFormWrapper } from '../components/wrappers';
import SnackBar, { openSnackbar, closeSnackBar } from '../components/SnackBar';
import { SnackContentWrapper } from '../components/SnackBar/content';

import * as routes from '../constants/routes';

import { auth } from '../firebase';

const PasswordForgetPage = () =>
  <SoloFormWrapper>
    <PasswordForgetForm />
  </SoloFormWrapper>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 2
  }
});

const INITIAL_STATE = {
  email: '',
  error: null,
};

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
        openSnackbar();
      })

      event.preventDefault();
  }

  render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === '';

    const { classes } = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        <Typography 
          gutterBottom
          variant="headline" 
          component="h1">Password Reset</Typography>
        <TextField
          fullWidth
          required
          margin="dense"
          label="Email"
          placeholder="Email"
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
        />
        <Button 
          disabled={isInvalid}
          classes={{ root: classes.button }}
          variant="outlined" 
          color="primary" 
          type="submit">Reset Password</Button>

        <SnackBar>
          { error && 
            <SnackContentWrapper
              message={error.message}
              variant="error"
              onClose={closeSnackBar}
            /> }
        </SnackBar>
      </form>
    );
  }
}

const PasswordForgetLink = () => 
  <Typography
    gutterBottom
    paragraph
    align="center"
    component="p"
  >
    <Link to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
  </Typography>

const PasswordForgetForm = withStyles(styles)(Form);

export default PasswordForgetPage;

export {
  PasswordForgetForm,
  PasswordForgetLink
}



