import React from 'react';
import './App.css';

const HowToPlay = ({ onClose }) => {
  return (
    <div className="modal-overlay">
        <div className="modal-content">
            <div className="HowToPlay">
            <h2>Tutorial</h2>
                <h3> Getting Started </h3>
                <li> <strong>Select your Time: </strong>Choose your preferred time duration for each round</li>
                    <li> 30 Seconds </li>
                    <li> 60 Seconds </li>
                    <li> 90 Seconds </li>
                    <li> 120 Seconds </li>
                <h3> How to Play </h3>
                    <li> <strong>Objective: </strong>Guess as many words as possible within the given time limit. </li>
                    <li> <strong> Guessing Words: </strong> Type your guesses into the input box and press "Enter" to submit.
                        If your guess is correct, you move onto the next word. If not, you lose one of your
                        six attempts </li>
                    <li> <strong> Attempts: </strong> You have 6 attempts per word. Each incorrect word decreases your chances</li>
                    <li> <strong> Scoring: </strong> Every correct guess earns you one point. Try to score as many points as
                        you can before time runs out</li>
                <h3> Tips for Success </h3>
                    <li> <strong> Think Fast: </strong> The clock is ticking! Try to come up with words quickly to maximize
                        your score </li>
                    <li> <strong> Be Strategic: </strong> Use the timer wisely, you may need to adjust your pace based
                        on the time left</li>
                <h3> End of Game </h3> 
                    <li> <strong> Game Over: </strong> After the timer runs out, the game is over and you have the opportunity to see 
                        your stats. </li>
                    <li> <strong> Try Again: </strong> Feel free to start a new game and challenge yourself to beat your previous score </li>
            <button className="close" onClick={(onClose)}>X</button>
            </div>
        </div>
    </div>
  );
};

export default HowToPlay;
