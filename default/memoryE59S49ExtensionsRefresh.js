const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S49ExtensionsRefresh() {
  if (!Memory.e59s49extensions || Memory.e59s49extensions.length <= 0) {
    Memory.e59s49extensions = findMyStructs(
      [STRUCTURE_EXTENSION],
      Memory.deepSouthRoomName
    );
  } else {
    Memory.e59s49extensions = Memory.e59s49extensions.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  return Memory.e59s49extensions;
}
exports.memoryE59S49ExtensionsRefresh = memoryE59S49ExtensionsRefresh;
memoryE59S49ExtensionsRefresh = profiler.registerFN(
  memoryE59S49ExtensionsRefresh,
  "memoryE59S49ExtensionsRefresh"
);
