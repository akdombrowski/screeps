const profiler = require("./screeps-profiler");
const { memoryE59S48SpawnsRefresh } = require("./memoryE59S48SpawnsRefresh");
const { memoryE59S47SpawnsRefresh } = require("./memoryE59S47SpawnsRefresh");
const { memoryE59S49SpawnsRefresh } = require("./memoryE59S49SpawnsRefresh");

function checkForSpawns(targetRoomName) {
  let spawns = [];

  switch (targetRoomName) {
    case Memory.homeRoomName:
      spawns = memoryE59S48SpawnsRefresh();
      break;
    case Memory.northRoomName:
      spawns = memoryE59S47SpawnsRefresh();
      break;
    case Memory.deepSouthRoomName:
      spawns = memoryE59S49SpawnsRefresh();
      break;
    default:
      spawns = memoryE59S48SpawnsRefresh();
      break;
  }

  return spawns;
}
exports.checkForSpawns = checkForSpawns;
checkForSpawns = profiler.registerFN(checkForSpawns, "checkForSpawns");
