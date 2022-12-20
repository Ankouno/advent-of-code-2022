const { loadInput, printSolution } = require('../shared/common');

const input = loadInput('inputs/day20.txt').split('\n').map(n => new Number(n));

/**
 * Mixes a list of numbers by moving each individual number a number of places equal to its value.
 * Requires that the input be a list of *objects* rather than normal numbers, due to uniqueness requirements.
*/
const mix = (input, numberOfTimes) => {
  let mixed = [...input];
  for (let i = 0; i < numberOfTimes; i++) {
    input.forEach(n => {
      const index = mixed.indexOf(n);
      mixed.splice(index, 1);
      mixed.splice((index + n) % mixed.length, 0, n);
    });
  }
  return mixed;
}

/** Mix the input once. */
const firstSolution = () => {
  const output = mix(input, 1);
  const zeroIndex = output.findIndex(n => n == 0);
  return output[(zeroIndex + 1000) % output.length]
       + output[(zeroIndex + 2000) % output.length]
       + output[(zeroIndex + 3000) % output.length];
}

/** Mix the input 10 times, with each number first multiplied by a given key. */
const secondSolution = () => {
  let output = mix(input.map(n => new Number(n * 811589153)), 10);
  const zeroIndex = output.findIndex(n => n == 0);
  return output[(zeroIndex + 1000) % output.length]
       + output[(zeroIndex + 2000) % output.length]
       + output[(zeroIndex + 3000) % output.length];
}

console.log("==[Day 20]=========")
printSolution(1, firstSolution, 13);
printSolution(2, secondSolution, 13);