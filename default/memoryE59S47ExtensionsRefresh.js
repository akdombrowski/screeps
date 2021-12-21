const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S47ExtensionsRefresh(creep, extensions) {
  if (extensions && extensions.length > 0) {
    extensions = extensions.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!extensions || extensions.length <= 0) {
    extensions = findMyStructs(
      [STRUCTURE_EXTENSION],
      Memory.northRoomName
    );
  }

  Memory.e59s47extensions = extensions;
  return extensions;
}
exports.memoryE59S47ExtensionsRefresh = memoryE59S47ExtensionsRefresh;
memoryE59S47ExtensionsRefresh = profiler.registerFN(
  memoryE59S47ExtensionsRefresh,
  "memoryE59S47ExtensionsRefresh"
);
