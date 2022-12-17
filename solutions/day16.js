const { loadInput, printSolution } = require('../shared/common');

const flowRates = {};
const tunnelGraph = {};

/** Load input, get the flow rate for each node, and construct a graph of all nodes. */
[...loadInput('inputs/day16.txt').matchAll(/.{6}(.{2}).{15}(\d+).{24}\s?(.+)/g)]
  .forEach(x => {
    var [name, flow, tunnels] = x.splice(1);
    flow = parseInt(flow);
    tunnels = tunnels.split(', ');
    if (flow > 0) flowRates[name] = flow;
    tunnelGraph[name] = tunnels;
  });

/** Calculate the minimum distance between two nodes. */
const getDistance = (start, end) => {
  let distances = {};
  distances[start] = 0;
  let toCheck = tunnelGraph[start].map(n => [n, 1]);
  while (toCheck.length > 0) {
    let [valve, dist] = toCheck.shift();
    if (valve == end) {
      return dist;
    }
    
    let prevDist = distances[valve];
    if (isNaN(prevDist) || prevDist > dist) {
      distances[valve] = dist;
      toCheck.push(...tunnelGraph[valve].map(n => [n, dist + 1]));
    }
  }
}

/** Get a graph of the flow valves and their distances from each other. */
const flowValves = Object.keys(flowRates);
const flowValveGraph = {};
flowValves.forEach(name => {
  flowValveGraph[name] = Object.fromEntries(
    flowValves.filter(v => v != name).map(v => [v, getDistance(name, v)]
  ));
});

/** Get a list of each flow valve's distance from the start */
const valveDistFromStart = Object.fromEntries(
  flowValves.map(v => [v, getDistance("AA", v)])
);

/** Find the maximum pressure possible from a given node, given the current state. */
const getMaxPressure = (pos, remaining, timer, flowRate = 0, pressure = 0) => {
  timer -= 1;

  // special case for initial node
  if (pos == "AA") {
    return remaining.reduce((maxPressure, valve) => {
      let dist = valveDistFromStart[valve];
      let newRemaining = remaining.filter(n => n != valve)
      pressure = getMaxPressure(valve, newRemaining, timer - dist);
      return Math.max(pressure, maxPressure);
    }, []);
  }

  // activate the new node
  flowRate += flowRates[pos];

  // figure out which node to visit next
  let maxPressure = remaining.reduce((maxPressure, node) => {
    var dist = flowValveGraph[pos][node];
    let timeAfterMove = timer - dist;
    if (timeAfterMove <= 0) {
      return maxPressure;
    } else {
      let newRemaining = remaining.filter(n => n != node);
      let newPressure = pressure + flowRate * (dist + 1);
      newPressure = getMaxPressure(node, newRemaining, timeAfterMove, flowRate, newPressure);
      return Math.max(newPressure, maxPressure);
    }
  }, pressure + flowRate * (timer + 1));

  return maxPressure;
}

/** Find the maximum pressure relief possible in 30 minutes. */
const firstSolution = () => getMaxPressure("AA", flowValves, 30);

/** Find the maximum pressure relief possible in 26 minutes with two concurrent actors. */
const secondSolution = () => {
  var max = 0;
  for (let i = 1; i < 2**(flowValves.length - 1); i++) {
    // partition the valves into two groups
    var [left, right] = flowValves.reduce((p, v, n) => {
      p[i >> n & 1].push(v);
      return p;
    }, [[], []]);

    // get the maximum pressure for each group
    var total = getMaxPressure("AA", left, 26) + getMaxPressure("AA", right, 26);
    if (total > max) { max = total; }
  }
  return max;
};

console.log("==[Day 16]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);