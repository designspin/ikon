import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Progress from '@material-ui/core/CircularProgress';

import TextField from '@material-ui/core/TextField';

import { SoloFormWrapper } from '../components/wrappers';
import { withStyles } from '@material-ui/core/styles';
import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { auth } from '../firebase';
import * as routes from '../constants/routes';

const SignInPage = ({ history }) =>
  <div>
    <SoloFormWrapper>
      <SignInForm history={ history } />
    </SoloFormWrapper>
    <SignUpLink />
    <PasswordForgetLink />
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const styles = theme => ({
  wrapper: {
    position: "relative",
    display: "inline-block"
  },
  spinner: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginTop: "-12px",
    marginLeft: "-12px"
  },
  button: {
    marginTop: theme.spacing.unit * 2
  }
});

const INITIAL_STATE = {
  email: '',
  password: '',
  submitting: false
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
      history,
      noticeMessage
    } = this.props

    this.setState({ submitting: true });
      auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        noticeMessage('success', 'Log in success');
        history.push(routes.HOME);
      })
      .catch(error => {
        noticeMessage('error', error.message );
      });

      event.preventDefault();
  }

  render() {
    const {
      email,
      password,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';
    
    const { classes } = this.props;
    
    return (
      <form className={classes.form} onSubmit={this.onSubmit}>
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
          disabled={this.state.submitting}
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
          disabled={this.state.submitting}
          onChange={event => this.setState(byPropKey('password', event.target.value))}
        />
        <div className={classes.wrapper}>
          <Button 
            disabled={isInvalid || this.state.submitting}
            classes={{ root: classes.button }}
            variant="outlined" 
            color="primary" 
            type="submit">Sign In</Button>
          {this.state.submitting && <Progress size={24} className={classes.spinner} />}
        </div>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  noticeMessage: (variant, message) => dispatch({ type: 'NOTICE_MESSAGE_SET', payload: { variant, message } })
});

const SignInForm = compose(
  withStyles(styles, {withTheme: true}),
  connect(null, mapDispatchToProps)
)(Form);

export default withRouter(SignInPage);

export {
  SignInForm,
}