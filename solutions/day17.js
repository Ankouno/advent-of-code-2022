const { loadInput, printSolution } = require('../shared/common');

const MAP_WIDTH = 7;
const SPAWN_X = 2;

const jets = loadInput('inputs/day17.txt').split('');
let jet_index = 0;

var rocks = [
  [[0, 0], [1, 0], [2, 0], [3, 0]],         // --
  [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], // +
  [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], // _|
  [[0, 0], [0, 1], [0, 2], [0, 3]],         // |
  [[0, 0], [0, 1], [1, 0], [1, 1]]          // []
];

/** Returns whether a position is blocked in a specified direction, or below. */
const isBlocked = (map, [x, y], dir) => {
  switch (dir) {
    case '<': return x == 0             || (map[y] && map[y][x - 1] == true);
    case '>': return x == MAP_WIDTH - 1 || (map[y] && map[y][x + 1] == true);
    default:  return y == 0             || (map[y - 1] && map[y - 1][x] == true);
  }
}

/** Simulate a specific rock being dropped into the map. */
const simulateRock = (map, rock) => {
  let x = SPAWN_X;
  let y = map.length + 3;

  for (;; jet_index++) {
    let dir = jets[jet_index % jets.length];
    if (!rock.find(([dx, dy]) => isBlocked(map, [dx + x, dy + y], dir))) {
      // rock has been pushed horizontally
      x += (dir == '<' ? -1 : 1);
    };
    if (!rock.find(([dx, dy]) => isBlocked(map, [dx + x, dy + y]))) {
      // rock has descended
      y--;
    } else {
      // rock has landed on something, add it to the map
      rock.forEach(([dx, dy]) => {
        var tx = x + dx, ty = y + dy;
        if (!map[ty]) { map[ty] = new Array(MAP_WIDTH).fill(false); }
        map[ty][tx] = true;
      });
      jet_index++;
      return;
    };
  }
}

/** Find the height of the rocks after 2022 rocks have dropped. */
const firstSolution = () => {
  let map = [];
  jet_index = 0;
  for (let i = 0; i < 2022; i++) {
    simulateRock(map, rocks[i % 5]);
  }
  return map.length;
}

/** Find the height of the rocks after 1 trillion have dropped. */
const secondSolution = () => {
  const ROCK_COUNT = 1000000000000;

  // Find a repeating interval of rocks.
  let loopInfo;
  let seen = {};
  let map = [];
  jet_index = 0;
  for (let i = 0; i < ROCK_COUNT; i++) {
    simulateRock(map, rocks[i % 5]);
    
    let mapHash = map.slice(-20).map(r => r.map(t => t ? "1" : "0").join('')).join('')
    let hash = [jet_index % jets.length, i % 5, mapHash].join('_');
    if (!seen[hash]) {
      seen[hash] = [i, map.length];
    } else {
      loopInfo = [seen[hash], [i, map.length], map.slice(-20)];
      break;
    }
  }

  // calculate the remaining height that needs to be simulated after all loops are skipped
  let [[start_i, start_height], [end_i, end_height], remainderMap] = loopInfo;
  let loopSize = end_i - start_i;
  let loopHeight = end_height - start_height;
  let loopCount = Math.floor((ROCK_COUNT - start_i) / loopSize);
  let remaining = (ROCK_COUNT - start_i) % loopSize;
  
  // simulate the remaining height, and return the total height calculation
  let remainderBase = remainderMap.length;
  for (let j = 1; j < remaining; j++) {
    simulateRock(remainderMap, rocks[(j + start_i) % 5]);
  }
  return start_height + loopHeight * loopCount + remainderMap.length - remainderBase;
}

console.log("==[Day 17]=========")
printSolution(1, firstSolution, 13);
printSolution(2, secondSolution, 13);