const { loadInput, printSolution } = require('../shared/common');

let startPoint, endPoint;
const map = loadInput('inputs/day12.txt').split('\n')
  .map((r, y) => r.split('')
    .map((c, x) => {
      if (c == 'S') {
        startPoint = `${x}_${y}`;
        c = 'a';
      } else if (c == 'E') {
        endPoint = `${x}_${y}`;
        c = 'z';
      }
      return c.charCodeAt() - 97;
    }));

const mapWidth = map[0].length;
const mapHeight = map.length;

/** Returns whether a point can be traversed to, based on the current height. */
const canStep = (curr, x, y) => (map[y][x] - curr) <= 1;

/** Obtain a list of neighboring points that can be traversed to. */
const getNeighbors = (point, distances) => {
  let [x, y] = point.split('_').map(Number);
  let dist = distances[point] + 1;
  let height = map[y][x];
  let dirs = [];
  if (x > 0 && canStep(height, x-1, y)) {
    var nPoint = `${x-1}_${y}`;
    if (isNaN(distances[nPoint]) || distances[nPoint] > dist)
      dirs.push([nPoint, dist]);
  }
  if (y > 0 && canStep(height, x, y-1)){
    var nPoint = `${x}_${y-1}`;
    if (isNaN(distances[nPoint]) || distances[nPoint] > dist)
      dirs.push([nPoint, dist]);
  }
  if (x < mapWidth - 1 && canStep(height, x+1, y)){
    var nPoint = `${x+1}_${y}`;
    if (isNaN(distances[nPoint]) || distances[nPoint] > dist)
      dirs.push([nPoint, dist]);
  }
  if (y < mapHeight - 1 && canStep(height, x, y+1)){
    var nPoint = `${x}_${y+1}`;
    if (isNaN(distances[nPoint]) || distances[nPoint] > dist)
      dirs.push([nPoint, dist]);
  }
  return dirs;
}

/** Implementation of A-Star to find the shortest distance to the goal using a given start point. */
const aStar = (start) => {
  let distances = {};
  distances[start] = 0;
  let toCheck = getNeighbors(start, distances);
  while (toCheck.length > 0) {
    let [point, dist] = toCheck.shift();
    if (point == endPoint) {
      return dist;
    }
    
    let prevDist = distances[point];
    if (isNaN(prevDist) || prevDist > dist) {
      distances[point] = dist;
      toCheck.push(...getNeighbors(point, distances));
    }
  }
}

/** Find the shortest path from the given start point. */
const firstSolution = () => {
  return aStar(startPoint);
}

/** Find the point with a height of 'a' that results in the shortest possible path. */
const secondSolution = () => {
  var minHeight = 'a'.charCodeAt() - 97;
  var minPath = Infinity;
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y][x] == minHeight) {
        var pathLength = aStar(`${x}_${y}`);
        if (pathLength < minPath)
          minPath = pathLength;
      }
    }
  }
  return minPath;
}

console.log("==[Day 12]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);