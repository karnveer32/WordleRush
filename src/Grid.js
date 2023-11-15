import React from 'react'
import Row from './row'

export default function Grid({ guesses, currentGuess, attempt, currentWord}) {
  console.log(guesses);
  return (
    <div>
      {guesses.map((g, i) => {
        if(attempt === i){
          return <Row key={i} currentGuess={currentGuess}/>
        }
        return <Row key={i} guess={g} currentWord = {currentWord}/> 
      }
      )}
      
    </div>
  )
}