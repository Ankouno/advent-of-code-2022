const { loadInput, printSolution } = require('../shared/common');

const rounds = loadInput('inputs/day2.txt').split('\n');

const firstSolution = () =>
  rounds.reduce((a, round) => {
    switch (round) {
      case 'A X': return a + 1 + 3;
      case 'B X': return a + 1 + 0;
      case 'C X': return a + 1 + 6;

      case 'A Y': return a + 2 + 6;
      case 'B Y': return a + 2 + 3;
      case 'C Y': return a + 2 + 0;

      case 'A Z': return a + 3 + 0;
      case 'B Z': return a + 3 + 6;
      case 'C Z': return a + 3 + 3;
    }
  }, 0);

const secondSolution = () => 
  rounds.reduce((a, round) => {
    switch (round) {
      case 'A X': return a + 3 + 0;
      case 'B X': return a + 1 + 0;
      case 'C X': return a + 2 + 0;

      case 'A Y': return a + 1 + 3;
      case 'B Y': return a + 2 + 3;
      case 'C Y': return a + 3 + 3;

      case 'A Z': return a + 2 + 6;
      case 'B Z': return a + 3 + 6;
      case 'C Z': return a + 1 + 6;
    }
  }, 0);

console.log("==[Day 2]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);