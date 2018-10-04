import React, { Component } from 'react';
import MaterialUIForm, { messageMap, validators } from 'material-ui-form';
import { PaperWithStyles } from '../../wrappers';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

validators.isPhone = value => /^(?=.*\d)[\d ]+$/.test(value);
validators.isAdr = value => /^[\w\-\s]+$/.test(value);

const customMessageMap = Object.assign(messageMap, {
  isPhone: 'Enter numbers and spaces only',
  isAdr: 'Please enter an address line'
});

class ClientProfile extends Component {

  render() {
    return (
      <PaperWithStyles>
        <Typography
            gutterBottom
            variant="headline"
            component="h2">Client Profile</Typography>
        <Typography
          gutterBottom
          variant="body1"
          component="p">
          {'Information provided here will be used in relation to any event bookings'}
        </Typography>
        <Divider style={{ marginBottom: "40px"}} />
        <MaterialUIForm
          autoComplete="off"
          validation={{
            messageMap: customMessageMap,
            validators
          }}
        >
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
            <Typography
              gutterBottom
              variant="caption"
              component="p">
              {`We'll use this number to contact you about any events you have booked`}
            </Typography>
            <TextField
              fullWidth
              label="Phone Number"
              placeholder="Phone Number"
              type="text"
              name="phone"
              value=""
              data-validators="isPhone, isRequired"
              margin="dense"
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <Typography
              gutterBottom
              variant="caption"
              component="p">
              {'Your billing address'}
            </Typography>
            <TextField
              fullWidth
              label="Company Name"
              placeholder="Company Name"
              type="text"
              name="companyName"
              value=""
              data-validators="isRequired"
              margin="dense"
            />
            <TextField
              fullWidth
              label="Street Address"
              placeholder="Street Address"
              type="text"
              name="streetAdr"
              value=""
              data-validators="isAdr, isRequired"
              margin="dense"
            />
            <TextField
              fullWidth
              label="Address Line 2"
              placeholder="Address Line 2"
              type="text"
              name="adr1"
              value=""
              data-validators="isAdr"
              margin="dense"
            /> 
            <TextField
              fullWidth
              label="Town / City"
              placeholder="Town / City"
              type="text"
              name="townCity"
              value=""
              data-validators="isAdr, isRequired"
              margin="dense"
            />
            <TextField
              fullWidth
              label="Post Code"
              placeholder="Post Code"
              type="text"
              name="postCode"
              value=""
              data-validators="isAdr, isRequired"
              margin="dense"
            />
            </Grid>
          </Grid>
          <Button
            variant="outlined" 
            color="primary"  
            type="submit">Save</Button>
        </MaterialUIForm>
      </PaperWithStyles>
    )
  }
} 

export default ClientProfile;