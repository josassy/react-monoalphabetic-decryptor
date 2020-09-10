import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createMuiTheme, ThemeProvider, CssBaseline } from '@material-ui/core';


const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    
  },
  typography: {
    fontFamily: [
      'Open Sans, sans-serif'
    ],
    h1: {
      fontSize: "3rem",
    },
    h2: {
      fontSize: "2rem",
      padding: ".5rem",
    },
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
