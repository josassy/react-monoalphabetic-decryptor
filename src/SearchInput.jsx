import React, { useState, useEffect } from 'react';

const SearchInput = ({prompt, callback}) => {
  // hold state of input
  const [userInput, setUserInput] = useState('');
  
  // update parent whenever input changes
  useEffect(() => {
    // Use input debounce to avoid costly calculation on each keypress
    const timer = setTimeout(() => callback(userInput), 200);
    return () => clearTimeout(timer);
  }, [userInput, callback]);

  return (
    <>
    <p>{prompt}</p>
    <textarea value={userInput} onChange={e => setUserInput(e.target.value)}/>
    <p>{`Letters: ${[...userInput].reduce(((count, char) =>
      // use reducer function to count letters in the input
      count + (/[a-zA-Z]/.test(char) ? 1 : 0)),
      // pass intial count of 0 to reduce call
      0)
      }`}
      </p>
    </>
  )
}

export default SearchInput;