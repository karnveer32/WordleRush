//game state

/*const state = {
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    currentRow: 0,
    currentcol: 0,
};*/

/*function updateState() { 
    for (let i = 0; i < state.grid.length; i++) {
		for (let j = 0; j < state.grid[i].length; j++) {
	    	const box = document.getElementById(`box${i}${j}`); //works with POST
	    	box.content = state.grid[i][j]; 
		}
    }
}*/

function checker(guess, goal) {
	/*for (let i = 0; i < 5; i++) {
		const box = document.getElementById(`box${state.currentRow}${i}`);

		if (guess[i] === goal[i]) {
	    	box.classList.add('green'); //needs to work with CSS style sheet
	    	//return 'green'; 
		}
		else if (goal.includes(guess[i])) {
	    	box.classList.add('yellow');
	    	//return 'yellow'; 
		}
		else {
	    	box.classList.add('grey');
	   	// return 'grey';
    	}
	}*/
	return guess === goal;
}
export default checker;
