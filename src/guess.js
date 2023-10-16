import checker from './checker.js';
import generateWord from './App.js';

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

    const isCorrect = checker(userGuess, currentWord);

    if (isCorrect) {
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
