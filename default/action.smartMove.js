const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const getPath = require("./action.getPath");
const getRandomColor = require("./getRandomColor");

function smartMove(
  creep,
  dest,
  range,
  ignoreCreeps,
  pathColor,
  pathMem,
  maxOps,
  maxRms
) {
  let s;
  let retval = -16;
  let blockage;
  let noPathFinding = true;
  let path = creep.memory.path;
  const rm = creep.room;
  const name = creep.name;
  const pos = creep.pos;
  let desPath;
  pathColor = pathColor || getRandomColor();
  pathMem = pathMem || Math.floor(Math.random() * 100);
  maxOps = maxOps || Math.floor(Math.random() * 500) + 1;
  maxRms = maxRms || 1;
  ignoreCreeps = ignoreCreeps || true;

  if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  } else if (!dest) {
    creep.say("no destination");
    return retval;
  }

  let destPos = dest;
  if (destPos && dest.room) {
    if (!(destPos instanceof RoomPosition)) {
      destPos = new RoomPosition(dest.pos.x, dest.pos.y, dest.room.name);
    }
  }

  if (moveAwayFromCreep(creep)) {
    path = null;
  }

  // no path in memory.path. get one.
  if (!path || pathMem < 1) {

    console.log(name + " getPath ");
    console.log(name + " ignoreCreeps " + ignoreCreeps);

    getPath(creep, dest, range, ignoreCreeps, pathColor, pathMem, maxOps);
    path = creep.memory.path;
  }

  if (
    path &&
    path[0] &&
    path[0].pos &&
    path[0].pos.x != creep.pos.x &&
    path[0].pos.y != creep.pos.y
  ) {
    path = null;
    return retval;
  }

  if (!path) console.log(name + " no path");

  if (path) {
    retval = creep.moveByPath(path);

    if (retval === OK) {
      creep.memory.path.shift();
    } else if (retval === ERR_NOT_FOUND) {
      creep.memory.path = null;
      return retval;
    }
  } else {
    creep.memory.path = null;
    retval = creep.moveTo(destPos, {
      plainCost: 1,
      swampCost: 2,
      range: range,
      ignoreCreeps: ignoreCreeps,
      noPathFinding: false,
      reusePath: pathMem,
      maxOps: maxOps,
      maxRooms: maxRms,
      serializeMemory: true,
      visualizePathStyle: {
        fill: "transparent",
        stroke: pathColor,
        lineStyle: "dashed",
        strokeWidth: 0.15,
        opacity: 0.1,
      },
    });
  }

  // // No path. Try finding path using maxOps.
  // if (!path) {
  //   // path should already be set to null/undefined but do it again here to be explicit
  //   path = null;
  //   creep.memory.path = path;
  //   console.log(name + ": no path");
  //   return ERR_NO_PATH;
  // }

  // // Check if 1st path try, or path from memory, gets us where we want to go.
  // if (path) {
  //   let beforePos = creep.pos;
  //   let afterPos = Room.deserializePath(path)[0];
  //   retval = creep.moveByPath(path);

  //   if (
  //     !beforePos ||
  //     !afterPos ||
  //     (beforePos.x === afterPos.x && beforePos.y === afterPos.y)
  //   ) {
  //     retval = ERR_NO_PATH;
  //   }
  // }

  if (retval === OK) {
    creep.say(destPos.x + "," + destPos.y);

    if (creep.pos.inRangeTo(dest, range)) {
      creep.memory.path = null;
    }
  } else if (retval === ERR_NOT_FOUND) {
    // path doesn't match creep's location
    creep.say("no match");
    creep.memory.path = null;
  } else if (retval === ERR_INVALID_TARGET || retval === ERR_NOT_FOUND) {
    creep.say("invalidTarget");
    creep.memory.path = null;
  } else if (retval === ERR_NO_PATH) {
    creep.say("noPath");
    creep.memory.path = null;
  } else {
    path = null;

    creep.say("oops." + retval);
    creep.memory.path = path;
    // second chance path was also out of range
  }

  return retval;
}

module.exports = smartMove;
