const profiler = require("./screeps-profiler");

function successfulMove(creep, destPos, path, pathColor, dest, range) {
  let retval = OK;
  creep.say(destPos.x + "," + destPos.y);
  creep.room.visual.poly(path, {
    stroke: pathColor,
    lineStyle: "dashed",
    opacity: 0.25,
  });

  if (creep.pos.inRangeTo(dest, range)) {
    creep.memory.path = null;
  }
  return retval;
}
exports.successfulMove = successfulMove;
successfulMove = profiler.registerFN(successfulMove, "successfulMove");
