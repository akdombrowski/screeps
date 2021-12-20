const { findMyStructs } = require("./findMyStructs");
const profiler = require("./screeps-profiler");

function memoryE59S47SpawnsRefresh() {
  if (Memory.e59s47spawns && Memory.e59s47spawns.length > 0) {
    Memory.e59s47spawns = Memory.e59s49spawns.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!Memory.e59s47spawns || Memory.e59s47spawns.length <= 0) {
    Memory.e59s47spawns = findMyStructs(
      [STRUCTURE_SPAWN],
      Memory.northRoomName
    );
  }

  return Memory.e59s47spawns;
}
memoryE59S47SpawnsRefresh = profiler.registerFN(
  memoryE59S47SpawnsRefresh,
  "memoryE59S47SpawnsRefresh"
);
exports.memoryE59S47SpawnsRefresh = memoryE59S47SpawnsRefresh;
