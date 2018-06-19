import React, { Component } from 'react';
import SnackBar from '@material-ui/core/Snackbar';

let openSnackBarFn;
let closeSnackBarFn

class CustomisedSnackBars extends Component {
  state = {
    open: false,
  };

  componentDidMount() {
    openSnackBarFn = this.openBar;
    closeSnackBarFn = this.closeBar;
  }

  openBar = () => {
    this.setState({ open: true })
  }

  closeBar = (event, reason) => {
    if( reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  }

  render() {
    return (
      <SnackBar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.open}
        autoHideDuration={6000}
        onClose={this.closeBar}
      >
        {this.props.children}
      </SnackBar>
    )
  }
}

export function openSnackbar() {
  openSnackBarFn();
}

export function closeSnackBar() {
  closeSnackBarFn();
}

export default CustomisedSnackBars;