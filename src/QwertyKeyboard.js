import React, { useState, useEffect } from 'react';

const QwertyKeyboard = ({ onKeyPress, guessHistory, currentWord, currentGuess, attempts }) => {
  const [prevGreen, setPrevGreen] = useState([]);
  const [prevYellow, setPrevYellow] = useState([]);
  const [prevGrey, setPrevGrey] = useState([]);
  
  useEffect(() => {
    resetKeyColors();
  }, [currentWord]);

  const resetKeyColors = () => {
    setPrevGreen([]);
    setPrevYellow([]);
  };

  const handleKeyPress = (key) => {
      onKeyPress({ key });
     // console.log("Current Word:", currentWord);
  };

  const determineKeyColor = (key) => {
    if (attempts === 0) {
      setPrevGreen([]);
    }
    //console.log(guessHistory)
    if (!guessHistory || !currentWord) {
      return '';
   }
   
   const lastGuessedWord = guessHistory.reduceRight((acc, current) => {
    if (current !== undefined && acc === undefined) {
      return current;
    }
    return acc;
  }, undefined);

  
  //console.log(lastGuessedWord); 

  
  if (lastGuessedWord !== undefined && lastGuessedWord.length === currentWord.length) {
    for (let i = 0; i < lastGuessedWord.length; i++) {
      const guessedLetter = lastGuessedWord[i];
      const currentLetter = currentWord[i];
      

      if (key === guessedLetter && key === currentLetter) {
        setPrevGreen(prevGreen => [...prevGreen, key]);
        return 'correct'; 
      } else if (guessedLetter.includes(key) && currentWord.includes(key)) {
        setPrevYellow(prevYellow => [...prevYellow, key]);
        return 'in-guess'; 
      }
      else if (key === guessedLetter){
        setPrevGrey(prevGrey => [...prevGrey, key]);
        return 'not-included'
      }
    }
  }
  
/*
  if(lastGuessedWord != undefined){
    if(key = guessed)
    if(currentWord.includes(key) && lastGuessedWord.includes(key)){
      return 'in-guess'
    }
  }
*/
    return '';
  };

  const checkYellow = (key) => {
   const lastGuessedWord = guessHistory.reduceRight((acc, current) => {
    if (current !== undefined && acc === undefined) {
      return current;
    }
    return acc;
  }, undefined);
  
  console.log(lastGuessedWord); 

  
  if (lastGuessedWord && lastGuessedWord.length === currentWord.length) {
    for (let i = 0; i < lastGuessedWord.length; i++) {
      const guessedLetter = lastGuessedWord[i];
      const currentLetter = currentWord[i];

      if (key === guessedLetter && key === currentLetter) {
        setPrevGreen(prevGreen => [...prevGreen, key]);
        console.log("prevgreen: ", prevGreen)
        return 'correct'; 
      }
      else{
        console.log("prevYellow: ", prevYellow)
        return 'in-guess'
      }
      
    }
  }
}


  const qwertyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  return (
    <div className="qwerty-keyboard">
      {qwertyRows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            let keyColor;
              if(!prevGreen.includes(key)){
                if(prevYellow.includes(key)){
                  keyColor = checkYellow(key);
                  
                }
                else if(prevGrey.includes(key)){
                  keyColor = 'not-included'
                }
                else{
                  keyColor = determineKeyColor(key);
                }
             }
            
              else{
                keyColor = 'correct'
              }

            return (
              <div
                key={key}
                className={`keyboard-key ${keyColor}`}
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default QwertyKeyboard;
