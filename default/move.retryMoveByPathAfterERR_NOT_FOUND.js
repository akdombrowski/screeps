const profiler = require("./screeps-profiler");

function retryMoveByPathAfterERR_NOT_FOUND(creep, path, pathColor, creepPos) {
  let retval = -16;
  try {
    retval = creep.moveByPath(path);
    console.log("moveByPath after shifting path: "+ retval);

    if (retval === OK) {
      creep.room.visual.poly(path, {
        stroke: pathColor,
        lineStyle: "dashed",
        opacity: 0.25,
      });
      if (creepPos.isEqualTo(path[0])) {
        path.shift();
      }

      creep.memory.path = path;
    } else {
      creep.memory.path = null;
    }
  } catch (e) {
    creep.memory.path = null;
  }
  return retval;
}
exports.retryMoveByPathAfterERR_NOT_FOUND = retryMoveByPathAfterERR_NOT_FOUND;
retryMoveByPathAfterERR_NOT_FOUND = profiler.registerFN(
  retryMoveByPathAfterERR_NOT_FOUND,
  "retryMoveByPathAfterERR_NOT_FOUND"
);
