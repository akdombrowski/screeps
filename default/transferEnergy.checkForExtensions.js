const profiler = require("./screeps-profiler");
const {
  memoryE59S49ExtensionsRefresh,
} = require("./getEnergy.memoryE59S49ExtensionsRefresh");
const {
  memoryE59S47ExtensionsRefresh,
} = require("./getEnergy.memoryE59S47ExtensionsRefresh");
const {
  memoryHomeExtensionsRefresh,
} = require("./getEnergy.memoryHomeExtensionsRefresh");
const {
  memoryE58S49ExtensionsRefresh,
} = require("./getEnergy.memoryE58S49ExtensionsRefresh");

function checkForExtensions(targetRoomName, creep, extensions) {
  let exts = [];

  switch (targetRoomName) {
    case Memory.homeRoomName:
      exts = memoryHomeExtensionsRefresh(creep, extensions);
      break;
    case Memory.northRoomName:
      exts = memoryE59S47ExtensionsRefresh(creep, extensions);
      break;
    case Memory.deepSouthRoomName:
      exts = memoryE59S49ExtensionsRefresh(creep, extensions);
      break;
    case Memory.e58s49RoomName:
      exts = memoryE58S49ExtensionsRefresh(creep, extensions);
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
