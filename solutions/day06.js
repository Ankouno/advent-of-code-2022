const { loadInput, printSolution } = require('../shared/common');

const input = loadInput('inputs/day06.txt');

const findMarker = (size) => {
  for (let i = 0; true; i++) {
    let p = input.slice(i, i + size);
    if (new Set(p).size == size) {
      return i + size;
    }
  }
}

const firstSolution = () => {
  return findMarker(4);
}

const secondSolution = () => {
  return findMarker(14);
}

console.log("==[Day 6]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);