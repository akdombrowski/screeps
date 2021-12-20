const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S48SpawnsRefresh(creep) {
  if (Memory.e59s48spawns && Memory.e59s48spawns.length > 0) {
    Memory.e59s48spawns = Memory.e59s48spawns.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!Memory.e59s48spawns || Memory.e59s48spawns.length <= 0) {
    Memory.e59s48spawns = findMyStructs([STRUCTURE_SPAWN], Memory.homeRoomName);
  }

  return Memory.e59s48spawns;
}
exports.memoryE59S48SpawnsRefresh = memoryE59S48SpawnsRefresh;
memoryE59S48SpawnsRefresh = profiler.registerFN(
  memoryE59S48SpawnsRefresh,
  "memoryE59S48SpawnsRefresh"
);
