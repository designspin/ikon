import React, { Component, Fragment } from 'react';
import MaterialUIForm, { messageMap, validators } from 'material-ui-form';
import { PaperWithStyles } from '../../wrappers';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { client_profile as db, auth } from '../../../firebase';

validators.isPhone = value => /^(?=.*\d)[\d ]+$/.test(value);
validators.isAdr = value => /^[\w\-\s]+$/.test(value);

const customMessageMap = Object.assign(messageMap, {
  isPhone: 'Enter numbers and spaces only',
  isAdr: 'Please enter an address line'
});

class ClientProfile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      phone: '',
      companyName: '',
      streetAdr: '',
      adr2: '',
      townCity: '',
      postCode: ''
    }

    this.form = React.createRef();
  }

  updateFormState() {
    this.form.current.setState((state) => {

      const fieldsArray = Object.keys(state.fields).map((prop) => {
        return {
          [prop]: {
            ...state.fields[prop],
            value: this.state[prop]
          }
        }
      });

      const fields = fieldsArray.reduce((obj, item) => {
        const key = Object.keys(item)[0];
        obj[key] = item[key];
        return obj;
      }, {});
      
      return {
        fields 
      }
    });
  }

  componentDidMount() {
    const id = (this.props.id) ? this.props.id : auth.getUID();

    this.setState({
      loading: true
    });
  
    db.getClientProfile(id)
      .then((doc) => {
        if(doc.exists) {
          this.setState({
            loading: false,
            ...doc.data()
          }, () => {
           this.updateFormState();
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  submitProfile = (values, pristineValues) => {
    const id = (this.props.id) ? this.props.id : auth.getUID();

    this.setState({
      loading: true,
      ...values
    });

    db.saveClientProfile(id, values)
      .then(() => {
        this.setState({
          loading: false
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderWrapper() {
    const { readonly } = this.props;

    return (readonly)
    ?
    (
      <Fragment>
        {this.renderForm()}
      </Fragment>
    )
    :
    (
      <PaperWithStyles>
        {this.renderForm()}
      </PaperWithStyles>
    );
  }

  renderForm() {
    const { readonly } = this.props;
    const { phone, companyName, streetAdr, adr2, townCity, postCode, loading } = this.state;

    return (
      <Fragment>
        <Typography
            gutterBottom
            variant="headline"
            component="h2">Client Profile</Typography>
        { !readonly &&
          <Typography
            gutterBottom
            variant="body1"
            component="p">
            {'Information provided here will be used in relation to any event bookings'}
          </Typography>
        }
        <Divider style={{ marginBottom: "40px"}} />
        <MaterialUIForm
          ref={this.form}
          autoComplete="off"
          validation={{
            messageMap: customMessageMap,
            validators
          }}
          onSubmit={this.submitProfile}
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
              value={phone}
              data-validators="isPhone, isRequired"
              margin="dense"
              disabled={(readonly) ? true : loading}
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
              value={companyName}
              data-validators="isRequired"
              margin="dense"
              disabled={(readonly) ? true : loading}
            />
            <TextField
              fullWidth
              label="Street Address"
              placeholder="Street Address"
              type="text"
              name="streetAdr"
              value={streetAdr}
              data-validators="isAdr, isRequired"
              margin="dense"
              disabled={(readonly) ? true : loading}
            />
            <TextField
              fullWidth
              label="Address Line 2"
              placeholder="Address Line 2"
              type="text"
              name="adr2"
              value={adr2}
              data-validators="isAdr"
              margin="dense"
              disabled={(readonly) ? true : loading}
            /> 
            <TextField
              fullWidth
              label="Town / City"
              placeholder="Town / City"
              type="text"
              name="townCity"
              value={townCity}
              data-validators="isAdr, isRequired"
              margin="dense"
              disabled={(readonly) ? true : loading}
            />
            <TextField
              fullWidth
              label="Post Code"
              placeholder="Post Code"
              type="text"
              name="postCode"
              value={postCode}
              data-validators="isAdr, isRequired"
              margin="dense"
              disabled={(readonly) ? true : loading}
            />
            </Grid>
          </Grid>
          {!readonly &&
            <Button
              variant="outlined" 
              color="primary"  
              type="submit">Save</Button>
          }
        </MaterialUIForm>
      </Fragment>
    )
  }

  render() {
    return this.renderWrapper();
  }
} 

export default ClientProfile;