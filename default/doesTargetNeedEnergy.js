const profiler = require("./screeps-profiler");

function doesTargetNeedEnergy(target, creep, minFreeEnergyCapacity) {
  if (
    target &&
    target.store &&
    target.store[RESOURCE_ENERGY] &&
    target.store.getFreeCapacity(RESOURCE_ENERGY) >= minFreeEnergyCapacity
  ) {
    return target;
  } else {
    target = null;
    creep.memory.flag = null;
    creep.memory.transferTargetId = null;
    creep.memory.path = null;
    return null;
  }
}
exports.doesTargetNeedEnergy = doesTargetNeedEnergy;
doesTargetNeedEnergy = profiler.registerFN(
  doesTargetNeedEnergy,
  "doesTargetNeedEnergy"
);
