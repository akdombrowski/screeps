const profiler = require("./screeps-profiler");
const {
  memoryE59S49ExtensionsRefresh,
} = require("./memoryE59S49ExtensionsRefresh");
const {
  memoryE59S47ExtensionsRefresh,
} = require("./memoryE59S47ExtensionsRefresh");
const {
  memoryE59S48ExtensionsRefresh,
} = require("./memoryE59S48ExtensionsRefresh");

function checkForExtensions(targetRoomName, creep) {
  let exts = [];

  switch (targetRoomName) {
    case Memory.homeRoomName:
      exts = memoryE59S48ExtensionsRefresh(creep);
      break;
    case Memory.northRoomName:
      exts = memoryE59S47ExtensionsRefresh(creep);
      break;
    case Memory.deepSouthRoomName:
      exts = memoryE59S49ExtensionsRefresh(creep);
      break;
    default:
      exts = memoryE59S48ExtensionsRefresh(creep);
      break;
  }

  return exts;
}
exports.checkForExtensions = checkForExtensions;
checkForExtensions = profiler.registerFN(
  checkForExtensions,
  "checkForExtensions"
);
