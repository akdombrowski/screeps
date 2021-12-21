const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S49SpawnsRefresh(creep, spawns) {
  if (spawns && spawns.length > 0) {
    spawns = spawns.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!spawns || spawns.length <= 0) {
    spawns = findMyStructs([STRUCTURE_SPAWN], Memory.deepSouthRoomName);
  }

  Memory.e59s49spawns = spawns;

  return spawns;
}
exports.memoryE59S49SpawnsRefresh = memoryE59S49SpawnsRefresh;
memoryE59S49SpawnsRefresh = profiler.registerFN(
  memoryE59S49SpawnsRefresh,
  "memoryE59S49SpawnsRefresh"
);
