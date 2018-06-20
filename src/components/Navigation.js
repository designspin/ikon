import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import * as routes from '../constants/routes';

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
})

const Navigation = (props) => {
  const { classes } = props;
  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List component="nav">
        <ListItem component={Link} to={routes.LANDING} button><ListItemText>Home</ListItemText></ListItem>
      </List>
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(Navigation);