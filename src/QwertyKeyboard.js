import React, { useState, useEffect } from 'react';

const QwertyKeyboard = ({ onKeyPress, guessHistory, currentWord, attempts }) => {
  const [prevGreen, setPrevGreen] = useState([]);
  const [prevYellow, setPrevYellow] = useState([]);
  const [prevGrey, setPrevGrey] = useState([]);

  useEffect(() => {
    determineKeyColors();
  }, [currentWord, guessHistory]); //re-evaluate the coloring for each guessHistory entry (only yellow)

  useEffect(() => {
      // Reset key colors when currentWord changes (All colors)
    setPrevGreen([]);
    setPrevYellow([]);
    setPrevGrey([]);
  }, [currentWord]);


  const handleKeyPress = (key) => {
    onKeyPress({ key });
  };

  const determineKeyColors = () => {
    if (!guessHistory || !currentWord) {
      return;
    }

    const lastGuessedWord = guessHistory.reduceRight((acc, current) => {
      if (current !== undefined && acc === undefined) {
        return current;
      }
      return acc;
    }, undefined);

    if (lastGuessedWord !== undefined && lastGuessedWord.length === currentWord.length) {
      const newGreen = [...prevGreen];
      const newYellow = [...prevYellow];
      const newGrey = [...prevGrey];

      for (let i = 0; i < lastGuessedWord.length; i++) {
        const guessedLetter = lastGuessedWord[i];
        const currentLetter = currentWord[i];

        if (guessedLetter === currentLetter && !prevGreen.includes(guessedLetter)) {
          newGreen.push(guessedLetter);
          const index = newYellow.indexOf(guessedLetter);
          if (index !== -1) {
            newYellow.splice(index, 1);
          }
        } else if (currentWord.includes(guessedLetter) && !prevGreen.includes(guessedLetter) && !prevYellow.includes(guessedLetter)) {
          newYellow.push(guessedLetter);
          const index = newGrey.indexOf(guessedLetter);
          if (index !== -1) {
            newGrey.splice(index, 1);
          }
        } else if (!prevGreen.includes(guessedLetter) && !prevYellow.includes(guessedLetter) && !prevGrey.includes(guessedLetter)) {
          newGrey.push(guessedLetter);
        }
      }

      setPrevGreen(newGreen);
      setPrevYellow(newYellow);
      setPrevGrey(newGrey);
    }
  };

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
            let keyColor = '';

            if (prevGreen.includes(key)) {
              keyColor = 'correct';
            } else if (prevYellow.includes(key)) {
              keyColor = 'in-guess';
            } else if (prevGrey.includes(key)) {
              keyColor = 'not-included';
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