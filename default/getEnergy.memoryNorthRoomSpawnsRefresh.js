const { findMyStructs } = require("./find.findMyStructs");
const profiler = require("./screeps-profiler");

function memoryNorthRoomSpawnsRefresh(creep, spawns) {
  if (spawns && spawns.length > 0) {
    spawns = Memory.northSpawns.filter(
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

  Memory.northSpawns = spawns;

  return spawns;
}
memoryNorthRoomSpawnsRefresh = profiler.registerFN(
  memoryNorthRoomSpawnsRefresh,
  "memoryNorthRoomSpawnsRefresh"
);
exports.memoryNorthRoomSpawnsRefresh = memoryNorthRoomSpawnsRefresh;
