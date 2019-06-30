const moveAwayFromCreep = require("./action.moveAwayFromCreep");

function smartMove(
  creep,
  dest,
  range,
  ignoreCreeps = true,
  pathColor = "#ffffff",
  pathMem = 2000,
  maxOps = 100
) {
  let s;
  let retVal = -16;
  let blockage;
  let noPathFinding = true;
  let path = creep.memory.path;
  let rm = creep.room;
  let name = creep.name;
  let pos = creep.pos;
  ignoreCreeps = ignoreCreeps;
  pathColor = pathColor || "#ffffff";
  pathMem = pathMem || 2000;
  maxOps = maxOps || 100;

  if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  }

  blockage = moveAwayFromCreep(creep);
  if (
    blockage ||
    !ignoreCreeps //||
  ) {
    ignoreCreeps = false;
    pathMem = 0;
    noPathFinding = false;
    creep.say("out of my way creep");
    path = null;
  }


  if(name === "h077E") {
    console.log(name + " dest:   " + dest);
  }
  let destPos = dest;
  if (dest.pos) {
    destPos = dest.pos;
  }
  if (!path) {
    path = rm.findPath(pos, destPos, {
      ignoreCreeps: ignoreCreeps,
      range: range,
      maxOps: maxOps,
      serialize: true,
    });
  }

  let lastStop = path[path.length - 1];
  if (path &&
    lastStop &&
    lastStop.x <= destPos.x + range &&
    lastStop.y <= destPos.y + range &&
    lastStop.x <= destPos.x - range &&
    lastStop.y <= destPos.y - range
  ) {
    creep.memory.path = path;
    retval = creep.moveByPath(Room.deserializePath(path));
    if (retval === OK) {
      if (creep.pos.inRangeTo(dest, range)) {
        creep.memory.path = null;
      }
      return retval;
    }
  } else {
    maxOps *= 5;
  }

  retval = creep.moveTo(dest, {
    reusePath: pathMem,
    ignoreCreeps: ignoreCreeps,
    range: range,
    maxOps: maxOps,
    serializeMemory: true,
    noPathFinding: noPathFinding,
    visualizePathStyle: { stroke: pathColor },
  });

  if (retval === ERR_INVALID_TARGET || retval === ERR_NOT_FOUND) {
    retval = creep.moveTo(dest, {
      reusePath: pathMem,
      ignoreCreeps: ignoreCreeps,
      range: range,
      maxOps: maxOps,
      serializeMemory: true,
      noPathFinding: false,
      visualizePathStyle: { stroke: "#000000" },
    });
  } else if (retval === ERR_NO_PATH) {
    retval = creep.moveTo(dest, {
      reusePath: 0,
      ignoreCreeps: ignoreCreeps,
      range: range,
      maxOps: maxOps * 2,
      serializeMemory: false,
      noPathFinding: false,
      visualizePathStyle: { stroke: "#0FFFFF" },
    });
  }

  creep.say("m." + retval);
  return retval;
}

module.exports = smartMove;
