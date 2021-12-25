const profiler = require("./screeps-profiler");
const { successfulMove } = require("./move.successfulMove");

function smartMoveReaction(
  retval,
  path,
  creep,
  destPos,
  pathColor,
  dest,
  range
) {
  if (retval === OK || (path && path.length <= 0)) {
    retval = successfulMove(creep, destPos, path, pathColor, dest, range);
  } else if (retval === ERR_NOT_FOUND) {
    // path doesn't match creep's location
    path = null;
    creep.say("no match");
  } else if (retval === ERR_INVALID_TARGET) {
    path = null;
    creep.say("invalidTarget");
  } else if (retval === ERR_NO_PATH) {
    path = null;
    creep.say("noPath");
  } else {
    // console.log(name + " smartMove oops " + retval);
    path = null;
    creep.say("oops." + retval);
    // second chance path was also out of range
  }

  creep.memory.path = JSON.stringify(path);
  return path;
}
exports.smartMoveReaction = smartMoveReaction;
smartMoveReaction = profiler.registerFN(
  smartMoveReaction,
  "smartMsmartMoveReactionove"
);
