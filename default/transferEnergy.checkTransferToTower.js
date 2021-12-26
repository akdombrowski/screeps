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

  if (creepRoom.name === Memory.deepSouthRoomName) {
    console.log(creep.name);
    console.log("creepRoom: " + creepRoom);
    console.log("tower: " + tower);
    console.log("minRoomEnergy: " + minRoomEnergy);
    console.log("maxTowerEnergy: " + maxTowerEnergy);
    console.log("minTowerEnergy: " + minTowerEnergy);
    console.log();
  }

  if (
    (creepRoom &&
      creepRoom.energyAvailable >= minRoomEnergy &&
      tower.store[RESOURCE_ENERGY] < maxTowerEnergy) ||
    tower.store[RESOURCE_ENERGY] < minTowerEnergy
  ) {
    target = tower;
    creep.memory.transferTargetId = target.id;
    console.log("target: " + target);
  }

  return target;
}
exports.checkTransferToTower = checkTransferToTower;
checkTransferToTower = profiler.registerFN(
  checkTransferToTower,
  "checkTransferToTower"
);
