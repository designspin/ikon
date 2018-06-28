import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Tooltip from '@material-ui/core/Tooltip';
import { auth } from '../../firebase';

import * as routes from '../../constants/routes';

class UserMenu extends Component {
  state = {
    anchorEl: null
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const { displayName } = this.props.user;
    return [
      <Tooltip
        key="user-menu-btn"
        title={displayName}
      >
        <IconButton
          aria-owns={open ? 'user-menu' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit">
          <AccountCircle />
        </IconButton>
      </Tooltip>,
      <Menu
        id="user-menu" 
        key="user-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={this.handleClose}>
        <MenuItem onClick={ auth.doSignOut } divider>Sign Out</MenuItem>
        <MenuItem component={ Link } to={routes.ACCOUNT} button>Account</MenuItem>
      </Menu>
    ]
  }
}

export default UserMenu;