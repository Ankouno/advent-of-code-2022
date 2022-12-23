const { loadInput, printSolution } = require('../shared/common');

const initMap = loadInput('inputs/day23.txt').split('\n')
  .map(line => line.split('')
    .map(t => t != '.' ? t : undefined));
    
const [N, S, W, E] = [0, 1, 2, 3];

/** Check whether the elf can move, and get the direction to move if so. */
const getPreferredMove = (map, x, y, pref) => {
  const nw = !map[y-1]?.[x-1];
  const n  = !map[y-1]?.[x];
  const ne = !map[y-1]?.[x+1];
  const w  = !map[y][x-1];
  const e  = !map[y][x+1];
  const sw = !map[y+1]?.[x-1];
  const s  = !map[y+1]?.[x];
  const se = !map[y+1]?.[x+1];
  if (ne & n & nw & w & e & se & s & sw) {
    return '#';
  }
  for (let i = pref; i < pref + 4; i++) {
    switch (i % 4) {
      case N: if (nw & n & ne) { return "N"; } break;
      case S: if (sw & s & se) { return "S"; } break;
      case W: if (nw & w & sw) { return "W"; } break;
      case E: if (ne & e & se) { return "E"; } break;
    }
  }
  return '#';
}

/** Modify the input map so that each elf marks its desired movement.
 *  @param {Number} pref Current preferred direction, 0 (N) 1 (S) 2 (W) or 3 (E) */
const getElfMoves = (map, pref) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (!map[y][x]) continue;
      map[y][x] = getPreferredMove(map, x, y, pref);
    }
  }
}

/** Try moving the elves in their preferred directions.
 *  @returns {bool} True if no move was made. */
const tryMoveElves = (map) => {
  // first check edges and see if we need to expand the map
  let width = map[0].length, height = map.length;
  if (map[0].find(t => t == 'N')) {
    map.unshift(new Array(width).fill(undefined));
    height++;
  }
  if (map[height - 1].find(t => t == 'S')) {
    map.push(new Array(width).fill(undefined));
    height++;
  }
  if (map.find(row => row[0] == 'W')) {
    map.forEach(row => row.unshift(undefined));
    width++;
  }
  if (map.find(row => row[width - 1] == 'E')) {
    map.forEach(row => row.push(undefined));
    width++;
  }
  
  // now test the elves and see which ones can move
  let moveWasMade = false;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      let up = map[y-1]?.[x] == 'S';
      let down = map[y+1]?.[x] == 'N';
      let left = map[y][x-1] == 'E';
      let right = map[y][x+1] == 'W';
      let canMove = (up + down + left + right == 1);
      if (up) map[y-1][x] = canMove ? undefined : '#';
      if (down) map[y+1][x] = canMove ? undefined : '#';
      if (left) map[y][x-1] = canMove ? undefined : '#';
      if (right) map[y][x+1] = canMove ? undefined : '#';
      if (canMove) {
        map[y][x] = '#';
        moveWasMade = true;
      }
    }
  }
  return moveWasMade;
}

/** Count the number of empty tiles inside the elves' bounding box. */
const countEmpty = (map) => {
  const minY = map.findIndex(row => row.find(t => t));
  const maxY = map.findLastIndex(row => row.find(t => t));
  let minX, maxX;
  for (let x = 0; x < map[0].length; x++) {
    if (map.find(row => row[x])) { minX = x; break; }
  }
  for (let x = map[0].length; x >= 0; x--) {
    if (map.find(row => row[x])) { maxX = x; break; }
  }
  
  let count = 0;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (!map[y][x]) count++;
    }
  }
  return count;
}

/** Find the number of empty tiles inside the elves' bounding box after 10 iterations. */
const firstSolution = () => {
  const map = initMap.map(r => r.map(c => c));
  for (let i = 0; i < 10; i++) {
    getElfMoves(map, i);
    tryMoveElves(map);
  }
  return countEmpty(map);
}

/** Find the iteration at which the elves stop moving. */
const secondSolution = () => {
  const map = initMap.map(r => r.map(c => c));
  for (let i = 0;; i++) {
    getElfMoves(map, i);
    if (!tryMoveElves(map)) {
      return i + 1;
    };
  }
}

console.log("==[Day 23]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);