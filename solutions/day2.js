const { loadInput, printSolution } = require('../shared/common');

const rounds = loadInput('inputs/day2.txt')
  .split('\n')
  .map(round => round.split(' '));

const firstSolution = () =>
  rounds.reduce((a, round) => {
    switch (round[0] + round[1]) {
      case 'AX': return a + 1 + 3;
      case 'BX': return a + 1 + 0;
      case 'CX': return a + 1 + 6;

      case 'AY': return a + 2 + 6;
      case 'BY': return a + 2 + 3;
      case 'CY': return a + 2 + 0;

      case 'AZ': return a + 3 + 0;
      case 'BZ': return a + 3 + 6;
      case 'CZ': return a + 3 + 3;
    }
  }, 0);

const secondSolution = () => 
  rounds.reduce((a, round) => {
    switch (round[0] + round[1]) {
      case 'AX': return a + 3 + 0;
      case 'BX': return a + 1 + 0;
      case 'CX': return a + 2 + 0;

      case 'AY': return a + 1 + 3;
      case 'BY': return a + 2 + 3;
      case 'CY': return a + 3 + 3;

      case 'AZ': return a + 2 + 6;
      case 'BZ': return a + 3 + 6;
      case 'CZ': return a + 1 + 6;
    }
  }, 0);

console.log("==[Day 2]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);