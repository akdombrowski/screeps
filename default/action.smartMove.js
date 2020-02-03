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
  ignoreCreeps = ignoreCreeps;
  pathColor = pathColor || "#ffffff";
  pathMem = Math.random() * 10 - 1;
  maxOps = Math.random() * 10000;

  if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  }

  if (!path) {
    path = getAPath(
      creep,
      dest,
      range,
      ignoreCreeps,
      pathColor,
      pathMem,
      maxOps
    );
    creep.memory.path = path;
  }

  // No path. Try finding path using maxOps.
  if (!path) {
    creep.say("nopath");
    retval = ERR_NO_PATH;
  }

  let desPath = path;

  // Check if 1st path try, or path from memory, gets us where we want to go.
  if (desPath) {
    if (desPath instanceof String) {
      desPath = Room.deserializePath(desPath);
    }

    creep.memory.path = path;
    retval = creep.moveByPath(desPath);

    if (retval === OK) {
      if (creep.pos.inRangeTo(dest, range)) {
        creep.memory.path = null;
      }
      creep.say("m");
      return retval;
    } else if (retval === ERR_NOT_FOUND) {
      // path doesn't match creep's location
      path = null;

      creep.memory.path = getAPath(creep, dest, range, ignoreCreeps, pathColor, pathMem, maxOps);
    } else {
      path = null;
      creep.memory.path = path;
      // second chance path was also out of range
    }
  } else {
    path = null;
    creep.memory.path = path;
    retval = ERR_NO_PATH;
  }

  // retval = creep.moveTo(dest, {
  //   reusePath: pathMem,
  //   ignoreCreeps: ignoreCreeps,
  //   range: range,
  //   maxOps: maxOps,
  //   serializeMemory: true,
  //   noPathFinding: noPathFinding,
  //   visualizePathStyle: { stroke: pathColor },
  // });

  if (retval === ERR_INVALID_TARGET || retval === ERR_NOT_FOUND) {
    creep.memory.path = null;
  } else if (retval === ERR_NO_PATH) {
    creep.memory.path = null;
  }

  creep.say("m." + retval);
  return retval;
}

module.exports = smartMove;
