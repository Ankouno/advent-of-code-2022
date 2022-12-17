const { loadInput, printSolution } = require('../shared/common');

const sensors = loadInput('inputs/day15.txt').split('\n')
  .map(line => [...line.matchAll(/-?\d+/g)].map(m => parseInt(m[0])));
  
/**
 * Get a list of non-overlapping X-position intervals across a
 *  specific Y position that have been examined by at least one sensor.
 */
const getIntervalAtYPos = (rowY) => {
  // get a list of intervals in the row covered by each sensor
  const intervals = [];
  sensors.forEach(([sX, sY, bX, bY]) => {
    var radius = Math.abs(bX - sX) + Math.abs(bY - sY);
    var distToRow = Math.abs(sY - rowY);
    if (radius >= distToRow) {
      var rowRadius = radius - distToRow;
      intervals.push([sX - rowRadius, sX + rowRadius]);
    }
  });

  // merge intervals
  intervals.sort((a, b) => a[0] - b[0]);
  let merged = [];
  let range = intervals[0];
  intervals.forEach(([a, b]) => {
    if (range[1] >= a) {
      range[1] = Math.max(range[1], b);
    } else {
      merged.push(range);
      range = [a, b];
    }
  });
  merged.push(range);

  return merged;
}

/** Count covered non-beacon tiles at a specific Y position. */
const firstSolution = () => {
  const Y_POS = 2000000;
  var intervals = getIntervalAtYPos(Y_POS, true);
  var count = intervals.reduce((c, [minX, maxX]) => c + (maxX - minX + 1), 0);
  // exclude beacons that were already found
  count -= new Set(sensors.filter(s => s[3] == Y_POS).map(s => s[2])).size;
  return count;
}

/**
 * Find an uncovered tile within a specific 2D region and
 * return its "tuning frequency" as [X * 4000000 + Y].
 */
const secondSolution = () => {
  const RANGE_MIN_X = 0, RANGE_MAX_X = 4000000;
  const RANGE_MIN_Y = 0, RANGE_MAX_Y = 4000000;
  let x, y;
  for (y = RANGE_MIN_Y; y < RANGE_MAX_Y; y++) {
    var intervals = getIntervalAtYPos(y);
    var inRange = intervals.filter(([min, max]) => RANGE_MIN_X <= max && RANGE_MAX_X >= min);
    if (inRange.length > 1) {
      // there is a gap!
      x = inRange[0][1] + 1;
      return x * 4000000 + y;
    }
  }
}

console.log("==[Day 15]=========")
printSolution(1, firstSolution, 14);
printSolution(2, secondSolution, 14);