const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S47ExtensionsRefresh(creep) {
  if (global.e59s47extensions && global.e59s47extensions.length > 0) {
    global.e59s47extensions = global.e59s47extensions.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!global.e59s47extensions || global.e59s47extensions.length <= 0) {
    global.e59s47extensions = findMyStructs(
      [STRUCTURE_EXTENSION],
      Memory.northRoomName
    );
  }
  return global.e59s47extensions;
}
exports.memoryE59S47ExtensionsRefresh = memoryE59S47ExtensionsRefresh;
memoryE59S47ExtensionsRefresh = profiler.registerFN(
  memoryE59S47ExtensionsRefresh,
  "memoryE59S47ExtensionsRefresh"
);
