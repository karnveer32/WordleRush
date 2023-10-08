// GUESS FEATURE 

// intialize parameters
let maxGuesses = 6;
let currentGuesses = maxGuesses;
let correctWordsCount = 0;      // counter
let wordList = loadWordList();  
let currentWord = wordGenerator();  // correct word for each round

function loadWordList() { // load the list of words from txt file (Sim)
    // assume words are hardcoded in an array
    return ["apple", "grape", "peach", ...]; 
}

function takeUserGuess() {  
    let userGuess = prompt("Enter your guess: ");

    // the length of the user's guess is checked
    if (userGuess.length !== 5) {
        alert("Invalid guess length");
        return;
    }

    // the user's guess is checked against the word list to ensure its a valid word
    if (!isValidWord(userGuess)) {
        alert("Not in word list");
        return;
    }

    // call checker function to check user's guess against current word (Sai)
    let isCorrect = checker(userGuess, currentWord);

    if (!isCorrect) {   // FALSE
        currentGuesses--;       // if guess is incorrect, decrement the number of remaining guesses
    } else {    // TRUE
        correctWordsCount++;   // if guess is correct, increment the count of correct words
        alert(${correctWordsCount});
        currentWord = wordGenerator(); // call word generator to get a new word
    }

    // if guesses reach 0, a new word is generated and guess count is reset
    if (currentGuesses <= 0) {
        currentWord = wordGenerator();
        currentGuesses = maxGuesses;
    }
}

function isValidWord(word) {
    // checks if the provideda word is in the array of words
    return wordList.includes(word);
}

function checker(userGuess, correctWord) {
    // function will check if the guess is correct and update
    // detailed letter by letter checking
}

function wordGenerator() {
    // function will generate and return a new word from the word list when called
    
}

// main loop
while (true) {
    takeUserGuess();
}


