const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./find.findMyStructs");

function memoryHomeExtensionsRefresh(creep, extensions) {
  const waitTimeToRecheck = 10;

  if (!Memory.lastHomeExtCheckTime) {
    Memory.lastHomeExtCheckTime = Game.time;
  }

  const timeElapsedSinceLastCheck = Game.time - Memory.lastHomeExtCheckTime;

  if (extensions && extensions.length > 0) {
    extensions = extensions.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!extensions || extensions.length <= 0) {
    extensions = findMyStructs([STRUCTURE_EXTENSION], Memory.homeRoomName);
    Memory.lastHomeExtCheckTime = Game.time;
  }

  Memory.homeExtensions = extensions;

  return extensions;
}
exports.memoryHomeExtensionsRefresh = memoryHomeExtensionsRefresh;
memoryHomeExtensionsRefresh = profiler.registerFN(
  memoryHomeExtensionsRefresh,
  "memoryHomeExtensionsRefresh"
);
