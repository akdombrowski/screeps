const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S49SpawnsRefresh() {
  if (Memory.e59s49spawns && Memory.e59s49spawns.length > 0) {
    Memory.e59s49spawns = Memory.e59s49spawns.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!Memory.e59s49spawns || Memory.e59s49spawns.length <= 0) {
    Memory.e59s49spawns = findMyStructs(
      [STRUCTURE_SPAWN],
      Memory.deepSouthRoomName
    );
  }

  return Memory.e59s49spawns;
}
exports.memoryE59S49SpawnsRefresh = memoryE59S49SpawnsRefresh;
memoryE59S49SpawnsRefresh = profiler.registerFN(
  memoryE59S49SpawnsRefresh,
  "memoryE59S49SpawnsRefresh"
);
