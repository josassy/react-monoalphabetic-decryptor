import React, { useState, useEffect } from 'react';
import { makeStyles, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: {
    padding: theme.spacing(1),
    minWidth: 400,
    flexGrow: 1,
  },
  input: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
}))

const CipherInput = ({prompt, callback}) => {

  const classes = useStyles();

  // hold state of input
  const [userInput, setUserInput] = useState('');
  
  // update parent whenever input changes
  useEffect(() => {
    // Use input debounce to avoid costly calculation on each keypress
    const timer = setTimeout(() => callback(userInput), 200);
    return () => clearTimeout(timer);
  }, [userInput, callback]);

  return (
    <div className={classes.formControl}>
      <Typography variant="body1">{prompt}</Typography>
      <TextField 
        className={classes.input}
        variant="filled"
        multiline
        rowsMax={16}
        rows={8}
        value={userInput} 
        onChange={e => setUserInput(e.target.value)}
      />
      <Typography variant="caption">
        {`Letters: ${[...userInput].reduce(((count, char) =>
        // use reducer function to count letters in the input
        count + (/[a-zA-Z]/.test(char) ? 1 : 0)),
        // pass intial count of 0 to reduce call
        0)
        }`}
      </Typography>
    </div>
  )
}

export default CipherInput;