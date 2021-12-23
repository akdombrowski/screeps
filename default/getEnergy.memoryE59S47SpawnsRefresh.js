const { findMyStructs } = require("./find.findMyStructs");
const profiler = require("./screeps-profiler");

function memoryE59S47SpawnsRefresh(creep, spawns) {
  if (spawns && spawns.length > 0) {
    spawns = Memory.e59s49spawns.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!spawns || spawns.length <= 0) {
    spawns = findMyStructs(
      [STRUCTURE_SPAWN],
      Memory.northRoomName
    );
  }

  Memory.e59s47spawns = spawns;

  return spawns;
}
memoryE59S47SpawnsRefresh = profiler.registerFN(
  memoryE59S47SpawnsRefresh,
  "memoryE59S47SpawnsRefresh"
);
exports.memoryE59S47SpawnsRefresh = memoryE59S47SpawnsRefresh;
