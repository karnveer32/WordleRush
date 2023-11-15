import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Grid from './Grid';
import checker from './checker';
import QwertyKeyboard from './QwertyKeyboard';

const App = () => {
  const [words, setWords] = useState([]);
  const [generatedWords, setGeneratedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [inputBoxes, setInputBoxes] = useState(['', '', '', '', '']); // 5 input boxes
  const [attempts, GuessAttempts] = useState(0);
  const [counts, Counter] = useState(0);
  const [guessHistory, setGuessHistory] = useState(new Array(6).fill(undefined));
  const [isActive, setIsActive] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [seconds, setSeconds] = useState(selectedDuration * 60);
  const [showStats, setShowStats] = useState(false);
  const [userStartedTyping, setUserStartedTyping] = useState(false);

  const handleDurationChange = (event) => {
    setSelectedDuration(parseInt(event.target.value));
    setSeconds(parseInt(event.target.value) * 60);
  };

  const [gameStats, setGameStats] = useState({
    played: 0,
    correct: 0,
    time: selectedDuration,
  });

  const toggleStats = () => {
    if (!timerActive) {
      setShowStats(!showStats);
    } else {
      alert("You cannot view statistics while the game is in progress.");
    }
  };

  const startTimer = () => {
    setIsActive(true);
    setTimerActive(true);
  };

  const formatTime = () => {
    return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

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

  useEffect(() => {
    let interval;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      setTimerActive(false);
      setGameStats((prevStats) => ({
        ...prevStats,
        played: prevStats.played + 1,  
        correct: counts,
        time: selectedDuration,
      }));
      setShowStats(true);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, counts, selectedDuration]);

  const wordGeneration = useCallback(() => {
    if (words.length === 0) {
      console.error('No words loaded from the text file.');
      return;
    }

    setInputBoxes(['', '', '', '', '']); // Reset input boxes
    GuessAttempts(0);
    setCurrentGuess('');
    setUserStartedTyping(false);

    let num = Math.floor(Math.random() * words.length);
    let word = words[num].toUpperCase();

    setCurrentWord(word);
    setGuessHistory(new Array(6).fill(undefined));
    
    if (!generatedWords.includes(word)) {
      setGeneratedWords(generatedWords => [...generatedWords, word]);
    } else {
      console.log(word + ' was already generated.');
      wordGeneration();
    }
  }, [words, generatedWords]);

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
        GuessAttempts((prevAttempts) => prevAttempts + 1);
        setInputBoxes(['', '', '', '', '']);
        setCurrentGuess('');

        const newGuessEntry = currentGuess;

        setGuessHistory((prevHistory) => {
          const historyCopy = [...prevHistory];
          const undefinedIndex = historyCopy.findIndex((entry) => entry === undefined);
          if (undefinedIndex !== -1) {
            historyCopy[undefinedIndex] = newGuessEntry;
          }
          return historyCopy;
        });

        console.log(guessHistory);

        if (attempts === 5) {
          wordGeneration();
          setCurrentGuess('');
        }
      } else {
        Counter((counts) => counts + 1);
        wordGeneration();
        setCurrentGuess('');
      }
    }
  }, [currentWord, GuessAttempts, attempts, wordGeneration, setCurrentGuess, inputBoxes, guessHistory]);

  function isAlpha(str) {
    return /^[a-zA-Z]$/.test(str);
  }

  const userInput = useCallback(
    ({ key }) => {
      if (!userStartedTyping) {
        setUserStartedTyping(true);
        startTimer();
      }
      if (timerActive) {
        if (isAlpha(key)) {
          key = key.toUpperCase();
          if (currentGuess.length < 5) {
            setCurrentGuess((currentGuess) => currentGuess + key);

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
      }
    },
    [currentGuess, validGuess, inputBoxes, timerActive, userStartedTyping]
  );

  useEffect(() => {
    window.addEventListener('keydown', userInput);

    return () => {
      window.removeEventListener('keydown', userInput);
    };
  }, [userInput]);

  return (
    <div className="App">
      <h1>
        <center>WordleRush</center>
      </h1>

      <div className="stats-icon" onClick={toggleStats}>📊</div>

      {showStats && (
        <div className="modal show"> 
          <div className="modal-content">
            <span className="close" onClick={() => setShowStats(false)}>&times;</span>
              <h2>STATISTICS</h2>
              <p>Played: {gameStats.played}</p>
              <p>Time: {gameStats.time} minute(s)</p>
              <p>Correct: {gameStats.correct}</p>
          </div>
        </div>
      )}

      <div>
        <label>Select Time:</label>
        <select value={selectedDuration} onChange={handleDurationChange}>
          <option value={1}>1 minute</option>
          <option value={2}>2 minute</option>
          <option value={3}>3 minute</option>
        </select>
      </div>

      <button onClick={wordGeneration}>Generate Word</button>
      {currentWord && (
        <div>
          <div className="grid">
            {/*
            {inputBoxes.map((letter, index) => (
              <div key={index} className="box">
                <input
                  type="text"
                  defaultValue={letter}
                  disabled={letter !== ''}
                  className={
                    letter === currentWord[index]
                      ? 'box grey'
                      : letter && currentWord.includes(letter)
                      ? 'box grey'
                      : 'box grey'
                  }
                />
              </div>
            ))}
                */}
          </div>
        </div>
      )}

      <div>
        <p>Attempts: {attempts}/6</p>
        {currentWord && (
          <Grid guesses={guessHistory} currentGuess={currentGuess} attempt={attempts} currentWord={currentWord} />
        )}
        <div>
          {/*<p>Guess History:</p> */}
          <p>Counter: {counts}</p>
          <p>{formatTime()}</p>
          <div>
            {guessHistory.map((word, index) => (
              <div key={index} className="grid">
                {word && word.inputBoxes && word.inputBoxes.map((letter, boxIndex) => (
                  <input
                    key={boxIndex}
                    type="text"
                    defaultValue={letter}
                    disabled={true}
                    className={
                      letter === currentWord[boxIndex]
                        ? 'box green'
                        : letter && currentWord.includes(letter)
                        ? 'box yellow'
                        : 'box grey'
                    }
                  />
                ))}
              </div>
            ))}
          </div>
          {seconds === 0 && attempts > 0 && (
            <div>
              <p>Time's Up! The correct words were:</p>
              <ul>
                {generatedWords.map((word, index) => (
                  <li key={index}>
                    <strong>Round {index + 1}:</strong> {word}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Render the QwertyKeyboard component underneath the grid */}
      <QwertyKeyboard
	  onKeyPress={userInput}
	  guessHistory={guessHistory}
	  currentWord={currentWord}
	  currentGuess={currentGuess}
      />
    </div>
  );
};

export default App;