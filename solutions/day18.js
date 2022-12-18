const { loadInput, printSolution } = require('../shared/common');

const cubes = Object.fromEntries(
  loadInput('inputs/day18.txt').split('\n').map(c => [c, c.split(',').map(Number)])
);

const adjacencies = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

/** Find the total surface area of the input shape. */
const firstSolution = () => 
  Object.values(cubes).reduce((sa, [x, y, z]) => {
    return sa + adjacencies.filter(([dx, dy, dz]) => !cubes[[x + dx, y + dy, z + dz].join(',')]).length
  }, 0);

/** Find te surface area of the input shape, excluding hollow spaces. */
const secondSolution = () => {
  // find a bounding cube for the whole input
  var minX = Infinity, maxX = 0;
  var minY = Infinity, maxY = 0;
  var minZ = Infinity, maxZ = 0;
  Object.values(cubes).forEach(([x, y, z]) => {
    if (x > maxX) maxX = x;
    if (x < minX) minX = x;
    if (y > maxY) maxY = y;
    if (y < minY) minY = y;
    if (z > maxZ) maxZ = z;
    if (z < minZ) minZ = z;
  });
  minX--; minY--; minZ--;
  maxX++; maxY++; maxZ++;

  // flood fill the bounds with new cubes
  var start = [minX, minY, minZ];
  var toCheck = [start];
  var extCubes = {};
  extCubes[start.join(',')] = start;

  while (toCheck.length > 0) {
    var [x, y, z] = toCheck.pop();

    adjacencies.forEach(([dx, dy, dz]) => {
      var nx = x + dx, ny = y + dy, nz = z + dz;
      if (nx >= minX && nx <= maxX && ny >= minY && ny <= maxY && nz >= minZ && nz <= maxZ) {
        var nCube = [nx, ny, nz];
        var nCubeName = nCube.join(',')
        if (!cubes[nCubeName] && !extCubes[nCubeName]) {
          extCubes[nCubeName] = nCube;
          toCheck.push(nCube);
        }
      }
    });
  }

  // find surface area of the flood fill touching the original cube set
  return Object.values(extCubes).reduce((sa, [x, y, z]) => {
    return sa + adjacencies.filter(([dx, dy, dz]) => cubes[[x + dx, y + dy, z + dz].join(',')]).length
  }, 0);
}

console.log("==[Day 18]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);