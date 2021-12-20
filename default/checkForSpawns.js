const profiler = require("./screeps-profiler");
const { memoryE59S48SpawnsRefresh } = require("./memoryE59S48SpawnsRefresh");
const { memoryE59S47SpawnsRefresh } = require("./memoryE59S47SpawnsRefresh");
const { memoryE59S49SpawnsRefresh } = require("./memoryE59S49SpawnsRefresh");

function checkForSpawns(targetRoomName, creep) {
  let spawns = [];

  switch (targetRoomName) {
    case Memory.homeRoomName:
      spawns = memoryE59S48SpawnsRefresh(creep);
      break;
    case Memory.northRoomName:
      spawns = memoryE59S47SpawnsRefresh(creep);
      break;
    case Memory.deepSouthRoomName:
      spawns = memoryE59S49SpawnsRefresh(creep);
      break;
    default:
      spawns = memoryE59S48SpawnsRefresh(creep);
      break;
  }

  return spawns;
}
exports.checkForSpawns = checkForSpawns;
checkForSpawns = profiler.registerFN(checkForSpawns, "checkForSpawns");
