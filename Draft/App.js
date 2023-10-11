import React, { useState, useEffect } from 'react';

const App = () => {
    const [words, setWords] = useState([]); 
    const [generatedWords, setGeneratedWords] = useState([]);
    const [currentWord, setCurrentWord] = useState(null);

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

  return (
      <div>
        <h1>Word Generator</h1>
        <button onClick={wordGeneration}>Generate Word</button>
        {currentWord && <p> Generated Word: {currentWord} </p>}
        <ul>
          {generatedWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>
    );

};

export default App;