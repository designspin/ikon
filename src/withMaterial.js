import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import deepOrange from '@material-ui/core/colors/deepOrange';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: blueGrey[300],
            main: blueGrey[500],
            dark: blueGrey[700],
        },
        secondary: {
            light: deepOrange[300],
            main: deepOrange[500],
            dark: deepOrange[700],
        },
    },
});

function withMaterial(Component) {
    function WithMaterial(props) {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...props} />
            </MuiThemeProvider>
        );
    }

    return WithMaterial;
}

export default withMaterial;