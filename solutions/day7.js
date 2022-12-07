const { isNumber, isObject } = require('lodash');
const { loadInput, printSolution } = require('../shared/common');

const log = loadInput('inputs/day7.txt').split('\n');
const system = {};
const path = [];

const getCurrDir = () => path.reduce((dir, sub) => dir[sub], system);

log.forEach(line => {
  if (line.startsWith("$ cd")) {
    const relPath = line.substring(5);
    switch (relPath) {
      case '/':  path.length = 0; break;
      case '..': path.pop(); break;
      default:   path.push(relPath); break;
    }
  } else if (!line.startsWith('$ ls')) {
    // file or directory
    if (line.startsWith('dir')) {
      const name = line.substring(4);
      getCurrDir()[name] = {};
    } else {
      const [size, name] = line.split(' ');
      getCurrDir()[name] = parseInt(size);
    }
  }
});

/** Get a list of child directories for the given directory. */
const getChildDirectories = (d) => Object.keys(d)
  .filter((name) => isObject(d[name]))
  .map(n => d[n]);
  
/** Get the byte size of a directory. */
const getDirectorySize = (d) =>
  Object.keys(d).reduce(
    (size, name) => size + (isNumber(d[name]) ? d[name] : getDirectorySize(d[name])),
    0
  );
  
/** Get a sum of the size of all directories with a size of at most 100000 bytes. */
const firstSolution = () => {
  const maxSize = 100000;
  const sumSizesBelowMax = (dir) => {
    const dirSize = getDirectorySize(dir);
    return getChildDirectories(dir).reduce(
      (sum, child) => sum + sumSizesBelowMax(child),
      dirSize <= maxSize ? dirSize : 0
    );
  };

  return sumSizesBelowMax(system);
}

/** Get the size of the smallest directory that, when deleted, gives
 *  a 70000000-byte disk the necessary 30000000 bytes of free space. */
const secondSolution = () => {
  const requiredSpace = getDirectorySize(system) - 40000000;
  const findMinimumOfSize = (dir) => {
    let minSize = getDirectorySize(dir);
    if (minSize < requiredSpace) {
      return -1;
    } else {
      getChildDirectories(dir).forEach(d => {
        var childMin = findMinimumOfSize(d);
        if (childMin != -1 && childMin < minSize) {
          minSize = childMin;
        }
      })
    }
    return minSize;
  }
  return findMinimumOfSize(system);
}

console.log("==[Day 7]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);