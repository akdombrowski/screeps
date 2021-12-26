const profiler = require("./screeps-profiler");

function checkTransferToTower(
  creepRoom,
  tower,
  creep,
  minRoomEnergy,
  maxTowerEnergy,
  minTowerEnergy
) {
  let target = null;

  if (
    (creepRoom &&
      creepRoom.energyAvailable >= minRoomEnergy &&
      tower.store[RESOURCE_ENERGY] < maxTowerEnergy) ||
    tower.store[RESOURCE_ENERGY] < minTowerEnergy
  ) {
    target = tower;
    creep.memory.transferTargetId = target.id;
  }

  return target;
}
exports.checkTransferToTower = checkTransferToTower;
checkTransferToTower = profiler.registerFN(
  checkTransferToTower,
  "checkTransferToTower"
);
