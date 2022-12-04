const { loadInput, printSolution } = require('../shared/common');

const pairs = loadInput('inputs/day4.txt')
  .split('\n')
  .map(p => p
    .split(',')
    .map(e => e
      .split('-')
      .map(Number)
    )
  );
  
// check if both min and max of one elf is within the min/max of the other
const firstSolution = () => {
  return pairs.reduce((a, p) => {
    var x = p[0], y = p[1];
    return ((x[0] >= y[0] && x[1] <= y[1])
         || (y[0] >= x[0] && y[1] <= x[1])) + a;
  }, 0);
}

// check if min of one elf is within min/max of other
const secondSolution = () => {
  return pairs.reduce((a, p) => {
    var x = p[0], y = p[1];
    return ((x[0] >= y[0] && x[0] <= y[1])
         || (y[0] >= x[0] && y[0] <= x[1])) + a;
  }, 0);
}

console.log("==[Day 4]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);