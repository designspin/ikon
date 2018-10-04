import React, { Component } from 'react';
import MaterialUIForm from 'material-ui-form';
import TextField from '@material-ui/core/TextField';

class CreateCustomers extends Component {
  render() {
    return(
      <MaterialUIForm>
        <TextField
          label="Business Name"
          type="text"
          name="businessName"
          value=""
          data-validators="isRequired, isAlpha"
        />
      </MaterialUIForm>
    );
  }
}

export default CreateCustomers;