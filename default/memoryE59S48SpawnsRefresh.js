const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S48SpawnsRefresh(creep, spawns) {
  if (spawns && spawns.length > 0) {
    spawns = spawns.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!spawns || spawns.length <= 0) {
    spawns = findMyStructs([STRUCTURE_SPAWN], Memory.homeRoomName);
  }

  Memory.e59s48spawns = spawns;

  return spawns;
}
exports.memoryE59S48SpawnsRefresh = memoryE59S48SpawnsRefresh;
memoryE59S48SpawnsRefresh = profiler.registerFN(
  memoryE59S48SpawnsRefresh,
  "memoryE59S48SpawnsRefresh"
);
