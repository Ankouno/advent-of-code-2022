const { loadInput, printSolution } = require('../shared/common');

/** Clamp a value between a maximum and minimum. */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const commands = loadInput('inputs/day9.txt').split('\n').map(l => l.split(' '));

/** Count the visited tiles for the tail piece of a rope. */
const countVisited = (ropeLength) => {
  let visited = new Map();
  visited.set("0_0", true);

  let segments = new Array(ropeLength).fill(0).map(_ => [0, 0]);
  let Front = segments[0];

  commands.forEach(([direction, distance]) => {
    var moveX = 0, moveY = 0;
    switch (direction) {
      case "L": moveX = -1; break;
      case "R": moveX = 1; break;
      case "U": moveY = -1; break;
      case "D": moveY = 1; break;
    }

    for (let i = 0; i < distance; i++) {
      // move the head of the rope in the commanded direction
      Front[0] += moveX;
      Front[1] += moveY;

      // check if each next segment ends up more than a tile away from its previous
      for (let j = 1; j < ropeLength; j++) {
        var H = segments[j - 1];
        var T = segments[j];
        var dx = H[0] - T[0];
        var dy = H[1] - T[1];
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          // more than one tile away, shift the segment towards the previous
          T[0] += clamp(dx, -1, 1);
          T[1] += clamp(dy, -1, 1);

          if (j == ropeLength - 1) {
            var encoded = T[0] + "_" + T[1];
            visited.set(encoded, true);
          }
        }
      }
    }
  });
  return visited.size;
}

/** Count the visited tiles for the tail of a rope with only 2 segments. */
const firstSolution = () => countVisited(2);

/** Count the visited tiles for the tail of a rope with a 10 segments. */
const secondSolution = () => countVisited(10);

console.log("==[Day 9]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);