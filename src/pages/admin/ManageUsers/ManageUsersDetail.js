import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

import { staff_groups as db } from '../../../firebase';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  }
});

class ManageUsersDetailRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: []
    }
  }

  componentDidMount() {
    db.getUserGroups()
    .then((collection) => {
      const data = [];

      collection.forEach((doc) => {
        data.push({ id: doc.id, data: doc.data()});
      })

      return data;
    })
    .then((data) => {
      return this.setState({
        groups: data
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  renderList() {
    const { id } = this.props.row;
    const { groups } = this.state;

    return (
      <List> 
      {groups.map(group => 
        <ListItem 
          key={group.id}
          dense
          button
        >
          <Checkbox
            checked={group.data.users.indexOf(id) > -1}
            tabIndex={-1}
            disableRipple
          />
          <ListItemText primary={`${group.id.toUpperCase()}`} />
        </ListItem>
      )}
      </List>
    );
  }

  render() {
    const { row, classes } = this.props;
    const { staff } = row;

    return (
      <Paper 
        elevation={0}
        className={classes.paper}>
        <Typography
          variant="subheading"
          component="h3"
        >Details For { row.name }</Typography>
        { staff && this.renderList() }
      </Paper>
    )
  }
}

export default withStyles(styles)(ManageUsersDetailRow);