import React, { useState } from 'react';
import './App.css';

function App() {

  const [userInput, setUserInput] = useState('');
  const handleChange = e => {
    setUserInput(e.target.value);
    
  }

  return (
    <div className="App">
      <h1>Monoalphabetic Decryptor</h1>
      <p>Enter the text to decrypt:</p>
      <input value={userInput} onChange={handleChange}/>
      <br />
      <p>{userInput}</p>
    </div>
  );
}

export default App;
