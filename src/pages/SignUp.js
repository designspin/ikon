import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { 
  Link,
  withRouter,
 } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { SoloFormWrapper } from '../components/wrappers';
import { withStyles } from '@material-ui/core/styles';

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
      noticeMessage
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState(() => ({ ...INITIAL_STATE}));
        noticeMessage('success', 'Your account was created successfully, our admins will check you application and grant relevant access.')
        history.push(routes.HOME);
      })
      .catch(error => {
        noticeMessage('error', error.message);
      });
      event.preventDefault();
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
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
          align="center"
          variant="headline" 
          component="h1">Request An Account</Typography>
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
        </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  noticeMessage: (variant, message) => dispatch({ type: 'NOTICE_MESSAGE_SET', payload: { variant, message } })
});

const SignUpForm = compose(
  withStyles(styles, {withTheme: true}),
  connect(null, mapDispatchToProps)
)(Form);

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

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink
}