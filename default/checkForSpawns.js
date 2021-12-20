const profiler = require("./screeps-profiler");
const { memoryE59S48SpawnsRefresh } = require("./memoryE59S48SpawnsRefresh");
const { memoryE59S47SpawnsRefresh } = require("./memoryE59S47SpawnsRefresh");
const { memoryE59S49SpawnsRefresh } = require("./memoryE59S49SpawnsRefresh");

function checkForSpawns(targetRoomName) {
  switch (targetRoomName) {
    case Memory.homeRoomName:
      memoryE59S48SpawnsRefresh();
      break;
    case Memory.northRoomName:
      memoryE59S47SpawnsRefresh();
      break;
    case Memory.deepSouthRoomName:
      memoryE59S49SpawnsRefresh();
      break;
    default:
      memoryE59S48SpawnsRefresh();
      break;
  }
}
exports.checkForSpawns = checkForSpawns;
checkForSpawns = profiler.registerFN(checkForSpawns, "checkForSpawns");
