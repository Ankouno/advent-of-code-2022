const { loadInput, printSolution } = require('../shared/common');

/** Convert each SNAFU number to its decimal equivalent */
const numbers = loadInput('inputs/day25.txt').split('\n')
  .map(num => num.split('').reduce((n, d) => n*5 + (2 - "210-=".indexOf(d)), 0));
  
/** Get the sum of all the input numbers, then convert that back to a SNAFU number */
const firstSolution = () => {
  let sum = numbers.reduce((a, n) => a + n, 0);
  let digits = [];
  while (sum != 0) {
    sum += 2;
    digits.unshift("=-012"[sum % 5]);
    sum = Math.floor(sum / 5);
  }
  return digits.join('');
};

console.log("==[Day 25]=========")
printSolution(1, firstSolution);