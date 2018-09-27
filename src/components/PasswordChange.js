import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { auth } from '../firebase';


const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 2
  }
});

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
};

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    const { noticeMessage } = this.props;

    auth.doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        noticeMessage('success', 'Your password has been changed.')
      })
      .catch(error => {
        noticeMessage('error', error.message);
      })

      event.preventDefault();
  }

  render() {
    const {
      passwordOne,
      passwordTwo,
    } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

    const { classes } = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        <Typography 
          gutterBottom
          variant="headline" 
          component="h2">Password Change</Typography>
        <TextField
          fullWidth
          required
          margin="dense"
          label="New Password"
          placeholder="New Password"
          type="password"
          value={passwordOne}
          onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
        />
        <TextField
          fullWidth
          required
          margin="dense"
          label="Confirm New Password"
          placeholder="Confirm New Password"
          type="password"
          value={passwordTwo}
          onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
        />
        <Button 
          disabled={isInvalid}
          classes={{ root: classes.button }}
          variant="outlined" 
          color="primary" 
          type="submit">Change Password</Button>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  noticeMessage: (variant, message) => dispatch({ type: 'NOTICE_MESSAGE_SET', payload:{ variant, message }})
});

export default compose(
  withStyles(styles),
  connect(null,mapDispatchToProps)
)(Form);