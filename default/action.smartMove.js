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
  ignoreCreeps = ignoreCreeps;
  pathColor = pathColor || "#ffffff";
  pathMem = Math.random() * 10 - 1;
  let ops = Math.random() * 10000;

  if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  } else if (!dest) {
    creep.say("no destination");
    return retval;
  }

  try {
    creep.memory.path = Room.serializePath(path);
    // it was serializable if we didnt catch an error. so it must have been deserialized if it was serializable. set despath to deserialized version.
    desPath = path;
  } catch (err) {
    // not serializable
    // got an error above because either already serialized path or null
    // check if its deserializable to see if it's an already serialized path
    try {
      desPath = Room.deserializePath(path);
      creep.memory.path = path;
    } catch (e) {
      // not deserializable, was not a serialized path
      // and know from first error it wasn't a deserialized path
      // so not a good path
      path = null;
      creep.memory.path = path;
    }
  }

  // no path in memory.path. get one.
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
  }

  // No path. Try finding path using maxOps.
  if (!path) {
    // path should already be set to null/undefined but do it again here to be explicit
    path = null;
    creep.memory.path = path;
    return retval;
  }

  // Check if 1st path try, or path from memory, gets us where we want to go.
  if (path) {
    retval = creep.moveByPath(path);
  }

  if (retval === OK) {
    creep.say("mbp");
    return retval;
  }

  if (desPath) {
    try {
      retval = creep.moveByPath(desPath);
    } catch (err) {
      creep.say("cant." + retval);
      return retval;
    }

    if (retval === OK) {
      if (creep.pos.inRangeTo(dest, range)) {
        creep.memory.path = null;
      }
      creep.say("m." + retval);
      return retval;
    } else if (retval === ERR_NOT_FOUND) {
      // path doesn't match creep's location
      path = null;
      creep.say("no match");
      creep.memory.path = getAPath(
        creep,
        dest,
        range,
        ignoreCreeps,
        pathColor,
        pathMem,
        maxOps
      );
    } else {
      path = null;
      retval = ERR_NO_PATH;

      creep.memory.path = path;
      // second chance path was also out of range
    }
  } else {
    path = null;
    creep.memory.path = path;
    creep.say("null path");
    retval = ERR_NO_PATH;
    return retval;
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
