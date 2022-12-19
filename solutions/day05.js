const { loadInput, printSolution } = require('../shared/common');

const input = loadInput('inputs/day05.txt').split('\n\n');
const commands = input[1].split('\n').map(c => c.match(/\d+/g).map(Number));

const crates = input[0]
  .split('\n').slice(0, -1)
  .map(r => r.match(/.[A-Z\s].\s?/g).map(x => x[1]));

const inStacks = Array.from(Array(crates[0].length), () => [])
for (var y = 0; y < crates.length; y++) {
  var row = crates[y];
  for (var x = 0; x < row.length; x++) {
    if (row[x] != ' ') {
      inStacks[x].push(row[x]);
    }
  }
}

// move crates one at a time
const firstSolution = () => {
  var stacks = inStacks.map(s => s.slice());
  commands.forEach(([count, src, dest]) => {
    for (var i = 0; i < count; i++) {
      stacks[dest - 1].unshift(stacks[src - 1].shift());
    }
  });
  return stacks.map(s => s[0]).join('');
}

// move crates in bulk
const secondSolution = () => {
  var stacks = inStacks.map(s => s.slice());
  commands.forEach(([count, src, dest]) => {
    stacks[dest - 1].unshift(...stacks[src - 1].splice(0, count));
  });
  return stacks.map(s => s[0]).join('');
}

console.log("==[Day 5]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);