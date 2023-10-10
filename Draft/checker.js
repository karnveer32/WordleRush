//game state
const state = {
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    cuurentRow: 0,
    currentcol: 0,
};

function updateState() { 

    for (let i = 0; i< state.grid.length; i++) {
	for (let j = 0; i < state.grid[i].length; j++) {
	    const box = document.getElementById('box${i}${j}'); //works with POST
	    box.content = state.grid[i][j]; 
	}
    }
}


function checker(guess, goal, dictionary) {

    const row = state.currentRow;

    for (let i = 0; i < dictionary.length; i++){

	if (dictionary[i] == guess)
	    continue;
	else
	    return;  
    }
	    
    for (let i=0; i<5; i++){

	const box = document.getElementById('box${row}${i}'); //works with POST

	if (guess[i] == goal[i])
	    box.classList.add('green'); //needs to work with CSS style sheet
	    //return 'green'; 
	    
	else if (goal.includes(guess[i]))
	    box.classList.add('yellow');
	    //return 'yellow'; 
	
	else 
	    box.classList.add('grey');
	   // return 'grey';
    }
} 
