import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2
  },
})

const FormWrap = ({ children, classes }) =>
  <Grid 
    container
    direction="column"
    alignItems="center"
    justify="center"
    spacing={32}
  >
    <Grid item xs={12} sm={9} md={6}>
      <Paper
          className={classes.paper}
        >
        { children }
      </Paper>
    </Grid>
  </Grid>

export default withStyles(styles, {withTheme: true})(FormWrap);
      