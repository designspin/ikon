import React, { Component, Fragment } from 'react';
import MaterialUIForm, { messageMap, validators } from 'material-ui-form';
import TextField from '@material-ui/core/TextField';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import { PaperWithStyles } from '../../wrappers';

function getSteps() {
  return [
    'About Your Event',
    'Where Is The Event',
    'On Site Details',
    'Risk Assesment and Liabilities'
  ]
}

class ClientEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
      errorSteps: []
    }
  }

  clickNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    })
  }

  clickBack = () => {
    this.setState({
      activeStep: this.state.activeStep -1,
    })
  }

  updateErrorSteps = (field, errorSteps) => {
    this.setState({
      errorSteps
    })
  }

  /*submit = (values, pristineValues ) => {

  }*/

  render() {
    const steps = getSteps();
    const { activeStep, errorSteps } = this.state;

    return (
      <Fragment>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel error={errorSteps.includes(index)}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      <PaperWithStyles elevation="0">
        <MaterialUIForm
          activeStep={activeStep}
          onFieldValidation={this.updateErrorSteps}
          onSubmit={this.submit}
        >
          {activeStep === 0 &&
            <Fragment>
              <TextField
                label="Name"
                name="name"
                value=""
                required
              />
              <Button variant="raised" onClick={this.clickNext}>Next</Button>
            </Fragment>
          }

          {activeStep === 1 &&
            <Fragment>
              <TextField
                label="Address"
                name="address"
                value=""
                required
              />
              <Button variant="raised" onClick={this.clickBack}>Back</Button>
              <Button variant="raised" type="submit">Submit</Button>
            </Fragment>
          }
        </MaterialUIForm>
      </PaperWithStyles>
    </Fragment>
    )
  }
}

export default ClientEvent;