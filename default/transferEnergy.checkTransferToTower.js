const profiler = require("./screeps-profiler");

function checkTransferToTower(
  creepRoom,
  tower,
  creep,
  minRoomEnergy,
  maxTowerEnergy
) {
  let target = null;
  if (creepRoom &&
    creepRoom.energyAvailable >= minRoomEnergy &&
    tower.store[RESOURCE_ENERGY] < maxTowerEnergy) {
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
