const profiler = require("./screeps-profiler");

function reCheckNumOfCreeps(crps) {
  let numCrps = Object.keys(crps).length;
  return numCrps;
}

reCheckNumOfCreeps = profiler.registerFN(
  reCheckNumOfCreeps,
  "reCheckNumOfCreeps"
);
exports.reCheckNumOfCreeps = reCheckNumOfCreeps;
