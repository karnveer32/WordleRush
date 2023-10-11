import React, { useState, useEffect, useCallback } from 'react';

const App = () => {
    const [words, setWords] = useState([]); 
    const [generatedWords, setGeneratedWords] = useState([]);
    const [currentWord, setCurrentWord] = useState(null);
    const [currentGuess, setCurrentGuess] = useState('') 

    useEffect(() => {
      async function loadWords() {
        try {
          const response = await fetch('words.txt');
          if(!response.ok) {
            throw new Error('Network response was not ok.');
          }
          
          const text = await response.text();
          const wordsArray = text.split('\n').map((word) => word.trim());
          setWords(wordsArray);
        }

        catch(error) {
          console.error('Error fetching or processing words: ', error);
        }
      }
      loadWords();

    }, []);


    const wordGeneration = () => {
      if (words.length === 0){
        console.error('No words loaded from the text file.');
        return;
      }

      let num = Math.floor(Math.random() * words.length);
      let word = words[num];

      setCurrentWord(word);

      if(!generatedWords.includes(word)) {
          setGeneratedWords([...generatedWords, word]);
      }
      else {
          console.log(word + " was already generated.");
      }
  };
  function checkGuess(currrentGuess) //placeholder (Sai)
  {
    if (currentGuess === currentWord) {
      console.log("you guessed the word")
      //color-code
      //generator()
    }
    else {
      setCurrentGuess(currentGuess => '')
      console.log("did not guess the word")
      //color-code
    }
  }



  function validGuess(currentGuess) //placeholder (Eric) //reset currentGuess if not valid
  {
    if (currentGuess.length === 5) {
      checkGuess(currentGuess)
      //setGuessses
    }

  }

  function isAlpha(str) {
    return /^[a-zA-Z]$/.test(str);
  }


  function userInput({ key }) {
    if (isAlpha(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess(currentGuess => currentGuess + key)

      }

    }
    else if (key === 'Backspace') {
      setCurrentGuess(currentGuess => currentGuess.substring(0, currentGuess.length - 1))
    }
    else if (key === "Enter") {
      validGuess(currentGuess)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', userInput)

    return () => {
      window.removeEventListener('keydown', userInput)
    };
  }, [userInput])

  return (
    <div>
      <h1>WordleRush</h1>
      <h1>Word Generator</h1>
      <button onClick={wordGeneration}>Generate Word</button>
      {currentWord && <p> Generated Word: {currentWord}  <br></br> current guess: {currentGuess} </p>}
      <ul></ul>


    </div>
  );
}

export default App;
