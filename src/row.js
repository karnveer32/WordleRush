import React from 'react'

export default function Row({ guess, currentGuess, currentWord }) {

  if (guess) {
    const letters = typeof guess === 'string' ? guess.split('') : [];
    console.log(letters)
    return (
      <div className="row">
        {letters.map((letter, index) => (
          <div key={index} className={`filled box ${getBoxColor(letter, index, currentWord)}`}>{letter}</div>
        ))}
      </div>
    );
  }

  if (currentGuess) {
    const letters = currentGuess.split('')

    return (
      <div className="row current">
        {letters.map((letter, i) => (
          <div key={i} className="filled">{letter}</div>
        ))}
        {[...Array(5 - letters.length)].map((_,i) => (
          <div key={i}></div>
        ))}
      </div>
    )
}
  return (
    <div className="row">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
  
}

function getBoxColor(letter, index, currentWord) {
  if (letter === currentWord[index]) {
    return 'green';
  } else if (currentWord.includes(letter)) {
    return 'yellow';
  } else {
    return 'grey';
  }
}