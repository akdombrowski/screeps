const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S48ExtensionsRefresh(creep) {
  if (Memory.e59s48extensions && Memory.e59s48extensions.length > 0) {
    Memory.e59s48extensions = Memory.e59s48extensions.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!Memory.e59s48extensions || Memory.e59s48extensions.length <= 0) {
    Memory.e59s48extensions = findMyStructs(
      [STRUCTURE_EXTENSION],
      Memory.homeRoomName
    );
  }

  return Memory.e59s48extensions;
}
exports.memoryE59S48ExtensionsRefresh = memoryE59S48ExtensionsRefresh;
memoryE59S48ExtensionsRefresh = profiler.registerFN(
  memoryE59S48ExtensionsRefresh,
  "memoryE59S48ExtensionsRefresh"
);
