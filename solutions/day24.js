const { loadInput, printSolution } = require('../shared/common');
const { mod, lcm } = require('../shared/math');

const [N, S, W, E] = [1, 2, 4, 8];
const moveList = [['^', 0, -1], ['v', 0, 1], ['<', -1, 0], ['>', 1, 0], ['.', 0, 0]];

const initMap = loadInput('inputs/day24.txt').split('\n').slice(1, -1)
  .map(r => r.split('').slice(1, -1)
    .map(t => t == '.' ? 0 : 1<<"^v<>".indexOf(t)));

const width = initMap[0].length
const height = initMap.length;

/** Check if any wind is at the specified position and update it if so. */
const updateWind = (x, y, prevMap, nextMap) => {
  let wind = prevMap[y][x];
  if (wind == 0) return;
  for (let b = 1; b < 1<<4; b <<= 1) {
    switch (wind & b) {
      case N: nextMap[mod(y-1, height)][x] |= N; break;
      case S: nextMap[mod(y+1, height)][x] |= S; break;
      case W: nextMap[y][mod(x-1, width)]  |= W; break;
      case E: nextMap[y][mod(x+1, width)]  |= E; break;
    }
  }
}

/** Generate the next map iteration. */
const stepMap = (prevMap) => {
  let nextMap = new Array(height).fill(0).map(_ => new Array(width).fill(0));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      updateWind(x, y, prevMap, nextMap);
    }
  }
  return nextMap;
}

// generate all possible states of the wind
const mapList = [initMap.map(r => r.map(c => c))];
const cycleLength = lcm(width, height);
for (let i = 1; i < cycleLength; i++) {
  mapList[i] = stepMap(mapList[i-1]);
}

/**
 * Traverses the input map from a start point to an end point via BFS.
 * @param {int} t0 The initial time state for the traversal.
 */
const traverseMap = (start, end, t0) => {
  const initState = ['', ...start, t0]; // log, x, y, time
  const toCheck = [initState];
  const history = {};               // tracker for duplicate states
  history[initState.join('_')] = true;
  
  while (toCheck.length) {
    let [log, x, y, t] = toCheck.shift();
    t++;

    // add each potential move to the list to check
    const map = mapList[t % cycleLength];
    for (const [dir, dx, dy] of moveList) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx == end[0] && ny == end[1]) {
        // reached the end
        return t + 1
      }
      
      if (map[ny] ? map[ny][nx] == 0 : dir == '.') {
        let name = `${nx}_${ny}_${t}`;
        if (!history[name]) {
          history[name] = true;
          toCheck.push([log + dir, nx, ny, t]);
        }
      }
    }
  }
}

/** Get the time required to traverse the map from
 *  the top-left corner to the bottom-right corner. */
const firstSolution = () => traverseMap([0, -1], [width - 1, height - 1], 0);

/** Get the time required to traverse the map back and forth between
 *  the top-left corner and the bottom-right corner three times. */
const secondSolution = () =>
  traverseMap([0, -1], [width - 1, height - 1],
    traverseMap([width - 1, height], [0, 0],
      traverseMap([0, -1], [width - 1, height - 1], 0)));

console.log("==[Day 24]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);