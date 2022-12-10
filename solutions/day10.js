const { loadInput, printSolution } = require('../shared/common');

const CRT_0 = '..';
const CRT_1 = '██';

const opcodes = loadInput('inputs/day10.txt').split('\n').map(o => o.split(' '));
opcodes.forEach(o => o[1] = parseInt(o[1]));

/** Record a signal if applicable. */
const recordSignal = (log, cycle, x) => {
  if (cycle % 40 == 20) { log.push(x * cycle); }
};

/** Set the CRT's pixel based on the current cycle and sprite position. */
const setCrtPixel = (crt, cycle, x) => {
  var row = Math.floor(cycle / 40);
  var col = cycle % 40;
  crt[row][col] = (col >= (x - 1) && col <= (x + 1)) ? CRT_1 : CRT_0;
};

const firstSolution = () => {
  let log = [];
  let cycle = 0, x = 1;
  opcodes.forEach(([opcode, arg]) => {
    cycle += 1;
    recordSignal(log, cycle, x);
    if (opcode == 'addx') {
      cycle += 1;
      recordSignal(log, cycle, x);
      x += arg;
    }
  });
  
  return log.reduce((a, s) => a + s, 0);
}

const secondSolution = () => {
  const crt = Array(6).fill(0).map(_ => Array(40).fill('.'));
  var cycle = 0, x = 1;
  opcodes.forEach(([opcode, arg]) => {
    setCrtPixel(crt, cycle, x);
    cycle += 1;
    if (opcode == 'addx') {
      setCrtPixel(crt, cycle, x);
      cycle += 1;
      x += arg;
    }
  });

  return "\n" + crt.map(r => r.join('')).join('\n');
}

console.log("==[Day 10]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);