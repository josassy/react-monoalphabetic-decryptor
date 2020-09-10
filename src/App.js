import React, { useState } from 'react';
import BarChart from 'react-bar-chart';
import './App.css';
import SearchInput from './SearchInput';

function App() {

  // THE ALPHABET
  const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

  // dict of mapping from cipher to plaintext
  const [mapping, setMapping] = useState(() => {
    const result = {};
    alphabet.forEach(letter => result[letter] = letter);
    return result;
  });
  
  const handleMappingChange = (e, letter) => {
    let targetVal = e.target.value.toUpperCase();
    targetVal = targetVal ? targetVal[targetVal.length - 1] : ''
    console.log(`setting to ${targetVal}`);
    setMapping({...mapping, [letter]: targetVal})
  }
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
    setCipherStats(calculateLetterFrequencies(str));
    setDecodedCipher(decodeCipher(str, mapping));
  }

  // calculate straight letter mapping whenever either stats change
  const setStraightLetterMapping = () => {
    setMapping(calculateStraightLetterMapping(calibrationStats, cipherStats));
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
    <div className="App">
      <h1>Monoalphabetic Decryptor</h1>
      <div>
        <SearchInput
          prompt="Enter plaintext to calibrate letter frequency:"
          callback={handleCalibrationInput}
        />
        <SearchInput
          prompt="Enter ciphertext to decode:"
          callback={handleCipherInput}
        />
      </div>
      <BarChart
        width={500}
        height={250}
        margin={{top: 50, right: 50, left: 50, bottom: 50}}
        data={calibrationStats}
      />
      <BarChart
        width={500}
        height={250}
        margin={{top: 50, right: 50, left: 50, bottom: 50}}
        data={cipherStats}
      />
      <br />
      <button onClick={setStraightLetterMapping}>Set straight letter mapping</button>
      <table>
        <tbody>
          <tr>
            <th>Ciphertext:</th>
            {alphabet.map((letter, index) => <td key={index}>{letter}</td>)}
          </tr>
          <tr>
            <th>Plaintext:</th>
            {alphabet.map((letter, index) =>
              <td key={index}>
                <input value={mapping[letter]} onChange={(e, letter) => handleMappingChange(e, letter)} />
              </td>)}
          </tr>
        </tbody>
      </table>
      <p>{decodedCipher}</p>
    </div>
  );
}

export default App;
