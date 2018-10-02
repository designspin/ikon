import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import FaceIcon from '@material-ui/icons/Face';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { staff_groups as db } from '../../../firebase';

const styles = theme => ({
  flex: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  }
});

class StaffGroups extends Component {

  constructor(props) {
    super();

    this.state = {
      groupInputValue: '',
      groupInputError: ' ',
      groupTouched: false,
      groups: [],
    }

    this.onChangeGroup = this.onChangeGroup.bind(this);
    this.onFocusGroup = this.onFocusGroup.bind(this);
    this.onAddGroup = this.onAddGroup.bind(this);
    this.onExpansionChange = this.onExpansionChange.bind(this);
    this.updateUserGroups = this.updateUserGroups.bind(this);
  }

  componentDidMount() {
    this.getUserGroups();
    this.subscribeUserGroups();
  }

  getUserGroups() {
    db.getUserGroups()
    .then((collection) => {
      const data = {};

      collection.forEach((doc) => {
        data[doc.id] = doc.data();
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
    const data = {};
    snapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    })
    this.setState({
      groups: data
    }) 
  }

  onFocusGroup() {
    this.setState({groupTouched: true})
  }

  onChangeGroup(e) {
    const validation = /^[\w ]+$/;

    if(!e.target.value.length || e.target.value.length < 4) {
      this.setState({ groupInputError: 'To add a staff group field needs a value 4 characters minimum', groupInputValue: `${e.target.value}` });
    } else if (!validation.test(e.target.value)) {
      this.setState({ groupInputError: 'Group name contains invalid characters', groupInputValue: `${e.target.value}` });
    } else {
      this.setState({ groupInputError: '', groupInputValue: `${e.target.value}` });
    }
  }

  onAddGroup() {
    let { groupInputValue: name } = this.state;
    name = name.toLowerCase();

    db.createUserGroups(name)
    .then(() => {
      this.setState({
        groupInputValue: '',
        groupInputError: ' ',
        groupTouched: false,
        expanded: null
      });
    })
    .catch((error) => {
      console.log(error);
    })
  }

  onExpansionChange = id => (event, expanded) => {
    this.setState({
      expanded: expanded ? id : false,
    })
  }

  renderGroups() {
    const { classes } = this.props;
    const { expanded, groups } = this.state;

    return (
    <React.Fragment>
     {
       Object.keys(groups).map((id) => 
          <ExpansionPanel key={id}
            expanded={expanded === id}
            onChange={this.onExpansionChange(id)}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{ id.toUpperCase() }</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.flex}>
              {
                (Object.keys(groups[id]).length)
                ?
                Object.keys(groups[id]).map(userId => 
                    <Chip
                      avatar={
                        <Avatar>
                          <FaceIcon/>
                        </Avatar>
                      }
                      label={groups[id][userId]}
                      key={userId}
                      className={classes.chip}
                    />
                )
                :
                <Typography>No staff members assigned to this group.</Typography>
              }
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
    }
    </React.Fragment>
    )
  }
  
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
      <Typography
          gutterBottom
          variant="title"
          component="h1"
          >Staff Groups</Typography>
      <Paper
        elevation={1} 
        className={classes.paper}
      >
        <Grid 
          container 
          justify="center"
          spacing={24}
        >
          <Grid item xs zeroMinWidth>
            <TextField 
              id="group-input"
              label="Group Name"
              margin="normal"
              helperText={this.state.groupInputError}
              value={this.state.groupInputValue}
              error={this.state.groupInputError.length > 1}
              onChange={this.onChangeGroup}
              onFocus={this.onFocusGroup}
              fullWidth
            />
          </Grid>
          <Grid item>
            <Button 
              disabled={this.state.groupInputError.length > 0 || !this.state.groupTouched}
              onClick={this.onAddGroup}
              className={classes.button}
              variant="fab" 
              color="primary" 
              aria-label="Add"
            >
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
        {this.renderGroups()}
      </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(StaffGroups);