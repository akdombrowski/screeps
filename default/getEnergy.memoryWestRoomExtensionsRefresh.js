const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./find.findMyStructs");

function memoryWestRoomExtensionsRefresh(creep, extensions) {
  const waitTimeToRecheck = 10;

  if (!Memory.lastWestRoomExtCheckTime) {
    Memory.lastWestRoomExtCheckTime = Game.time;
  }

  const timeElapsedSinceLastCheck = Game.time - Memory.lastWestRoomExtCheckTime;

  if (extensions && extensions.length > 0) {
    extensions = extensions.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!extensions || extensions.length <= 0) {
    extensions = findMyStructs([STRUCTURE_EXTENSION], Memory.westRoomName);
    Memory.lastWestRoomExtCheckTime = Game.time;
  }

  Memory.westExtensions = extensions;
  // console.log("Memory.e58s48extensions: " + Memory.e58s48extensions);
  return extensions;
}
exports.memoryWestRoomExtensionsRefresh = memoryWestRoomExtensionsRefresh;
memoryWestRoomExtensionsRefresh = profiler.registerFN(
  memoryWestRoomExtensionsRefresh,
  "memoryWestRoomExtensionsRefresh"
);
