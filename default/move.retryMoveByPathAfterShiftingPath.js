const profiler = require("./screeps-profiler");

function retryMoveByPathAfterShiftingPath(creep, path, pathColor) {
  let retval = -16;
  if (creep.pos === path[1]) {
    path.shift();
    retval = creep.moveByPath(path);
    if (retval === OK) {
      creep.room.visual.poly(path, {
        stroke: pathColor,
        lineStyle: "dashed",
        opacity: 0.25,
      });
      path.shift();
      creep.memory.path = path;
    } else {
      creep.memory.path = null;
    }
  }
  return retval;
}
exports.retryMoveByPathAfterShiftingPath = retryMoveByPathAfterShiftingPath;
retryMoveByPathAfterShiftingPath = profiler.registerFN(
  retryMoveByPathAfterShiftingPath,
  "retryMoveByPathAfterShiftingPath"
);
