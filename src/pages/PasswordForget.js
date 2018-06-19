import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import SnackBar, { openSnackbar, closeSnackBar } from '../components/SnackBar';
import { SnackContentWrapper } from '../components/SnackBar/content';

import * as routes from '../constants/routes';

import { auth } from '../firebase';

const PasswordForgetPage = () =>
  <PasswordForgetForm />

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2
  },
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
      <Grid 
        container
        direction="column"
        alignItems="center"
        justify="center"
        spacing={32}
      >
        <Grid item xs={12} sm={9} md={6}>
          <form onSubmit={this.onSubmit}>
            <Paper
              className={classes.paper}
            >
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
            </Paper>
          </form>
        </Grid>
      </Grid>
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



