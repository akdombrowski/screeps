const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S47ExtensionsRefresh() {
  if (!Memory.e59s47extensions || Memory.e59s47extensions.length <= 0) {
    Memory.e59s47extensions = findMyStructs(
      [STRUCTURE_EXTENSION],
      Memory.homeRoomName
    );
  } else {
    Memory.e59s47extensions = Memory.e59s47extensions.filter(
      (struct) => struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }
}
exports.memoryE59S47ExtensionsRefresh = memoryE59S47ExtensionsRefresh;
memoryE59S47ExtensionsRefresh = profiler.registerFN(
  memoryE59S47ExtensionsRefresh,
  "memoryE59S47ExtensionsRefresh"
);
