const { removeCreepFromSourceArrayPair } = require("./getEnergy.removeCreepFromSourceArrayPair");
const profiler = require("./screeps-profiler");

function pullFromSourceArrays(creepName) {
  removeCreepFromSourceArrayPair(creepName, "home");
  removeCreepFromSourceArrayPair(creepName, "northwest");
}
pullFromSourceArrays = profiler.registerFN(
  pullFromSourceArrays,
  "pullFromSourceArrays"
);
exports.pullFromSourceArrays = pullFromSourceArrays;


