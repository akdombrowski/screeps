const profiler = require("./screeps-profiler");
const { successfulMove } = require("./successfulMove");

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
    creep.say("no match");
  } else if (retval === ERR_INVALID_TARGET) {
    creep.say("invalidTarget");
  } else if (retval === ERR_NO_PATH) {
    creep.say("noPath");
  } else {
    // console.log(name + " smartMove oops " + retval);
    creep.say("oops." + retval);
    // second chance path was also out of range
  }
  path = null;
  creep.memory.path = null;
  return path;
}
exports.smartMoveReaction = smartMoveReaction;
smartMoveReaction = profiler.registerFN(
  smartMoveReaction,
  "smartMsmartMoveReactionove"
);
