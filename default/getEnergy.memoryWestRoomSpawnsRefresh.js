const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./find.findMyStructs");

function memoryWestRoomSpawnsRefresh(creep, spawns) {
  if (spawns && spawns.length > 0) {
    spawns = spawns.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!spawns || spawns.length <= 0) {
    spawns = findMyStructs([STRUCTURE_SPAWN], Memory.westRoomName);
  }

  Memory.westSpawns = spawns;

  return spawns;
}
exports.memoryWestRoomSpawnsRefresh = memoryWestRoomSpawnsRefresh;
memoryWestRoomSpawnsRefresh = profiler.registerFN(
  memoryWestRoomSpawnsRefresh,
  "memoryWestRoomSpawnsRefresh"
);
