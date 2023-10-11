import generator from './generator'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

function App() {
  const txt = ["hello", "world", "these", "quote", "bring", "tests"];
  const [generatedWords, setGeneratedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [currentGuess, setCurrentGuess] = useState('') //current guess is empty string in the beginning
  //const [guesses, setGuesses] = useState(new Array(6).fill(undefined)) //guesses is empty array in the beginning

  const wordGeneration = () => {
    let num = Math.floor(Math.random() * txt.length);
    let word = txt[num];

    setCurrentWord(word);

    if (!generatedWords.includes(word)) {
      setGeneratedWords([...generatedWords, word]);
    }
    else {
      console.log(word + " was already generayed.");
    }
  };

  function checkGuess(currrentGuess) //placeholder (Sai)
  {
    if (currentGuess == currentWord) {
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
    if (currentGuess.length == 5) {
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
    else if (key == 'Backspace') {
      setCurrentGuess(currentGuess => currentGuess.substring(0, currentGuess.length - 1))
    }
    else if (key == "Enter") {
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