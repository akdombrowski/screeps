const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./findMyStructs");

function memoryE59S48ExtensionsRefresh(creep) {
  const waitTimeToRecheck = 10;

  if (!Memory.laste59s48ExtCheckTime) {
    Memory.laste59s48ExtCheckTime = Game.time;
  }

  const timeElapsedSinceLastCheck = Game.time - Memory.laste59s48ExtCheckTime;

  if (global.e59s48extensions && global.e59s48extensions.length > 0) {
    global.e59s48extensions = global.e59s48extensions.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (
    !global.e59s48extensions ||
    (global.e59s48extensions.length <= 0 &&
      timeElapsedSinceLastCheck > waitTimeToRecheck)
  ) {
    global.e59s48extensions = findMyStructs(
      [STRUCTURE_EXTENSION],
      Memory.homeRoomName
    );
    Memory.laste59s48ExtCheckTime = Game.time;
  }

  // console.log("Memory.e59s48extensions: " + Memory.e59s48extensions);
  return global.e59s48extensions;
}
exports.memoryE59S48ExtensionsRefresh = memoryE59S48ExtensionsRefresh;
memoryE59S48ExtensionsRefresh = profiler.registerFN(
  memoryE59S48ExtensionsRefresh,
  "memoryE59S48ExtensionsRefresh"
);
