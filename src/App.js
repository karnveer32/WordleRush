import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import checker from './checker';

const App = () => {
  const [words, setWords] = useState([]);
  const [generatedWords, setGeneratedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [inputBoxes, setInputBoxes] = useState(['', '', '', '', '']); // 5 input boxes
  const [attempts, GuessAttempts] = useState(6);
  const [guessHistory, setGuessHistory] = useState([]);
  //const [correctGuess, setCorrectGuess] = useState(false);

  useEffect(() => {
    async function loadWords() {
      try {
        const response = await fetch('temp_words.txt');
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


  const wordGeneration = useCallback(() => {
    if (words.length === 0) {
      console.error('No words loaded from the text file.');
      return;
    }

    setInputBoxes(['', '', '', '', '']); // Reset input boxes
    GuessAttempts(6);
    setCurrentGuess('');
    //setCorrectGuess(false);

    let num = Math.floor(Math.random() * words.length);
    let word = words[num].toUpperCase();

    setCurrentWord(word);
    setGuessHistory([])

    if (!generatedWords.includes(word)) {
      setGeneratedWords([...generatedWords, word]);
    } else {
      console.log(word + ' was already generated.');
    }
  }, [words, generatedWords]);

  //function validGuess(currentGuess) //placeholder (Eric) //reset currentGuess if not valid
  const validGuess = useCallback((currentGuess) => {
    if (currentGuess.length === 5) {
      const isCorrect = checker(currentGuess, currentWord);
      const updatedInputBoxes = [...inputBoxes];

      for (let i = 0; i < 5; i++) {
        if (updatedInputBoxes[i] === '') {
          updatedInputBoxes[i] = currentGuess[i];
        }
      }

      if (!isCorrect) {
        GuessAttempts((prevAttempts) => prevAttempts - 1);
        setInputBoxes(['', '', '', '', '']);
        setCurrentGuess('');

        setGuessHistory((prevHistory) => [
          ...prevHistory,
          { guess: currentGuess, inputBoxes: updatedInputBoxes, correct: isCorrect },
        ]);

        if (attempts === 1) {
          wordGeneration();
          setCurrentGuess('');
        }
      } 
      
      else {
        wordGeneration();
        setCurrentGuess('');
      }
    }
  }, 
  [currentWord, GuessAttempts, attempts, wordGeneration, setCurrentGuess, inputBoxes]);

  function isAlpha(str) {
    return /^[a-zA-Z]$/.test(str);
  }

  const userInput = useCallback(
    ({ key }) => {
      if (isAlpha(key)) {
        key=key.toUpperCase()
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
        validGuess(currentGuess);
      }
    },
    [currentGuess, validGuess, inputBoxes]
  );

  useEffect(() => {
    try {
      window.addEventListener('keydown', userInput);

      return () => {
        window.removeEventListener('keydown', userInput);
      }
    }
    catch (error) {
      console.error('Error getting a word', error);
    };
  }, [userInput]);

return (
  <div className="App">
    <h1><center>WordleRush</center></h1>
    
    <button onClick={wordGeneration}>Generate Word</button>
    {currentWord && (
      <div>
        <div className="grid">
          {inputBoxes.map((letter, index) => (
            <div key={index} className="box">
              <input
                type="text"
                defaultValue={letter}
                disabled={letter !== ''}
                className={letter === currentWord[index] ? 'box green' :
                  (letter && currentWord.includes(letter)) ? 'box yellow' : 'box grey'}
              />
            </div>
          ))}
        </div>
      </div>
    )}

    <div>
      <p>Attempts: {attempts}/6</p>
      <div>
        <p>Guess History:</p>
        <div>
          {guessHistory.map((word, index) => (
            <div key={index} className = "grid">
              {word.inputBoxes.map((letter, boxIndex) => (
                <input
                  key={boxIndex}
                  type="text"
                  defaultValue={letter}
                  disabled={true}
                  className={letter === currentWord[boxIndex] ? 'box green' :
                  (letter && currentWord.includes(letter)) ? 'box yellow' : 'box grey'}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

}

export default App;

//style={{ width: '30px', marginRight: '5px' }}
//<h1><center>Word Generator</center></h1> 
//<p>Generated Word: {currentWord} </p>
//<p> Current Guess: {currentGuess} </p>