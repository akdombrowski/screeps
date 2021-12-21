const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S48ExtensionsRefresh(creep, extensions) {
  const waitTimeToRecheck = 10;

  if (!Memory.laste59s48ExtCheckTime) {
    Memory.laste59s48ExtCheckTime = Game.time;
  }

  const timeElapsedSinceLastCheck = Game.time - Memory.laste59s48ExtCheckTime;

  if (extensions && extensions.length > 0) {
    extensions = extensions.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!extensions || extensions.length <= 0) {
    extensions = findMyStructs([STRUCTURE_EXTENSION], Memory.homeRoomName);
    Memory.laste59s48ExtCheckTime = Game.time;
  }

  Memory.e59s48extensions = extensions;
  // console.log("Memory.e59s48extensions: " + Memory.e59s48extensions);
  return extensions;
}
exports.memoryE59S48ExtensionsRefresh = memoryE59S48ExtensionsRefresh;
memoryE59S48ExtensionsRefresh = profiler.registerFN(
  memoryE59S48ExtensionsRefresh,
  "memoryE59S48ExtensionsRefresh"
);
