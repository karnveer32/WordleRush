// QwertyKeyboard.js
import React from 'react';

const QwertyKeyboard = ({ onKeyPress, guessHistory, currentWord, currentGuess }) => {
  const handleKeyPress = (key) => {
    onKeyPress(key);
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
            const isInGuess = guessHistory.includes(key) && currentWord.includes(key);
            const Press = currentGuess && currentGuess.includes(key);

            return (
              <div
                key={key}
                className={`keyboard-key ${isInGuess ? 'in-guess' : ''} ${Press ? 'press' : ''}`}
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

