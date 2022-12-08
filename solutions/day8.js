const { loadInput, printSolution } = require('../shared/common');

const map = loadInput('inputs/day8.txt').split('\n').map(r => r.split('').map(Number));
const mapH = map.length;
const mapW = map[0].length;

/** Check whether a given tree is visible from some edge of the map.
 *  A tree is visible if all trees between it and the edge have a lower height. */
const isVisibleFromEdge = (treeX, treeY) => {
  let left = true, right = true, up = true, down = true;
  let height = map[treeY][treeX];

  for (let x = 0; x < treeX && left; x++) {
    if (map[treeY][x] >= height) left = false;
  }
  if (left) return true;

  for (let x = treeX + 1; x < mapW && right; x++) {
    if (map[treeY][x] >= height) right = false;
  }
  if (right) return true;

  for (let y = 0; y < treeY && up; y++) {
    if (map[y][treeX] >= height) up = false;
  }
  if (up) return true;

  for (let y = treeY + 1; y < mapH && down; y++) {
    if (map[y][treeX] >= height) down = false;
  }
  return down;
}

/** Calculate the visibility score of a specified tree.
 * The score is defined as the number of trees visible in each direction, multiplied together. */
const getVisibilityScore = (treeX, treeY) => {
  let l, r, u, d;
  let height = map[treeY][treeX];
  for (l = 1; (treeX - l) > 0          && map[treeY][treeX - l] < height; l++) { }
  for (r = 1; (treeX + r) < (mapW - 1) && map[treeY][treeX + r] < height; r++) { }
  for (u = 1; (treeY - u) > 0          && map[treeY - u][treeX] < height; u++) { }
  for (d = 1; (treeY + d) < (mapH - 1) && map[treeY + d][treeX] < height; d++) { }
  return l * r * u * d;
}

/** Find the number of trees visible from at least one edge. */
const firstSolution = () => {
   // all trees along the edge are guaranteed visible, so skip those
  let count = (mapH + mapW - 2) * 2;
  for (let y = 1; y < mapH - 1; y++) {
    for (let x = 1; x < mapW - 1; x++) {
      count += isVisibleFromEdge(x, y);
    }
  }
  return count;
}

/** Find the tree with the highest visibility score. */
const secondSolution = () => {
  // edges will have a multiplier of 0, so skip those
  let max = 0;
  for (let y = 1; y < mapH - 1; y++) {
    for (let x = 1; x < mapW - 1; x++) {
      let score = getVisibilityScore(x, y);
      if (score > max) max = score;
    }
  }
  return max;
}

console.log("==[Day 8]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);