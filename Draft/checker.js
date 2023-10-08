function checker(guess, goal, dictionary) {

    //const row = state.currentRow;

    for (let i = 0; i < dictionary.length; i++){

	if (dictionary[i] == guess)
	    continue;
	else
	    return 'wrong'; 
    }
	    
    for (let i=0; i<5; i++){

	//const box = document.getElementById('box${row}${i}');

	if (guess[i] == goal[i])
	    //box.classList.add('green');
	    return 'green'; 
	    
	else if (goal.includes(guess[i]))
	    //box.classList.add('yellow');
	    return 'yellow'; 
	
	else 
	    //box.classList.add('grey');
	    return 'grey';
    }
} 
