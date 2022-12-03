const { loadInput, printSolution } = require('../shared/common');
const { intersection } = require('lodash');

const sacks = loadInput('inputs/day3.txt').split('\n');

const letterToVal = (x) => x.charCodeAt(0) + (x == x.toLowerCase() ? 1 - 97 : 27 - 65);

// split each bag in half, find intersection of two halves, sum total value
const firstSolution = () => {
  return sacks.map(x => intersection(
    x.substring(0, x.length / 2).split(''), 
    x.substring(x.length / 2).split('')
  )).reduce((a, x) =>
    a + x.reduce((b, y) => 
      b + letterToVal(y),
    0),
  0);
}

// find intersection of each group of 3 bags, sum total value
const secondSolution = () => {
  var badges = [];
  for (var i = 0; i < sacks.length; i += 3) {
    badges.push(intersection(
      sacks[i].split(''),
      sacks[i + 1].split(''),
      sacks[i + 2].split('')
    )[0]);
  }
  
  return badges.reduce((a, b) => a + letterToVal(b), 0);
}

console.log("==[Day 3]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);