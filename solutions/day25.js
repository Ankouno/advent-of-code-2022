const { loadInput, printSolution } = require('../shared/common');

/** Convert each SNAFU number to its decimal equivalent */
const numbers = loadInput('inputs/day25.txt').split('\n')
  .map(num => num.split('').reduce((n, d) => n*5 + (2 - "210-=".indexOf(d)), 0));
  
/** Get the sum of all the input numbers, then convert that back to a SNAFU number */
const firstSolution = () => {
  let total = numbers.reduce((a, n) => a + n, 0);
  let digits = [];
  while (total != 0) {
    let digit = total % 5;
    if (digit == 3) { digit = '='; total += 2; }
    if (digit == 4) { digit = '-'; total += 1; }
    digits.unshift(digit);
    total = Math.floor(total / 5);
  }
  return digits.join('');
};

console.log("==[Day 25]=========")
printSolution(1, firstSolution);