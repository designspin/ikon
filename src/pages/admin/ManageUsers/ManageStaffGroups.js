import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import { staff_groups as db } from '../../../firebase';

class ManageStaffGroups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: {}
    }

    this.updateUserGroups = this.updateUserGroups.bind(this);
    this.subscribeUserGroups = db.subscribeUserGroups(this.updateUserGroups);
  }

  componentDidMount() {
    this.getUserGroups();
  }

  componentWillUnmount() {
    this.subscribeUserGroups();
  }

  getUserGroups() {
    db.getUserGroups()
    .then((collection) => {
      const data = {};

      collection.forEach((doc) => {
        data[doc.id] = { updating: false, member: doc.data().hasOwnProperty(this.props.id)}
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

  updateUserGroups(snapshot) {
    snapshot.docChanges().forEach((change) => {
      if(change.type === "modified") {
        const { id: groupId } = change.doc;
        const isMember = change.doc.data().hasOwnProperty(this.props.id);

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
    db.addUserToGroup(id, groupId, this.props.name);
  } else {
    db.removeUserFromGroup(id, groupId, this.props.name);
  }
}
 
  render() {
    const { id } = this.props;
    const { groups } = this.state;
    
    return (
        <List>
          <ListSubheader>Staff Groups</ListSubheader>
          { 
            (Object.keys(groups).length)
            ?
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
            :
            <ListItem><CircularProgress /></ListItem>
          }
        </List>
    );
  }
} 

export default ManageStaffGroups;