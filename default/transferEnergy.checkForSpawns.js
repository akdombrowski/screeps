const profiler = require("./screeps-profiler");
const { memoryHomeSpawnsRefresh } = require("./getEnergy.memoryHomeSpawnsRefresh");
const { memoryE59S47SpawnsRefresh } = require("./getEnergy.memoryE59S47SpawnsRefresh");
const { memoryE59S49SpawnsRefresh } = require("./getEnergy.memoryE59S49SpawnsRefresh");
const { memoryE58S49SpawnsRefresh } = require("./getEnergy.memoryE58S49SpawnsRefresh");

function checkForSpawns(targetRoomName, creep, spawns) {
  switch (targetRoomName) {
    case Memory.homeRoomName:
      spawns = memoryHomeSpawnsRefresh(creep, spawns);
      break;
    case Memory.northRoomName:
      spawns = memoryE59S47SpawnsRefresh(creep, spawns);
      break;
    case Memory.deepSouthRoomName:
      spawns = memoryE59S49SpawnsRefresh(creep, spawns);
      break;
    case Memory.e58s49RoomName:
      spawns = memoryE58S49SpawnsRefresh(creep, spawns);
      break;
    default:
      spawns = memoryHomeSpawnsRefresh(creep, spawns);
      break;
  }

  return spawns;
}

exports.checkForSpawns = checkForSpawns;
checkForSpawns = profiler.registerFN(checkForSpawns, "checkForSpawns");
