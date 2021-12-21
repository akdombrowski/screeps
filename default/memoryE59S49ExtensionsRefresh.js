const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S49ExtensionsRefresh(creep) {
  if (global.e59s49extensions && global.e59s49extensions.length > 0) {
    global.e59s49extensions = global.e59s49extensions.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!global.e59s49extensions || global.e59s49extensions.length <= 0) {
    global.e59s49extensions = findMyStructs(
      [STRUCTURE_EXTENSION],
      Memory.deepSouthRoomName
    );
  }

  return global.e59s49extensions;
}
exports.memoryE59S49ExtensionsRefresh = memoryE59S49ExtensionsRefresh;
memoryE59S49ExtensionsRefresh = profiler.registerFN(
  memoryE59S49ExtensionsRefresh,
  "memoryE59S49ExtensionsRefresh"
);
