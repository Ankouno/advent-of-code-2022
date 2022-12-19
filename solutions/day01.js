const { loadInput, printSolution } = require('../shared/common');

const elves = loadInput('inputs/day01.txt')
  .split('\n\n').map(elf => elf.split('\n').map(Number))
  
const sums = elves
  .map(e => e.reduce((a, b) => a + b, 0))
  .sort((a, b) => b - a);

const firstSolution = () => sums[0];
const secondSolution = () => sums[0] + sums[1] + sums[2];

console.log("==[Day 1]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);