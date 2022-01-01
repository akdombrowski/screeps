const profiler = require("./screeps-profiler");
const { memoryHomeSpawnsRefresh } = require("./getEnergy.memoryHomeSpawnsRefresh");
const {
  memoryNorthRoomSpawnsRefresh,
} = require("./getEnergy.memoryNorthRoomSpawnsRefresh");
const {
  memorySouthRoomSpawnsRefresh,
} = require("./getEnergy.memorySouthRoomSpawnsRefresh");
const {
  memoryWestRoomSpawnsRefresh,
} = require("./getEnergy.memoryWestRoomSpawnsRefresh");

function checkForSpawns(targetRoomName, creep, spawns) {
  switch (targetRoomName) {
    case Memory.homeRoomName:
      spawns = memoryHomeSpawnsRefresh(creep, spawns);
      break;
    case Memory.northRoomName:
      spawns = memoryNorthRoomSpawnsRefresh(creep, spawns);
      break;
    case Memory.southRoomName:
      spawns = memorySouthRoomSpawnsRefresh(creep, spawns);
      break;
    case Memory.westRoomName:
      spawns = memoryWestRoomSpawnsRefresh(creep, spawns);
      break;
    default:
      spawns = memoryHomeSpawnsRefresh(creep, spawns);
      break;
  }

  return spawns;
}

exports.checkForSpawns = checkForSpawns;
checkForSpawns = profiler.registerFN(checkForSpawns, "checkForSpawns");
