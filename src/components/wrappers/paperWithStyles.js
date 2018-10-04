import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const paperStyles = theme => ({
  paper: {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2
  },
})

const StyledPaper = ({ children, classes }) =>
  <Paper className={classes.paper}>{ children }</Paper>

const PaperWithStyles = withStyles(paperStyles, {withTheme: true})(StyledPaper);

export default PaperWithStyles;