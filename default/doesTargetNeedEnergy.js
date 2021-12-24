const profiler = require("./screeps-profiler");

function doesTargetNeedEnergy(target, creep, minOpenEnergyCapacity) {
  if (
    target &&
    target.store[RESOURCE_ENERGY] &&
    target.store.getFreeCapacity(RESOURCE_ENERGY) >= minOpenEnergyCapacity
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
