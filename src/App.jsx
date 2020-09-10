import React, { useState } from 'react';
import BarChart from 'react-bar-chart';
import CipherInput from './CipherInput';
import MappingTable from './MappingTable';
import Header from './Header';
import { makeStyles, Container, Button, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  barChart: {
    fill: "white",
    flexGrow: 1,
  },
  flexContainer: {
    display: "flex",
    flexFlow: "row wrap",
  },
  decodedCipher: {
    overflowWrap: 'break-word',
    marginBottom: theme.spacing(2)
  }
}));

// THE ALPHABET
const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

const App = () => {

  // Define styling classes
  const classes = useStyles();

  // dict of mapping from cipher to plaintext
  const [mapping, setMapping] = useState(() => {
    const result = {};
    alphabet.forEach(letter => result[letter] = letter);
    return result;
  });

  const [cipher, setCipher] = useState('');
  const [decodedCipher, setDecodedCipher] = useState('');

  // letter-indexed array of alphabet frequencies
  const [calibrationStats, setCalibrationStats] = useState(alphabet.map(letter => {
    return {
      'text': letter,
      'value': 0
    }
  }));
  const [cipherStats, setCipherStats] = useState(alphabet.map((letter, i) => {
    return {
      'text': letter,
      'value': 0
    }
  }));

  // calculate letter stats whenever calibration input changes
  const handleCalibrationInput = str => {
    setCalibrationStats(calculateLetterFrequencies(str));
  }

  // calculate letter stats whenever cipher input changes
  const handleCipherInput = str => {
    setCipher(str);
    setCipherStats(calculateLetterFrequencies(str));
    setDecodedCipher(decodeCipher(str, mapping));
  }

  // calculate straight letter mapping whenever either stats change
  const setStraightLetterMapping = () => {
    setMapping(calculateStraightLetterMapping(calibrationStats, cipherStats));
    setDecodedCipher(decodeCipher(cipher, mapping));
  }

  // calculate cipher text based on provided mapping
  const decodeCipher = (str, mapping) => {
    if (str && mapping) {
      // if cipher text is a letter, map back to plaintext
      const result = [...str.toUpperCase()].map(c => {
        if (/[a-zA-Z]/.test(c)) {
          return mapping[c] ? mapping[c] : '_';
        }
        else {
          return c
        }
      }).join('');
      return result;
    }
    else return '';
  }

  /**
   * sort the object stats list in descending order
   * @param {Array} statsList the object list to sort
   */
  const sortStatsDesc = statsList => {
    return statsList.sort((x, y) => y.value - x.value);
  }

  /**
   * calculate the straight letter mapping of the two pre-sorted stats
   * @param {Array} plainStats list of plain text stats
   * @param {Array} cipherStats list of cipher text stats
   * @returns {Object} dictionary mapping a cipher letter to corresponding plaintext letter
   */
  const calculateStraightLetterMapping = (plainStats, cipherStats) => {
    const result = {};
    // only calculate letter mapping if there is data in both fields
    if (plainStats[0].value && cipherStats[0].value) {
      for (let i = 0; i < 26; i++) {
        result[cipherStats[i].text] = plainStats[i].text;
      }
    }
    // if field is empty, use default mapping
    else {
      alphabet.forEach(letter => {
        result[letter] = letter;
      });
    }
    return result;
  }

  /**
   * Calculate the frequencies of each letter occurring in a string,
   * construct object list with results,
   * sort in descending order. 
   * @param {String} str 
   * @return object list in decending order of letter frequencies
   */
  const calculateLetterFrequencies = str => {
    // initialize with 26 letters of alphabet, start at 0 occurences
    const letterFrequencies = new Array(26).fill(0);

    // only run stats on non-empty string
    (str && [...str.toUpperCase()].forEach(c => {
      // if char in the alphabet, increment that index
      const index = alphabet.indexOf(c);
      if (index >= 0) {
        letterFrequencies[index]++;
      }
    }));

    // map results to object list
    const result = alphabet.map((letter, i) => {
      return {
        'text': letter,
        'value': letterFrequencies[i]
      }
    })

    // sort results in descending order
    return sortStatsDesc(result);
  }

  return (
    <Container className="App">
      <Header />
      <div className={classes.flexContainer}>
        <CipherInput
          prompt="Enter plaintext to calibrate letter frequency:"
          callback={handleCalibrationInput}
        />
        <CipherInput
          prompt="Enter ciphertext to decode:"
          callback={handleCipherInput}
        />
        <div className={classes.barChart}>
          <BarChart
            width={500}
            height={250}
            margin={{top: 50, right: 50, left: 50, bottom: 50}}
            data={calibrationStats}
          />
        </div>
        <div className={classes.barChart}>
          <BarChart
            width={500}
            height={250}
            margin={{top: 50, right: 50, left: 50, bottom: 50}}
            data={cipherStats}
          />
        </div>
      </div>
      <Typography variant="h2">Decoding Table</Typography>
      <Button variant="contained" color="primary" onClick={setStraightLetterMapping}>Set straight letter mapping</Button>
      <MappingTable 
        alphabet={alphabet}
        mapping={mapping}
        setMapping={setMapping}
      />

      {decodedCipher && 
      <>
      <Typography variant="h2">Decoded Output</Typography>
      <Typography className={classes.decodedCipher} variant="body1">{decodedCipher}</Typography>
      </>
      }
    </Container>
  );
}

export default App;
