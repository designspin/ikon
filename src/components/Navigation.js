import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import withAuthorisation from './withAuthorisation';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import * as routes from '../constants/routes';

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
})

const AdminItems = (props) =>
    <List 
      component="nav"
      subheader={<ListSubheader component="div">Admin</ListSubheader>}
    >
      <ListItem component={Link} to={routes.MANAGE_USERS} button><ListItemText>Manage Users</ListItemText></ListItem>
      <ListItem component={Link} to={routes.STAFF_GROUPS} button><ListItemText>Staff Groups</ListItemText></ListItem>
    </List>

const authCondition = (authUser, authRoles) => {
  return authUser && authRoles && authRoles.admin;
}

const AuthorisedAdminItems = withAuthorisation(authCondition)(AdminItems);

const ClientItems = (props) => 
  <List
    component="nav"
    subheader={<ListSubheader component="div">Client</ListSubheader>}
  >
    <ListItem component={Link} to={routes.CLIENT_EVENT_APPLICATION} button><ListItemText>Book An Event</ListItemText></ListItem>
  </List>

const clientAuthCondition = (authUser, authRoles) => {
  return authUser && authRoles && authRoles.client;
}

const AuthorisedClientItems = withAuthorisation(clientAuthCondition)(ClientItems);

const Navigation = (props) => {
  const { classes } = props;
  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List component="nav">
        <ListItem component={Link} to={routes.LANDING} button><ListItemText>Home</ListItemText></ListItem>
      </List>
      <AuthorisedAdminItems />
      <AuthorisedClientItems />
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(Navigation);