import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { SoloFormWrapper } from '../components/wrappers';

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
};

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = (event) => {
    const { email } = this.state;
    const { noticeMessage } = this.props;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        noticeMessage('success', 'Check your email for reset instructions');
      })
      .catch(error => {
        noticeMessage('error', error.message );
      })

      event.preventDefault();
  }

  render() {
    const {
      email,
    } = this.state;

    const isInvalid = email === '';

    const { classes } = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        <Typography 
          gutterBottom
          variant="headline"
          align="center"
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
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  noticeMessage: (variant, message) => dispatch({ type: 'NOTICE_MESSAGE_SET', payload: { variant, message } })
});

const PasswordForgetForm = compose(
  withStyles(styles),
  connect(null, mapDispatchToProps)
)(Form);

const PasswordForgetLink = () => 
  <Typography
    gutterBottom
    paragraph
    align="center"
    component="p"
  >
    <Link to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
  </Typography>

export default PasswordForgetPage;

export {
  PasswordForgetForm,
  PasswordForgetLink
}



