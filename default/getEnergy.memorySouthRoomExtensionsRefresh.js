const profiler = require("./screeps-profiler");
const { findMyStructs } = require("./find.findMyStructs");

function memorySouthRoomExtensionsRefresh(creep, extensions) {
  if (extensions && extensions.length > 0) {
    extensions = extensions.filter(
      (struct) =>
        struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );
  }

  if (!extensions || extensions.length <= 0) {
    extensions = findMyStructs([STRUCTURE_EXTENSION], Memory.southRoomName);
  }

  Memory.southExtensions = extensions;

  return extensions;
}
exports.memorySouthRoomExtensionsRefresh = memorySouthRoomExtensionsRefresh;
memorySouthRoomExtensionsRefresh = profiler.registerFN(
  memorySouthRoomExtensionsRefresh,
  "memorySouthRoomExtensionsRefresh"
);
