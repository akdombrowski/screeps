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
  }

  if (
    (creepRoom &&
      creepRoom.energyAvailable >= minRoomEnergy &&
      tower.store[RESOURCE_ENERGY] < maxTowerEnergy) ||
    tower.store[RESOURCE_ENERGY] < minTowerEnergy
  ) {
    target = tower;
    creep.memory.transferTargetId = target.id;
    if (creepRoom.name === Memory.deepSouthRoomName) {
      console.log("target: " + target);
      console.log();
    }
  }

  return target;
}
exports.checkTransferToTower = checkTransferToTower;
checkTransferToTower = profiler.registerFN(
  checkTransferToTower,
  "checkTransferToTower"
);
