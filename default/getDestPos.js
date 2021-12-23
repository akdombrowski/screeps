const profiler = require("./screeps-profiler");

function getDestPos(dest) {
  let destPos = dest;
  if (destPos && dest.room) {
    if (!(destPos instanceof RoomPosition)) {
      destPos = new RoomPosition(dest.pos.x, dest.pos.y, dest.room.name);
    }
  }
  return destPos;
}
exports.getDestPos = getDestPos;
getDestPos = profiler.registerFN(getDestPos, "getDestPos");
