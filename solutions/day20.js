const { loadInput, printSolution } = require('../shared/common');

const input = loadInput('inputs/day20.txt').split('\n').map(n => new Number(n));

/**
 * Mixes a list of numbers by moving each individual number a number of places equal to its value.
 * Requires that the input be a list of *objects* rather than normal numbers, due to uniqueness requirements.
*/
const mix = (list, numberOfTimes) => {
  let mixed = [...list];
  for (let i = 0; i < numberOfTimes; i++) {
    list.forEach(n => {
      const index = mixed.indexOf(n);
      mixed.splice(index, 1);
      mixed.splice((index + n) % mixed.length, 0, n);
    });
  }
  return mixed;
}

/** Get the groove coordinates for the given list. */
const getCoordinates = (list) => {
  const zeroIndex = list.findIndex(n => n == 0);
  return list[(zeroIndex + 1000) % list.length]
       + list[(zeroIndex + 2000) % list.length]
       + list[(zeroIndex + 3000) % list.length];
}

/** Mix the input once. */
const firstSolution = () => getCoordinates(mix(input, 1));

/** Mix the input 10 times, with each number first multiplied by a given key. */
const secondSolution = () => getCoordinates(mix(input.map(n => new Number(n * 811589153)), 10));

console.log("==[Day 20]=========")
printSolution(1, firstSolution, 13);
printSolution(2, secondSolution, 13);