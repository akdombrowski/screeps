const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./find.findMyStructs");

function memorySouthRoomSpawnsRefresh(creep, spawns) {
  if (spawns && spawns.length > 0) {
    spawns = spawns.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!spawns || spawns.length <= 0) {
    spawns = findMyStructs([STRUCTURE_SPAWN], Memory.southRoomName);
  }

  Memory.southSpawns = spawns;

  return spawns;
}
exports.memorySouthRoomSpawnsRefresh = memorySouthRoomSpawnsRefresh;
memorySouthRoomSpawnsRefresh = profiler.registerFN(
  memorySouthRoomSpawnsRefresh,
  "memorySouthRoomSpawnsRefresh"
);
