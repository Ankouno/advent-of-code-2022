const { loadInput, printSolution } = require('../shared/common');

const pairs = loadInput('inputs/day13.txt').split('\n\n')
  .map(pair => pair.split('\n')
    .map(packet => JSON.parse(packet)));

/** Check whether a pair of packets is in the correct order. */
const inCorrectOrder = (a, b) => {
  for (let i = 0; i < a.length; i++) {
    if (i >= b.length) {
      // b ran out of items first
      return false;
    }

    var aVal = a[i];
    var bVal = b[i];
    var aIsNum = typeof(aVal) == 'number';
    var bIsNum = typeof(bVal) == 'number';
    if (aIsNum && bIsNum) {
      // both numeric, if not equal then return whether a is less than b
      if (aVal != bVal) {
        return aVal < bVal;
      };
    } else {
      // turn both into lists, and if those lists aren't equal then return if they're in order
      if (aIsNum) aVal = [aVal];
      if (bIsNum) bVal = [bVal];
      if (JSON.stringify(aVal) != JSON.stringify(bVal)) {
        return inCorrectOrder(aVal, bVal);
      }
    }
  }
  // no issues encountered
  return true;
}

/** Sum the indices of pairs that have their packets in the correct order. */
const firstSolution = () =>
  pairs.reduce(
    (count, pair, i) => count + (inCorrectOrder(pair[0], pair[1]) ? i + 1 : 0),
    0
  );

/**
 * Add two divider packets, sort all the packets together,
 * and then return the product of the new indices of the dividers.
 */
const secondSolution = () => {
  var divA = [[2]], divB = [[6]];
  var packets = pairs.flat();
  packets.push(divA, divB);
  packets.sort((a, b) => inCorrectOrder(a, b) ? -1 : 1);
  return (packets.indexOf(divA) + 1) * (packets.indexOf(divB) + 1);
}

console.log("==[Day 13]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);