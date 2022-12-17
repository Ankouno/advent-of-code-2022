const { loadInput, printSolution } = require('../shared/common');

const flowRates = {};
const tunnelGraph = {};

/** Load input and parse the flow rate for each node and a graph of all nodes. */
[...loadInput('inputs/day16.txt').matchAll(/.{6}(.{2}).{15}(\d+).{24}\s?(.+)/g)]
  .forEach(x => {
    var [name, flow, tunnels] = x.splice(1);
    flow = parseInt(flow);
    tunnels = tunnels.split(', ');
    if (flow > 0) flowRates[name] = flow;
    tunnelGraph[name] = tunnels;
  });

/** Find the minimum distance between two nodes. */
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

/** Get a graph of the flow valves and their distances. */
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

/** Get the total pressure relief measured by a log. */
const sumLog = (log) => log.reduce((s, [p, t]) => s + p * t, 0);

/** Find the maximum pressure possible from a given node, given the current state. */
const getMaxPressureLog = (pos, remaining, timer, flowRate = 0, pLog = []) => {
  timer -= 1;

  // special case for initial node
  if (pos == "AA") {
    return remaining.reduce((maxLog, valve) => {
      let dist = valveDistFromStart[valve];
      let newRemaining = remaining.filter(n => n != valve)
      let newLog = [[0, dist + 1]];
      newLog = getMaxPressureLog(valve, newRemaining, timer - dist, 0, newLog);
      return (sumLog(newLog) > sumLog(maxLog) ? newLog : maxLog);
    }, []);
  }

  // activate the new node
  flowRate += flowRates[pos];

  // figure out which node to visit next
  let maxLog = remaining.reduce((max, node) => {
    var dist = flowValveGraph[pos][node];
    let timeAfterMove = timer - dist;
    if (timeAfterMove <= 0) {
      return max;
    } else {
      let newRemaining = remaining.filter(n => n != node);
      let newLog = [...pLog, [flowRate, dist + 1]];
      newLog = getMaxPressureLog(node, newRemaining, timeAfterMove, flowRate, newLog);
      return (sumLog(newLog) > sumLog(max) ? newLog : max);
    }
  }, [...pLog, [flowRate, timer + 1]]);

  return maxLog;
}

/** Find the maximum pressure relief possible in 30 minutes. */
const firstSolution = () => {
  var log = getMaxPressureLog("AA", flowValves, 30);
  return sumLog(log);
};

/** Find the maximum pressure relief possible in 26 minutes with two concurrent actors. */
const secondSolution = () => {
  var max = 0;
  for (let i = 1; i < 2**(flowValves.length - 1); i++) {
    // partition the valves into two groups
    var [left, right] = flowValves.reduce((p, v, j) => {
      p[i >> j & 1].push(v);
      return p;
    }, [[], []]);

    // get the optimized pressure log for each group
    var lLog = getMaxPressureLog("AA", left, 26);
    var rLog = getMaxPressureLog("AA", right, 26);

    // calculate the total pressure relieved
    var li = 0, ri = 0
    var lt = lLog[0][1];
    var rt = rLog[0][1];
    var total = 0;
    for (let t = 0; t < 26; t++, lt--, rt--) {
      if (lt == 0) {
        li++;
        lt = lLog[li][1];
      }
      if (rt == 0) {
        ri++;
        rt = rLog[ri][1];
      }
      total += lLog[li][0] + rLog[ri][0];
    }

    if (total > max) {
      max = total;
    }
  }
  return max;
};

console.log("==[Day 16]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);