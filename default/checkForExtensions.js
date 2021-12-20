const profiler = require("./screeps-profiler");
const { memoryE59S49ExtensionsRefresh } = require("./memoryE59S49ExtensionsRefresh");
const { memoryE59S47ExtensionsRefresh } = require("./memoryE59S47ExtensionsRefresh");
const { memoryE59S48ExtensionsRefresh } = require("./memoryE59S48ExtensionsRefresh");

function checkForExtensions(targetRoomName) {
  switch (targetRoomName) {
    case Memory.homeRoomName:
      memoryE59S48ExtensionsRefresh();
      break;
    case Memory.northRoomName:
      memoryE59S47ExtensionsRefresh();
      break;
    case Memory.deepSouthRoomName:
      memoryE59S49ExtensionsRefresh();
      break;
    default:
      memoryE59S48ExtensionsRefresh();
      break;
  }
}
exports.checkForExtensions = checkForExtensions;
checkForExtensions = profiler.registerFN(
  checkForExtensions,
  "checkForExtensions"
);
