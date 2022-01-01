const profiler = require("./screeps-profiler");
const {
  memorySouthRoomExtensionsRefresh,
} = require("./getEnergy.memorySouthRoomExtensionsRefresh");
const {
  memoryNorthRoomExtensionsRefresh,
} = require("./getEnergy.memoryNorthRoomExtensionsRefresh");
const {
  memoryHomeExtensionsRefresh,
} = require("./getEnergy.memoryHomeExtensionsRefresh");
const {
  memoryWestRoomExtensionsRefresh,
} = require("./getEnergy.memoryWestRoomExtensionsRefresh");

function checkForExtensions(targetRoomName, creep, extensions) {
  let exts = [];

  switch (targetRoomName) {
    case Memory.homeRoomName:
      exts = memoryHomeExtensionsRefresh(creep, extensions);
      break;
    case Memory.northRoomName:
      exts = memoryNorthRoomExtensionsRefresh(creep, extensions);
      break;
    case Memory.southRoomName:
      exts = memorySouthRoomExtensionsRefresh(creep, extensions);
      break;
    case Memory.westRoomName:
      exts = memoryWestRoomExtensionsRefresh(creep, extensions);
      break;
    default:
      exts = memoryHomeExtensionsRefresh(creep, extensions);
      break;
  }
  return exts;
}
exports.checkForExtensions = checkForExtensions;
checkForExtensions = profiler.registerFN(
  checkForExtensions,
  "checkForExtensions"
);
