let txt = ["hello", "world", "this", "is", "a", "test"];
let generatedWords = [];

function wordGeneration(txt) {
    let num = Math.floor(Math.random() * txt.length); // Generate a random index

    let word = txt[num]; // Access the word from txt

    if (!generatedWords.includes(word)) {
        generatedWords.push(word);
        console.log(word);
    } else {
        console.log(word + " was already generated.");
    }

    console.log(generatedWords); // Display the array of words that have already been generated
}

function main() {
    for (let i = 0; i < 5; i++) {
        wordGeneration(txt);
    }
}

main();
