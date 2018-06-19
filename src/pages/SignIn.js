import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SnackBar, { openSnackbar, closeSnackBar } from '../components/SnackBar';
import { SnackContentWrapper } from '../components/SnackBar/content';
import { withStyles } from '@material-ui/core/styles';
import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { auth } from '../firebase';
import * as routes from '../constants/routes';

const SignInPage = ({ history }) =>
  <div>
    <SignInForm history={ history } />
    <SignUpLink />
    <PasswordForgetLink />
  </div>

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
  password: '',
  error: null,
}

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = (event) => {
    const {
      email,
      password
    } = this.state;

    const {
      history
    } = this.props

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
        openSnackbar();
      });

      event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';
    
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
                align="center"
                variant="headline" 
                component="h1">Sign In</Typography>
              <TextField
                fullWidth
                required
                margin="dense"
                label="Email"
                placeholder="Email"
                value={email}
                onChange={event => this.setState(byPropKey('email', event.target.value))}
              />
              <TextField
                fullWidth
                required
                margin="dense"
                label="Password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={event => this.setState(byPropKey('password', event.target.value))}
              />
              <Button 
                disabled={isInvalid}
                classes={{ root: classes.button }}
                variant="outlined" 
                color="primary" 
                type="submit">Sign In</Button>
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

const SignInForm = withStyles(styles, {withTheme: true})(Form);

export default withRouter(SignInPage);
export {
  SignInForm,
}