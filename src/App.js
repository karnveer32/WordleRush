import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Grid from './Grid';
import checker from './checker';
import QwertyKeyboard from './QwertyKeyboard';
import statsIcon from './images/stats-icon.png'
import exitIcon from './images/x-out.png'
import HowToPlay from './HowToPlay';
import ReactSwitch from 'react-switch';

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
  const [selectedDuration, setSelectedDuration] = useState(0.5);
  const [seconds, setSeconds] = useState(selectedDuration * 60);
  const [showStats, setShowStats] = useState(false);
  const [userStartedTyping, setUserStartedTyping] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [showTutorial, setTutorial] = useState(false);
  const [theme, setTheme] = useState('light');
  const [checked, setChecked] = useState(false);

  //DARK & LIGHT MODE FUNCTIONS
  const toggleTheme = val => {
    setChecked(val)
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  //TUTORIAL FUNCTIONS
  const displayTutorial = () => {
    setTutorial(true);
  }

  const closeTutorial = () => {
    setTutorial(false);
  }

  //TIMER
  const handleDurationChange = (event) => {
    setSelectedDuration(parseFloat(event.target.value));
    setSeconds(parseFloat(event.target.value));
  };

  //STATISTICS
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

  const closeStats = () => setShowStats(false);

  //TIMER
  const startTimer = () => {
    setIsActive(true);
    setTimerActive(true);
  };

  //RESTART GAME
  const restartGame = () => {
    setIsActive(false);
    setTimerActive(false);
    //setWords([]); // Reset words
    setGeneratedWords([]); // Reset generated words
    setCurrentWord(null);
    setCurrentGuess('');
    setInputBoxes(['', '', '', '', '']); // Reset input boxes
    GuessAttempts(0); // Reset attempts
    Counter(0); // Reset counts
    setGuessHistory(new Array(6).fill(undefined));
    setSeconds(selectedDuration);
    setGameStats({
      played: 0,
      correct: 0,
      time: selectedDuration,
    });
  };

  //TIMER
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

  //STATISTICS
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

    return () => {
      clearInterval(interval);
    }
  }, [isActive, seconds, counts, selectedDuration]);

  //WORD GENERATION FUNCTION
  const wordGeneration = useCallback(() => {
    if (words.length === 0) {
      console.error('No words loaded from the text file.');
      return;
    }

    setInputBoxes(['', '', '', '', '']); // Reset input boxes
    GuessAttempts(0);
    setCurrentGuess('');
    setUserStartedTyping(false);
    setRounds(rounds => rounds + 1);

    let num = Math.floor(Math.random() * words.length);
    let word = words[num].toUpperCase();

    setCurrentWord(word);
    setGuessHistory(new Array(6).fill(undefined));
    
    if (!generatedWords.includes(word)) {
      setGeneratedWords(generatedWords => [...generatedWords, word]);
      console.log(word);
    } else {
      console.log(word + ' was already generated.');
      wordGeneration();
    }
  }, [words, generatedWords]);

  useEffect(() => {
    if (!isActive && generatedWords.length === 0) {
      wordGeneration();
    }
  }, [isActive, generatedWords, wordGeneration]);

  //CHECKS USER GUESS
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

  //CAPITALIZES THE GUESS
  function isAlpha(str) {
    return /^[a-zA-Z]$/.test(str);
  }

  //HANDLES USER INPUT
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


  //HTML PORTION 
  return (
    <div className={`App ${theme}`}>
        <h1>WordleRush</h1>
        <div className='theme-toggle'>
          <h4>Dark Mode</h4>
          <ReactSwitch
            checked={checked}
            onChange={toggleTheme}
          />
        </div>

      <div className="Tutorial" onClick={displayTutorial}>
        <span>ℹ️</span>
      </div>

      {showTutorial && <HowToPlay onClose={closeTutorial} />}

     <p className = "rounds"> Round: {generatedWords.length} </p>
      <div className = "side">
        <p>Counter: {counts}</p>
      </div>
      
      <p className = {seconds < 11 ? 'red-text' : 'normal-text'}>
          Time: {formatTime()}
      </p>

     {showStats ? (
        <div className="close-icon" onClick={toggleStats} style={{ backgroundImage: `url(${exitIcon})` }}></div>
      ) : (
        <div className="stats-icon" onClick={toggleStats} style={{ backgroundImage: `url(${statsIcon})` }}></div>
      )}


      {showStats && (
        <div className="modal show">
        <div className="modal-content">
          <h2>STATISTICS</h2>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-label">Games Played: </span>
              <span className="stat-value">{gameStats.played}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rounds Played: </span>
              <span className="stat-value">{rounds}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time: </span>
              <span className="stat-value">{gameStats.time} second(s)</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Correct Guesses: </span>
              <span className="stat-value">{gameStats.correct}</span>
            </div>
            {seconds === 0 && attempts > 0 && (
              <div>
                <p>Time's Up! The correct words were:</p>
                <ul>
                  {generatedWords.map((word, index) => (
                    <div key={index}>
                      <strong>Round {index + 1}:</strong> {word}
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      <div>
        {timerActive ? (
          <p>Timer is Running....</p>
        ) : (
          <div>
          <label>Select Time:</label>
          <select value={selectedDuration} onChange={handleDurationChange}>
            <option value={30}>30 seconds</option>
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
            <option value={120}>120 seconds</option>
          </select>
        </div>
        )}
      </div>

      {/*<button onClick={wordGeneration}>Generate Word</button>*/}
      <button onClick={restartGame}> Restart Game </button>

      <div>
        {/*<p>Attempts: {attempts}/6</p>*/}
        {currentWord && (
          <Grid guesses={guessHistory} currentGuess={currentGuess} attempt={attempts} currentWord={currentWord} />
        )}
        <div>
          {/*<p>Guess History:</p> */}
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
          {seconds === 0 && (
            <div>
              <p>Time's Up! The correct words were:</p>
                <div className='rounds'>
                  {generatedWords.map((word, index) => (
                    <div key={index+1}> 
                        <strong>Round {index + 1}:</strong> {word} {/*{index + 1 <= roundCounter ? word : ''}*/}
                    </div>
                  ))}
                </div>
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