import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
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
      groups: {}
    }

    this.updateUserGroups = this.updateUserGroups.bind(this);
  }

  componentDidMount() {
    this.getUserGroups();
    this.subscribeUserGroups();
  }

  componentWillUnmount() {
    db.unsubscribeUserGroups();
  }

  getUserGroups() {
    db.getUserGroups()
    .then((collection) => {
      const data = {};

      collection.forEach((doc) => {
        data[doc.id] = { updating: false, member: doc.data().hasOwnProperty(this.props.row.id)}
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

  subscribeUserGroups() {
    db.subscribeUserGroups(this.updateUserGroups)
  }

  updateUserGroups(snapshot) {
    snapshot.docChanges().forEach((change) => {
      if(change.type === "modified") {
        const { id: groupId } = change.doc;
        const isMember = change.doc.data().hasOwnProperty(this.props.row.id);

        this.setState(prevState => ({
          groups: {
            ...prevState.groups,
            [groupId]: {
              ...prevState.groups[groupId],
              updating: false,
              member: isMember
            }
          }
        }))

      }
    })
  }

  /*
    @param id ( String )= userId
    @param groupId ( String ) = groupId
    @param isMember ( Bool ) = member of group
  */
  toggleGroup(id, groupId, isMember) {
    
    this.setState(prevState => ({
      groups: {
        ...prevState.groups,
        [groupId]: {
        ...prevState.groups[groupId],
        updating: true
        }      
      }  
    }));

    if(!isMember) {
      db.addUserToGroup(id, groupId, this.props.row.name);
    } else {
      db.removeUserFromGroup(id, groupId, this.props.row.name);
    }
  }

  renderList() {
    const { id } = this.props.row;
    const { groups } = this.state;

    return (
        <List>
          <ListSubheader>Staff Groups</ListSubheader>
          {
            Object.keys(groups).map((groupId) => {
              const isMember = groups[groupId].member;
              const isUpdating = groups[groupId].updating;

              return (
                <ListItem
                  key={groupId}
                  button
                  onClick={this.toggleGroup.bind(this, id, groupId, isMember)}
                  disabled={isUpdating}
                >
                  <Checkbox 
                    checked={isMember}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText>{groupId.toUpperCase()}</ListItemText>
                </ListItem>
              )
            })
          }
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
        >{ row.name } - ( {Object.keys(row).filter((key) => row[key] === true ).toString() || 'unassigned'} ) </Typography>
        { staff && this.renderList() }
      </Paper>
    )
  }
}

export default withStyles(styles)(ManageUsersDetailRow);