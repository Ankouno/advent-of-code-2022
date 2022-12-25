const { loadInput, printSolution } = require('../shared/common');
const { mod } = require('../shared/math');

// Solution is hardcoded for my input, so may not work for every input.

const [R, D, L, U] = [0, 1, 2, 3];
const deltas = [[1, 0], [0, 1], [-1, 0], [0, -1]];

let [map, path] = loadInput('inputs/day22.txt').split('\n\n');
map = map.split('\n').map(row => row.split('').map(t => t == ' ' ? undefined : t));
path = path.match(/\d+|\w/g);

/** Cube wrapping rules for part 2, indexed by the current direction.
 *  Each rule contains a max X/Y test and a function to get a new position. */
const wraps = [
  [ // R
    [[Infinity,  50], (x, y) => [99, 149 - y, L]],
    [[Infinity, 100], (x, y) => [y + 50, 49, U]],
    [[Infinity, 150], (x, y) => [149, 149 - y, L]],
    [[Infinity, 200], (x, y) => [y - 100, 149, U]]
  ],
  [ // D
    [[ 50, Infinity], (x, y) => [x + 100, 0, D]],
    [[100, Infinity], (x, y) => [49, x + 100, L]],
    [[150, Infinity], (x, y) => [99, x - 50, L]]
  ],
  [ // L
    [[Infinity,  50], (x, y) => [0, 149 - y, R]],
    [[Infinity, 100], (x, y) => [y - 50, 100, D]],
    [[Infinity, 150], (x, y) => [50, 149 - y, R]],
    [[Infinity, 200], (x, y) => [y - 100, 0, D]],
  ],
  [ // U
    [[ 50, Infinity], (x, y) => [50, x + 50, R]],
    [[100, Infinity], (x, y) => [0, x + 100, R]],
    [[150, Infinity], (x, y) => [x - 100, 199, U]]
  ],
]

/** Calculate the password using the position and direction. */
const calcPassword = (x, y, r) => (1000 * (y + 1)) + (4 * (x + 1)) + r;

/** Move a specified distance in the current direction,
 *  and return the [x, y, r] position of the result. */
const moveDistance = (x, y, r, distance, mapIsCube) => {
  for (var i = +distance; i > 0; i--) {
    let [dx, dy] = deltas[r];
    let [nx, ny, nr] = [x + dx, y + dy, r];
    if (!map[ny]?.[nx]) {
      // walked off an edge of the map, need to figure out how it wraps
      if (!mapIsCube) {
        // find opposite edge, wrap to that
        for (; map[ny - dy] && map[ny - dy][nx - dx]; ny -= dy, nx -= dx);
      } else {
        // find neighboring cube edge and wrap onto that, changing direction as necessary
        [nx, ny, nr] = wraps[r].find(([test]) => nx < test[0] && ny < test[1])[1](x, y)
      }
    }

    if (map[ny][nx] == '#') {
      // blocked
      break;
    } else {
      [x, y, r] = [nx, ny, nr];
    }
  }
  return [x, y, r];
}

/** Follow the input path along the map and return the
 *  password from the final position and orientation. */
const followPath = (mapIsCube) => {
  let y = 0
  let x = map[0].findIndex(t => t == '.')
  let r = R;
  path.forEach(instr => {
    if (isNaN(instr)) { // rotate
      r = mod(r + (instr == "R" ? 1 : -1), 4);
    } else {            // move
      [x, y, r] = moveDistance(x, y, r, instr, mapIsCube);
    }
  });
  return calcPassword(x, y, r);
}

const firstSolution = () => followPath();
const secondSolution = () => followPath(true);

console.log("==[Day 22]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);