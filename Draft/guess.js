import generateWord from './wordGeneration.js';
import { checker, state } from './checker.js';

let currentWord = generateWord();
let maxGuesses = 6;
let correctGuesses = 0;

function validGuess(userGuess, dictionary) {
    if (userGuess.length !== currentWord.length) {
        return { error: 'Invalid guess length' };
    }
        
    if (!dictionary.includes(userGuess)) {
        return { error: 'Not in word list' };
    }

    checker(userGuess, currentWord, dictionary);

    if (userGuess === currentWord) {
        correctGuesses++;
        currentWord = generateWord();
        return {
            correctGuesses,
        };
    } else {
        maxGuesses--;

        if (maxGuesses === 0) {
            currentWord = generateWord();
            maxGuesses = 6;
            return {
                correctGuesses
            };
        }
    }
}

export default validGuess;

