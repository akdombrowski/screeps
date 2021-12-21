const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S49ExtensionsRefresh(creep, extensions) {
  if (extensions && extensions.length > 0) {
    extensions = extensions.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!extensions || extensions.length <= 0) {
    extensions = findMyStructs([STRUCTURE_EXTENSION], Memory.deepSouthRoomName);
  }

  Memory.e59s49extensions = extensions;

  return extensions;
}
exports.memoryE59S49ExtensionsRefresh = memoryE59S49ExtensionsRefresh;
memoryE59S49ExtensionsRefresh = profiler.registerFN(
  memoryE59S49ExtensionsRefresh,
  "memoryE59S49ExtensionsRefresh"
);
