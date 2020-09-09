import React, { useState, useEffect } from 'react';
import BarChart from 'react-bar-chart';
import './App.css';

function App() {

  // THE ALPHABET
  const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

  // string-based state of calibration and cipher input
  const [calibrationInput, setCalibrationInput] = useState('');
  const [cipherInput, setCipherInput] = useState('');
  const [mapping, setMapping] = useState(alphabet.map((letter, i) => i));
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
  useEffect(() => {
    // Use input debounce to avoid costly calculation on each keypress
    const timer = setTimeout(() => setCalibrationStats(calculateStats(calibrationInput)), 200);
    return () => clearTimeout(timer);
  }, [calibrationInput])

  // calculate letter stats whenever calibration input changes
  useEffect(() => {
    // Use input debounce to avoid costly calculation on each keypress
    const timer = setTimeout(() => setCipherStats(calculateStats(cipherInput)), 200);
    return () => clearTimeout(timer);
  }, [cipherInput])

  // calculate straight letter mapping whenever either stats change
  useEffect(() => {
    // sort both stat maps
    const sortedCalibrationStats = sortStatsDesc(calibrationStats);
    const sortedCipherStats = sortStatsDesc(cipherStats);

    const result = {};
    for (let i = 0; i < 26; i++) {
      result[sortedCalibrationStats[i].text] = sortedCipherStats[i].text;
    }
    setMapping(result);

  }, [calibrationStats, cipherStats])

  useEffect(() => {
    // invert keys and values in mapping to go backwards
    const invertedMapping = invertMapping(mapping);

    let result = '';
    [...cipherInput.toUpperCase()].forEach(c => {
      if (/[a-zA-Z]/.test(c)) {
        result += invertedMapping[c];
      }
      else {
        result += c;
      }
    })
    setDecodedCipher(result);
  }, [mapping])

  const invertMapping = mapping => {
    const result = {};
    for (const [key, value] of Object.entries(mapping)) {
      result[value] = key;
    }
    return result;
  }

  const sortStatsDesc = statsList => {
    return statsList.sort((x, y) => y.value - x.value);
  }

  const calculateStats = str => {
    // initialize with 26 letters of alphabet, start at 0 occurences
    const letterFrequencies = new Array(26).fill(0);

    // only run stats on non-empty string
    (str && typeof str === "string") && [...str.toUpperCase()].forEach(c => {
      // if char in the alphabet, increment that index
      const index = alphabet.indexOf(c);
      if (index >= 0) {
        letterFrequencies[index]++;
      }
    });

    const result = alphabet.map((letter, i) => {
      return {
        'text': letter, 
        'value': letterFrequencies[i]
      }
    })

    return result;
  }

  return (
    <div className="App">
      <h1>Monoalphabetic Decryptor</h1>
      <form onSubmit={e => {e.preventDefault(); calculateStats(calibrationInput);}}>
        <p>Enter plaintext to calibrate letter frequency table:</p>
        <textarea value={calibrationInput} onChange={e => setCalibrationInput(e.target.value)}/>
        <p>{`Letters: ${[...calibrationInput].reduce(((count, char) => 
          // use reducer function to count letters in the input
          count + (/[a-zA-Z]/.test(char) ? 1 : 0)),
          // pass intial count of 0 to reduce call
          0)
          }`}</p>
        <p>Enter plaintext to calibrate letter frequency table:</p>
        <textarea value={cipherInput} onChange={e => setCipherInput(e.target.value)}/>
        <p>{`Letters: ${[...cipherInput].reduce(((count, char) => 
          // use reducer function to count letters in the input
          count + (/[a-zA-Z]/.test(char) ? 1 : 0)),
          // pass intial count of 0 to reduce call
          0)
          }`}</p>
      </form>
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
      <table>
        <tbody>
          <tr>
            <th>Plain:</th>
            {alphabet.map(letter => <td>{letter}</td>)}
          </tr>
          <tr>
            <th>Cipher:</th>
            {alphabet.map(letter => <td>{mapping[letter]}</td>)}
          </tr>
        </tbody>
      </table>
      <p>{decodedCipher}</p>
    </div>
  );
}

export default App;
