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
  maxOps = Math.random() * 100000;

  if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  }

  if (!path) {
    console.log(name + " getting a path " + dest);
    path = getAPath(
      creep,
      dest,
      range,
      ignoreCreeps,
      pathColor,
      pathMem,
      maxOps
    );
    console.log(name + " " + path[path.length - 1]);
    creep.memory.path = path;
  }

  // No path. Try finding path using maxOps.
  if (!path) {
    let ops = maxOps;
    path = rm.findPath(pos, destPos, {
      ignoreCreeps: false,
      range: range,
      maxOps: ops,
      serialize: true,
    });
  }

  let desPath = path;

  // Check if 1st path try, or path from memory, gets us where we want to go.
  if (desPath) {
    if (desPath instanceof String) {
      desPath = Room.deserializePath(desPath);
    }

    creep.memory.path = path;
    desPath2 = Array.from(desPath);
    desPath2.unshift(creep.pos);
    retval = creep.moveByPath(desPath);

    console.log(name + " " + retval + " m" + " " + range + " " + desPath[0]);

    if (retval === OK) {
      if (creep.pos.inRangeTo(dest, range)) {
        creep.memory.path = null;
      }
      creep.say("m");
      return retval;
    } else {
      path = null;
      creep.memory.path = path;
      // second chance path was also out of range
    }
  } else {
    path = null;
    creep.memory.path = path;
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

  // if (retval === ERR_INVALID_TARGET || retval === ERR_NOT_FOUND) {
  //   retval = creep.moveTo(dest, {
  //     reusePath: pathMem,
  //     ignoreCreeps: ignoreCreeps,
  //     range: range,
  //     maxOps: maxOps,
  //     serializeMemory: true,
  //     noPathFinding: false,
  //     visualizePathStyle: { stroke: "#000000" },
  //   });
  // } else if (retval === ERR_NO_PATH) {
  //   retval = creep.moveTo(dest, {
  //     reusePath: 0,
  //     ignoreCreeps: ignoreCreeps,
  //     range: range,
  //     maxOps: maxOps * 2,
  //     serializeMemory: false,
  //     noPathFinding: false,
  //     visualizePathStyle: { stroke: "#0FFFFF" },
  //   });
  // }

  creep.say("m." + retval);
  return retval;
}

module.exports = smartMove;
