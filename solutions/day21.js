const { loadInput, printSolution } = require('../shared/common');

const initMonkeys = Object.fromEntries(
  loadInput('inputs/day21.txt').split('\n').map(line => {
    line = line.split(": ")
    line[1] = isNaN(line[1]) ? line[1].split(' ') : +line[1];
    return line;
  })
);

/** Perform search-and-replace for each requested value. */
const getNodeValue = (monkeys, node = "root") => {
  const val = monkeys[node];
  if (typeof(val) == 'number') {
    return val;
  } else {
    let [left, op, right] = val;
    left = getNodeValue(monkeys, left);
    right = getNodeValue(monkeys, right);
    switch (op) {
      case "+": return left + right;
      case "-": return left - right;
      case "*": return left * right;
      case "/": return left / right;
      case "=": return left - right;
    }
  }
}

/** Parse the initial monkeys and return the total. */
const firstSolution = () => getNodeValue(initMonkeys);

/**
 * Change the "root" node to an equality and then use a binary
 * search to find a value for the "humn" node that makes it valid.
 */
const secondSolution = () => {
  let monkeys = JSON.parse(JSON.stringify(initMonkeys));
  monkeys["root"][1] = "=";
  
  // determine the directional relationship for the value of x
  monkeys["humn"] = 1;
  const test1 = getNodeValue(monkeys);
  monkeys["humn"] = 2;
  const test2 = getNodeValue(monkeys);
  const isPositive = test2 > test1;

  // use binary search to find x
  let [min, max] = [0, 1e16];
  while (true) {
    let x = Math.floor((min + max) / 2);
    monkeys["humn"] = x;

    let result = getNodeValue(monkeys);
    if (result == 0) {
      return x;
    } else if (isPositive ? result > 0 : result < 0) {
      max = x;
    } else {
      min = x;
    }
  }
}

console.log("==[Day 21]=========")
printSolution(1, firstSolution, 14);
printSolution(2, secondSolution, 14);