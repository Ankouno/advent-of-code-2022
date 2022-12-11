const { loadInput, printSolution } = require('../shared/common');

const initMonkeys = loadInput('inputs/day11.txt').split('\n\n').map(m => {
  var monkey = /.*[^\d]+([^\n]+)[^=]+= ([^\n]+)[^\d]+(\d+)[^\d]+(\d+)[^\d]+(\d+)/.exec(m).slice(1);
  monkey[0] = monkey[0].split(', ').map(Number); // starting items
  monkey[1] = monkey[1].split(' '); // operation
  monkey[2] = parseInt(monkey[2]);  // divisibility test
  monkey[3] = parseInt(monkey[3]);  // monkey to throw to if true
  monkey[4] = parseInt(monkey[4]);  // monkey to throw to if false
  monkey[5] = 0;                    // inspection count
  return monkey;
});

const gcd = (a, b) => !b ? a : gcd(b, a % b);
const lcm = (a, b) => (a * b) / gcd(a, b);
const lcmArray = (array) => array.reduce((a, b) => lcm(a, b), 1);
const worryModulator = lcmArray(initMonkeys.map(m => m[2]));

/**
 * Execute the specified number of rounds on the monkeys.
 * @param {array} monkeys
 * @param {number} roundCount
 * @param {boolean} modulateWorry Flag for how to reduce worry levels after each inspection.
 *   - False: worry levels will be reduced by 1/3rd.
 *   - True:  worry levels will be modulated by the LCM of the monkey divisibility tests.
 * @returns The inspection counts for the two monkeys with the highest counts, multiplied together.
 */
const executeRounds = (monkeys, roundCount, modulateWorry) => {
  for (var round = 0; round < roundCount; round++) {
    monkeys.forEach(monkey => {
      let [items, [opArg1, op, opArg2], divTest, ifTrue, ifFalse] = monkey;
      while (items.length > 0) {
        // increment inspection count
        monkey[5] += 1;

        // update worry level
        var worryLevel = items.shift();
        var arg1 = (opArg1 == 'old' ? worryLevel : parseInt(opArg1));
        var arg2 = (opArg2 == 'old' ? worryLevel : parseInt(opArg2));
        worryLevel = eval(arg1 + op + arg2);
        if (!modulateWorry) {
          worryLevel = Math.floor(worryLevel / 3);
        } else {
          worryLevel %= worryModulator;
        }

        // throw to new monkey
        var throwTo = (worryLevel % divTest == 0 ? ifTrue : ifFalse);
        monkeys[throwTo][0].push(worryLevel);
      }
    });
  }

  // get the top two inspection counts, and return the multiplied together.
  var inspectionCounts = monkeys.map(m => m[5]).sort((a, b) => b - a);
  return inspectionCounts[0] * inspectionCounts[1];
}

/** Deep-clone the initial monkey data. */
const cloneInitMonkeys = () => initMonkeys.map(m => m.map(x => typeof(x) == 'object' ? [...x] : x));

const firstSolution =  () => executeRounds(cloneInitMonkeys(), 20, false);
const secondSolution = () => executeRounds(cloneInitMonkeys(), 10000, true);

console.log("==[Day 11]=========")
printSolution(1, firstSolution,  12);
printSolution(2, secondSolution, 12);