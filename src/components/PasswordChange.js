import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import SnackBar, { openSnackbar, closeSnackBar } from '../components/SnackBar';
import { SnackContentWrapper } from '../components/SnackBar/content';

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
  error: null,
};

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth.doPasswordUpdate(passwordOne)
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
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

    const { classes } = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        <Typography 
          gutterBottom
          variant="headline" 
          component="h1">Password Change</Typography>
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


const PasswordChangeForm = withStyles(styles)(Form);

export default PasswordChangeForm;