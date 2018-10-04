import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PasswordChangeForm from '../components/PasswordChange';
import { PaperWithStyles } from '../components/wrappers';
import { withAuthorisationRedirect as withAuthorisation } from '../components/withAuthorisation';
import { messaging } from '../firebase';
import ClientProfile from '../components/account/ClientProfile';

class AccountPage extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      displayName: this.props.authUser.displayName,
      email: this.props.authUser.email,
      notifications: false
    }

    this.byPropKey = this.byPropKey.bind(this);
  }

  byPropKey = (propertyName, value) => ({
    [propertyName]: value
  });

  render() {
    return (
      <div>
        <Typography
          gutterBottom
          variant="title"
          component="h1"
          >Your Account</Typography>
        <PaperWithStyles>
          <Typography
            gutterBottom
            variant="headline"
            component="h2">Your Profile Information</Typography>
          <Grid
            container
            spacing={24}>
            <Grid item xs={12} sm={6}>
              <TextField
              fullWidth
              margin="dense"
              label="Fullname"
              name="name"
              placeholder="Enter your user name"
              required
              type="text"
              onChange={event => this.setState(this.byPropKey('displayName', event.target.value ))}
              value={ this.state.displayName } />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
              fullWidth
              margin="dense"
              label="Email"
              name="email"
              placeholder="Enter your email address"
              required
              type="text"
              onChange={ event => this.setState(this.byPropKey('email', event.target.value ))}
              value={ this.state.email } />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.notifications}
                    onClick={(event) => {
                      event.preventDefault();
                      //this.setState(this.byPropKey('notifications', event.target.checked ))
                      messaging.requestMessagingPermission().then((result) => {
                        console.log(result);
                      });
                      
                    }}
                    value="Notifications"
                    color="primary"
                  />
                }
                label="Receive Notifications"
              />
            </Grid>
          </Grid>
        </PaperWithStyles>
        <ClientProfile wrapper={PaperWithStyles} />
        <PaperWithStyles>
          <PasswordChangeForm />
        </PaperWithStyles>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
})

const authCondition = (authUser, authRoles) => {
  return authUser;
}

export default compose(
  withAuthorisation(authCondition),
  connect(mapStateToProps),
)(AccountPage);