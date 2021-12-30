const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./find.findMyStructs");

function memoryHomeSpawnsRefresh(creep, spawns) {
  if (spawns && spawns.length > 0) {
    spawns = spawns.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!spawns || spawns.length <= 0) {
    spawns = findMyStructs([STRUCTURE_SPAWN], Memory.homeRoomName);
  }

  Memory.homeSpawns = spawns;

  return spawns;
}
exports.memoryHomeSpawnsRefresh = memoryHomeSpawnsRefresh;
memoryHomeSpawnsRefresh = profiler.registerFN(
  memoryHomeSpawnsRefresh,
  "memoryHomeSpawnsRefresh"
);
