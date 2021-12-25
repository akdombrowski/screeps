const profiler = require("./screeps-profiler");

function successfulMove(creep, destPos, path, pathColor, dest, range) {
  let retval = OK;

  creep.room.visual.poly(path, {
    stroke: pathColor,
    lineStyle: "dashed",
    opacity: 0.99,
  });

  if (creep.pos.inRangeTo(dest, range)) {
    creep.memory.path = null;
  }

  return retval;
}
exports.successfulMove = successfulMove;
successfulMove = profiler.registerFN(successfulMove, "successfulMove");
