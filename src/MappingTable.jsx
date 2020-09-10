import React from 'react';
import { makeStyles, Typography, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  barChart: {
    fill: "white",
    flexGrow: 1,
  },
  flexContainer: {
    display: "flex",
    flexFlow: "row wrap",
    margin: theme.spacing(1),
  },
  letterPair: {
    width: 50,
    textAlign: "center",
    margin: theme.spacing(1),
  },
  mappingInput: {
    textAlign: "center",
  }
}));

const MappingTable = ({
  alphabet,
  mapping,
  setMapping
}) => {

  const classes = useStyles();

  const handleMappingChange = (e, letter) => {
    let targetVal = e.target.value;
    targetVal = targetVal ? targetVal[targetVal.length - 1].toUpperCase() : ''
    setMapping({...mapping, [letter]: targetVal});
  }

  return (
    <div className={classes.flexContainer}>
      {alphabet.map((letter, index) => 
        <div className={classes.letterPair} key={index}>
          <Typography variant="body1">{letter}</Typography>
          <TextField 
            inputProps={{ style: {
              textAlign: 'center'
            }}}
            className={classes.mappingInput}
            size="small"
            variant="outlined"
            value={mapping[letter]} 
            onChange={(e) => handleMappingChange(e, letter)} />
        </div>
      )}
    </div>
  );
}

export default MappingTable;