import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Grid from './Grid';
import checker from './checker';
import QwertyKeyboard from './QwertyKeyboard';
import HowToPlay from './HowToPlay';
import ReactSwitch from 'react-switch';
import restartIcon from './images/redo-svgrepo-com.svg';
import darkRestartIcon from './images/whiteRedo.svg';
import info from './images/question-circle-svgrepo-com.svg';
import infoDark from './images/whiteQuestion.svg';
import lightStats from './images/lightStats.svg';
import darkStats from './images/darkStats.svg';

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
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [seconds, setSeconds] = useState(selectedDuration);
  const [showStats, setShowStats] = useState(false);
  const [userStartedTyping, setUserStartedTyping] = useState(false);
  //const [rounds, setRounds] = useState(0);
  const [showTutorial, setTutorial] = useState(false);
  const [theme, setTheme] = useState('light');
  const [checked, setChecked] = useState(false);
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

    //COPY TO CLIPBOARD
  const copyStatsToClipboard = () => {
      const stats = `WordleRush Game Stats:
    Rounds Played: ${generatedWords.length}
    Time: ${displayFormattedTime(gameStats.time)}
    Correct Guesses: ${gameStats.correct}`;
      
      navigator.clipboard.writeText(stats).then(() => {
        setShowCopyPopup(true);
        setTimeout(() => setShowCopyPopup(false), 2000); 
      }, (err) => {
        console.error('Could not copy text: ', err);
      });
    };

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


  const infoSvg = theme === 'light' ? info : infoDark;
  const restartSvg = theme === 'light' ? restartIcon : darkRestartIcon;
  const statSvg = theme === 'light' ? lightStats : darkStats;

  // STATS/EXIT ICON
  const StatsIcon = () => (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 12H4.6C4.03995 12 3.75992 12 3.54601 12.109C3.35785 12.2049 3.20487 12.3578 3.10899 12.546C3 12.7599 3 13.0399 3 13.6V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H9M9 21H15M9 21L9 8.6C9 8.03995 9 7.75992 9.10899 7.54601C9.20487 7.35785 9.35785 7.20487 9.54601 7.10899C9.75992 7 10.0399 7 10.6 7H13.4C13.9601 7 14.2401 7 14.454 7.10899C14.6422 7.20487 14.7951 7.35785 14.891 7.54601C15 7.75992 15 8.03995 15 8.6V21M15 21H19.4C19.9601 21 20.2401 21 20.454 20.891C20.6422 20.7951 20.7951 20.6422 20.891 20.454C21 20.2401 21 19.9601 21 19.4V4.6C21 4.03995 21 3.75992 20.891 3.54601C20.7951 3.35785 20.6422 3.20487 20.454 3.10899C20.2401 3 19.9601 3 19.4 3H16.6C16.0399 3 15.7599 3 15.546 3.10899C15.3578 3.20487 15.2049 3.35785 15.109 3.54601C15 3.75992 15 4.03995 15 4.6V8" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ExitIcon = () => (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#0F0F0F"/>
    </svg>
  );

  //TUTORIAL FUNCTIONS
  const displayTutorial = () => {
    setTutorial(true);
  }

  const closeTutorial = () => {
    setTutorial(false);
  }

  //TIMER
  const handleDurationChange = (event) => {
    const durationInSeconds = parseFloat(event.target.value) * 60;
    setSelectedDuration(durationInSeconds);
    setSeconds(durationInSeconds);

    setGameStats((prevStats) => ({
      ...prevStats,
      time:durationInSeconds,
    }));
  };

  
  const displayFormattedTime = (timeInSeconds) => {
    if (timeInSeconds >= 60) {
      const minutes = Math.floor(timeInSeconds / 60);
      const remainingSeconds = timeInSeconds % 60;
      return `${minutes} minute(s)` + (remainingSeconds > 0 ? ` ${remainingSeconds} second(s)` : '');
    } else if (timeInSeconds > 0) { 
      return `${timeInSeconds} second(s)`;
    } else {
      return `0 second(s)`; 
    }
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
    //setSeconds(selectedDuration);
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
    setGameStats((prevStats) => ({
      ...prevStats,
      correct: 0,
      time: selectedDuration,
    }));
    //setRounds(0);
  };

  //TIMER
  const formatTime = () => {
    return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    async function loadWords() {
      try {
        const response = await fetch('clean_words.txt');
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
    //setRounds(rounds => rounds + 1);

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


  const showCustomAlert = (message) => {
    setAlertMessage(message);
    
    //Clear the alert after 1 seconds
    setTimeout(() => {
      setAlertMessage('');
    }, 1000);
  };

  //CHECKS USER GUESS
  const validGuess = useCallback((currentGuess) => {
    if (currentGuess.length !== 5) {
      showCustomAlert("Not enough letters")
    }

    else if(!words.includes(currentGuess.toLowerCase())) {
      showCustomAlert("Not in word list")
    }
    
    else if (currentGuess.length === 5 && words.includes(currentGuess.toLowerCase())) {
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
          //setRounds((prevRounds) => prevRounds + 1);
          setCurrentGuess('');
        }
      } else {
        Counter((counts) => counts + 1);
        wordGeneration();
        //setRounds((prevRounds) => prevRounds + 1);
        setCurrentGuess('');
      }
    }
  }, [currentWord, GuessAttempts, attempts, wordGeneration, setCurrentGuess, inputBoxes, guessHistory, words]);

  useEffect(() => {
    return() => {
      setAlertMessage('');
    }
  }, []);

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
        setGameStarted(true);
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

        {alertMessage && (
          <div className='custom-alert'>
            {alertMessage}
          </div>
        )}

      <div className='Tutorial' onClick={displayTutorial}>
        {/*<button onClick={restartGame}> Restart Game </button>*/}
          <img src={ infoSvg} alt="tutorial"/>
      </div>

      {showTutorial && <HowToPlay onClose={closeTutorial} />}

    <div className='left'>

    {timerActive ? (
        <p><strong>Timer is Running....</strong></p>
      ) : (
        <div>
        <label><strong>Select Time: </strong></label>
        <select value={selectedDuration / 60} onChange={handleDurationChange}>
          <option value={0.5}>30 seconds</option>
          <option value={1}>60 seconds</option>
          <option value={1.5}>90 seconds</option>
          <option value={2}>120 seconds</option>
        </select>
      </div>
      )}
     
     <p className = {seconds < 11 ? 'red-text' : 'normal-text'}>
      <strong>Time:</strong> {formatTime()}
        </p>

     <p className = "rounds"> Round: {generatedWords.length} </p>
      <div className = "side">
        <p><strong>Counter: </strong>{counts}</p>
      </div>

      <div className='timerOption'>
    
    </div>
    </div>

      {/*<div className="stats-icon" onClick={toggleStats}>
          <StatsIcon />
      </div>*/}
      <div className='stats-icon' onClick={toggleStats}>
        {/*<button onClick={restartGame}> Restart Game </button>*/}
          <img src={statSvg} alt="stats"/>
      </div>


      {showStats && (
        <div className="modal-overlay">
        <div className="modal-content">
          <h2>STATISTICS</h2>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-label">Games Played: </span>
              <span className="stat-value">{gameStats.played}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rounds Played: </span>
              <span className="stat-value">{gameStarted ? generatedWords.length : 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time: </span>
              <span className="stat-value">{displayFormattedTime(gameStats.time)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Correct Guesses: </span>
              <span className="stat-value">{gameStats.correct}</span>
            </div>
            {seconds === 0 && attempts > 0 && (
              <div className="correct-words-list">
              <h3>Correct Words:</h3>
              <ul>
                {generatedWords.map((word, index) => (
                  <li key={index}><strong>Round {index + 1}:</strong> {word}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Close button for the stats modal */}
        <button className="close" onClick={() => setShowStats(false)}>X</button>
        <button className="share-button" onClick={copyStatsToClipboard}>Share</button>
      </div>
    </div>
  )}

  {showCopyPopup && (
    <div className="copy-popup">
      Copied results to clipboard
    </div>
  )}

      {/*<button onClick={wordGeneration}>Generate Word</button>*/}
      <div className='center-container'>
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
          </div>
        </div>

        <div className='restart' onClick={restartGame}>
        {/*<button onClick={restartGame}> Restart Game </button>*/}
          <img src={restartSvg} alt="restart"/>
        </div>

        {/* Render the QwertyKeyboard component underneath the grid */}
        <QwertyKeyboard
          onKeyPress={userInput}
          guessHistory={guessHistory}
          currentWord={currentWord}
          currentGuess={currentGuess}
        />
      </div>
    </div>
  );
};

export default App;