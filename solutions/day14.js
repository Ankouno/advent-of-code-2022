const { loadInput, printSolution } = require('../shared/common');

const CHAR_EMPTY = '.';
const CHAR_BLOCK = '█';
const CHAR_SAND = 'o';

const paths = loadInput('inputs/day14.txt').split('\n')
  .map(path => path.split(' -> ')
    .map(pos => pos.split(',').map(Number)));

// find bounds of map
let initWidth = 1000;
let initHeight = 0;
paths.forEach(path => path.forEach(pos => {
  if (pos[1] > initHeight) initHeight = pos[1];
}));
initHeight += 1;

// generate map
const initMap = new Array(initHeight).fill(0).map(_ => new Array(initWidth).fill(CHAR_EMPTY));
paths.forEach(path => {
  for (let i = 1; i < path.length; i++) {
    var a = path[i - 1];
    var b = path[i];
    if (a[0] != b[0]) {
      // horizontal line
      var y = a[1];
      if (a[0] > b[0]) { [a, b] = [b, a] };
      for (let x = a[0]; x <= b[0]; x++) {
        initMap[y][x] = CHAR_BLOCK;
      }
    } else {
      // vertical line
      var x = a[0];
      if (a[1] > b[1]) { [a, b] = [b, a] };
      for (let y = a[1]; y <= b[1]; y++) {
        initMap[y][x] = CHAR_BLOCK;
      }
    }
  }
});

/** Prints a map to the console for debugging. */
const printMap = (map) => {
  for (let y = 0; y < map.length; y++) {
    console.log(map[y].join(''));
  }
}

/**
 * Spawns a sand particle and simulates it until it settles.
 * @returns True if the particle settled at a point.
 *    False if it either fell out of the world, or couldn't spawn.
 */
const spawnSand = (map) => {
  let x = 500, y = 0;
  if (map[y][x] != CHAR_EMPTY) {
    // hole is plugged, can't spawn
    return false;
  }

  let width = map[0].length - 1;
  let height = map.length - 1;
  while (x > 0 && x < width && y < height) {
    if (map[y + 1][x] == CHAR_EMPTY) {
      y++;
    } else {
      if (map[y + 1][x - 1] == CHAR_EMPTY) {
        y++; x--;
      } else if (map[y + 1][x + 1] == CHAR_EMPTY) {
        y++; x++;
      } else {
        // settled into place
        map[y][x] = CHAR_SAND;
        return true;
      }
    }
  }
  // fell out of the world
  return false;
}

/** Count how much sand spawns before one falls out of the world. */
const firstSolution = () => {
  const map = initMap.map(row => [...row]);
  let spawnCount = 0;
  while (spawnSand(map)) {
    spawnCount++;
  }
  return spawnCount;
}

/** Spawn a floor, and then count how much sand falls before the spawn point is covered. */
const secondSolution = () => {
  const map = initMap.map(row => [...row]);
  map.push(new Array(initWidth).fill(CHAR_EMPTY));
  map.push(new Array(initWidth).fill(CHAR_BLOCK));
  let spawnCount = 0;
  while (spawnSand(map)) {
    spawnCount++;
  }
  return spawnCount;
}

console.log("==[Day 14]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);