const profiler = require("./screeps-profiler");

function areCreepsDying(numCrps) {
  if (numCrps < 4 && Object.keys(Memory.creeps).length >= 4) {
    Game.notify("Creeps are dying. " + numCrps + " left.");
  } else if (numCrps < 10 && Object.keys(Memory.creeps).length >= 10) {
    Game.notify("Less than 10 creeps left.");
  }
}

areCreepsDying = profiler.registerFN(areCreepsDying, "areCreepsDying");
exports.areCreepsDying = areCreepsDying;
