import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [words, setWords] = useState([]);
  const [generatedWords, setGeneratedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [inputBoxes, setInputBoxes] = useState(['', '', '', '', '']); // 5 input boxes
  const [attempts, GuessAttempts] = useState(0);
  const [correctGuess, setCorrectGuess] = useState(false);



  useEffect(() => {
    async function loadWords() {
      try {
        const response = await fetch('words.txt');
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const text = await response.text();
        const wordsArray = text.split('\n').map((word) => word.trim());
        setWords(wordsArray);
      } catch (error) {
        console.error('Error fetching or processing words: ', error);
      }
    }
    loadWords();
  }, []);


  const wordGeneration = () => {
    if (words.length === 0) {
      console.error('No words loaded from the text file.');
      return;
    }

    setInputBoxes(['', '', '', '', '']); // Reset input boxes
    GuessAttempts(0);
    setCurrentGuess('');
    setCorrectGuess(false);

    let num = Math.floor(Math.random() * words.length);
    let word = words[num];

    setCurrentWord(word);

    if (!generatedWords.includes(word)) {
      setGeneratedWords([...generatedWords, word]);
    } else {
      console.log(word + ' was already generated.');
    }
  };

  function checkGuess() {
    if (currentGuess === currentWord) {
      console.log('You guessed the word');
      setCorrectGuess(true);
      // Color-code or handle correct guess
      wordGeneration();
      setCurrentGuess('');
    } else {
      setCurrentGuess('');
      console.log('Did not guess the word');
      // Color-code or handle incorrect guess
    }
  }

  function validGuess() {
    if (currentGuess.length === 5) {
      checkGuess();
      if(!correctGuess){
        GuessAttempts((prevAttempts) => prevAttempts+1);
        if(attempts === 5) {
          wordGeneration()
        }
      }
      else if(correctGuess){
        wordGeneration();
      }
    }
  }

  function isAlpha(str) {
    return /^[a-zA-Z]$/.test(str);
  }

  function userInput({ key }) {
    if (isAlpha(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((currentGuess) => currentGuess + key);

        // Update the corresponding input box
        const updatedBoxes = [...inputBoxes];
        for (let i = 0; i < 5; i++) {
          if (updatedBoxes[i] === '') {
            updatedBoxes[i] = key;
            setInputBoxes(updatedBoxes);
            break;
          }
        }
      }
    } else if (key === 'Backspace') {
      setCurrentGuess((currentGuess) => currentGuess.substring(0, currentGuess.length - 1));

      // Update the corresponding input box
      const updatedBoxes = [...inputBoxes];
      for (let i = 4; i >= 0; i--) {
        if (updatedBoxes[i] !== '') {
          updatedBoxes[i] = '';
          setInputBoxes(updatedBoxes);
          break;
        }
      }
    } else if (key === 'Enter') {
      validGuess();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', userInput);

    return () => {
      window.removeEventListener('keydown', userInput);
    };
  }, [userInput]);

  return (
    <div className="App">
      <h1><center>WordleRush</center></h1>
      <h1><center>Word Generator</center></h1>
      <button onClick={wordGeneration}>Generate Word</button>
      {currentWord && (
        <div>
            <p>Generated Word: {currentWord} </p>
            <p> Current Guess: {currentGuess} </p>
          
          <div>
            {inputBoxes.map((letter, index) => (
              <input
                key={index}
                type="text"
                defaultValue={letter}
                disabled={letter !== ''}
                style={{ width: '30px', marginRight: '5px' }}
              />
            ))}
          </div>
        </div>
      )}
      <p>Attempts: {attempts}/6</p>
    </div>
  );
};

  export default App;