const profiler = require("./screeps-profiler");

function doesTargetNeedEnergy(target, creep, minFreeEnergyCapacity) {
  if (
    target &&
    creep.memory.direction === "deepSouth" &&
    target.structureType === STRUCTURE_TOWER
  ) {
    console.log("target: " + target);
    console.log(
      "target.store.getFreeCapacity(RESOURCE_ENERGY) >= minFreeEnergyCapacity: " +
        (target.store.getFreeCapacity(RESOURCE_ENERGY) >= minFreeEnergyCapacity)
    );
    console.log("target.store: " + target.store);
    console.log(
      "target.store[RESOURCE_ENERGY]: " + target.store[RESOURCE_ENERGY]
    );
  }
  if (
    target &&
    target.store &&
    target.store[RESOURCE_ENERGY] &&
    target.store.getFreeCapacity(RESOURCE_ENERGY) >= minFreeEnergyCapacity
  ) {
    if (
      target &&
      creep.memory.direction === "deepSouth" &&
      target.structureType === STRUCTURE_TOWER
    ) {
      console.log("ok to transfer to");
    }
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
