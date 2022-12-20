const { loadInput, printSolution } = require('../shared/common');

const blueprints = loadInput('inputs/day19.txt').split('\n')
  .map(line => [...line.matchAll(/(\d+) (?:[^\.\d]+(\d+) c)?(?:[^\.\d]+(\d+) o)?/g)]
    .map(x => x.slice(1).map(x => Number(x || 0))));

/** Test a blueprint and return the maximum possible number of geodes mined. */
const testBlueprint = (blueprint, initTimeLeft) => {
  let maxGeodes = 0;
  const states = [{
    timeLeft: initTimeLeft,
    resources: [0, 0, 0, 0],
    bots: [1, 0, 0, 0]
  }];

  // we don't need more of a particular resource bot than the
  //  maximum amount of that resource required to purchase a new bot
  const maxBotsNecessary =
    blueprint.map((_, r) => Math.max(...blueprint.map(b => b[r])) || Infinity);

  // perform a DFS on the potential states from each bot purchase
  while (states.length > 0) {
    let {timeLeft, bots, resources} = states.pop();

    const minedGeodes = resources[3] + bots[3] * timeLeft;
    if (minedGeodes > maxGeodes) {
      maxGeodes = minedGeodes;
    }

    timeLeft--;
    if (timeLeft == 0) {
      continue;
    }

    // test each potential bot purchase from this state
    blueprint.forEach((botCost, b) => {
      if (resources[b] >= maxBotsNecessary[b]) {
        // we don't need any more of this bot
        return;
      }

      // check how many time steps will be required until we can build the bot
      const buildTime = botCost.reduce((time, cost, r) =>
        Math.max(time, Math.ceil((cost - resources[r]) / bots[r]) || 0), 0);

      if (buildTime > timeLeft) {
        // not enough time left to bother building this bot
        return;
      }

      // build the new bot and add the purchase to the state list
      const newResources = resources.map((resource, r) =>
        resource + bots[r] * (buildTime + 1) - (botCost[r] || 0));
      const newBots = [...bots];
      newBots[b]++;

      states.push({
        timeLeft: timeLeft - buildTime,
        resources: newResources,
        bots: newBots
      });
    });
  }

  return maxGeodes;
}

/** Get the sum of the "quality level" of each blueprint in 24 minutes.
 * The quality level is the blueprint ID multiplied by the max geodes mined. */
const firstSolution = () =>
  blueprints.reduce((sum, bp, i) => sum + (i + 1) * testBlueprint(bp, 24), 0);

/** Get the product of the max geodes mined by the first 3 blueprints in 32 minutes. */
const secondSolution = () =>
  blueprints.slice(0, 3).reduce((total, bp) => total * testBlueprint(bp, 32), 1);

console.log("==[Day 19]=========")
printSolution(1, firstSolution);
printSolution(2, secondSolution);