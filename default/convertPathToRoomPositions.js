const profiler = require("./screeps-profiler");

function convertPathToRoomPositions(path) {
  if (path &&
    path.length > 0 &&
    path[0] &&
    path[0].x &&
    path[0].roomName &&
    !(path[0] instanceof RoomPosition)) {
    path = path.map((p) => new RoomPosition(p.x, p.y, p.roomName));
  }
  return path;
}
convertPathToRoomPositions = profiler.registerFN(
  convertPathToRoomPositions,
  "convertPathToRoomPositions"
);
exports.convertPathToRoomPositions = convertPathToRoomPositions;
