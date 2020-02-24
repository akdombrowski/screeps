const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const getAPath = require("./getAPath");

function smartMove(
  creep,
  dest,
  range,
  ignoreCreeps = true,
  pathColor = "#ffffff",
  pathMem,
  maxOps
) {
  let s;
  let retval = -16;
  let blockage;
  let noPathFinding = true;
  let path = creep.memory.path;
  let rm = creep.room;
  let name = creep.name;
  let pos = creep.pos;
  let desPath;
  pathColor = pathColor || "#ffffff";
  pathMem = Math.random() * 10 - 1;
  let ops = maxOps || Math.random() * 100000;

  if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  } else if (!dest) {
    creep.say("no destination");
    return retval;
  }

  if (moveAwayFromCreep(creep)) {
    path = null;
  }

  // no path in memory.path. get one.
  if (!path || pathMem < 1) {
    path = getAPath(
      creep,
      dest,
      range,
      ignoreCreeps,
      pathColor,
      pathMem,
      maxOps
    );
  }

  // No path. Try finding path using maxOps.
  if (!path) {
    // path should already be set to null/undefined but do it again here to be explicit
    path = null;
    creep.memory.path = path;
    console.log("no path");
    return ERR_NO_PATH;
  }

  // Check if 1st path try, or path from memory, gets us where we want to go.
  if (path) {
    retval = creep.moveByPath(path);
  }

  if (retval === OK) {
    creep.say("mbp");

    if (creep.pos.inRangeTo(dest, range)) {
      creep.memory.path = null;
    }
    return retval;
  } else if (retval === ERR_NOT_FOUND) {
    // path doesn't match creep's location
    path = null;
    creep.say("no match");
    creep.memory.path = null;
  } else {
    path = null;
    retval = ERR_NO_PATH;

    creep.memory.path = path;
    // second chance path was also out of range
  }

  if (retval === ERR_INVALID_TARGET || retval === ERR_NOT_FOUND) {
    creep.memory.path = null;
  } else if (retval === ERR_NO_PATH) {
    creep.memory.path = null;
  }

  creep.say("m." + retval);
  return retval;
}

module.exports = smartMove;
