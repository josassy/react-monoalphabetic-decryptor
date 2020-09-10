import React from 'react';
import { Typography, Link, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  header: {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(1, 0),
  },
  link: {
      color: theme.palette.text.primary,
  }
}));

const Header = () => {
  const classes = useStyles();
  return ( 
    <header className={classes.header}>
      <Typography variant="h1">React Monoalphabetic Decryptor</Typography>
      <Typography variant="caption">(c) 2020 Josiah R Lansford </Typography>
      <Link variant="caption" className={classes.link} href="https://josiahlansford.com">(josiahlansford.com)</Link>
      <Typography variant="caption">, Nishant Nedungadi</Typography>
    </header>
  )
}

export default Header;