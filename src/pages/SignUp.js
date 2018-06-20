import React, { Component } from 'react';
import { 
  Link,
  withRouter,
 } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { SoloFormWrapper } from '../components/wrappers';
import { withStyles } from '@material-ui/core/styles';
import SnackBar, { openSnackbar, closeSnackBar } from '../components/SnackBar';
import { SnackContentWrapper } from '../components/SnackBar/content';

import * as routes from '../constants/routes';

import { auth } from '../firebase';

const SignUpPage = ({ history }) =>
   <SoloFormWrapper>
    <SignUpForm history={history} />
  </SoloFormWrapper>

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
}

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 2
  }
});

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState(() => ({ ...INITIAL_STATE}));
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
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';
    
    const { classes } = this.props;

    return (
        <form onSubmit={this.onSubmit}>
      
        <Typography 
          gutterBottom
          variant="headline" 
          component="h1">Sign Up For An Account</Typography>
        <TextField
          fullWidth
          required
          margin="dense"
          label="Username"
          placeholder="Username"
          value={username}
          onChange={event => this.setState(byPropKey('username', event.target.value))}
        />
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
          value={passwordOne}
          onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
        />
        <TextField
          fullWidth
          required
          margin="dense"
          label="Confirm Password"
          placeholder="Confirm Password"
          type="password"
          value={passwordTwo}
          onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
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
        </form>
    );
  }
}

const SignUpLink = () => 
  <Typography
    gutterBottom
    paragraph
    align="center"
    component="p"
  >
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </Typography>

const SignUpForm = withStyles(styles, {withTheme: true})(Form);

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink
}