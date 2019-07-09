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
  let retval = -16;
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
  if (blockage || !ignoreCreeps) {
    // console.log(name + " blockage " + blockage);

    ignoreCreeps = false;
    pathMem = 0;
    noPathFinding = false;
    creep.say("out of my way creep");
    path = null;
    creep.memory.path = null;
    return;
  }

  let destPos = dest;
  if (dest.pos) {
    destPos = dest.pos;
  }


  // No path. Try finding path using maxOps.
  if (!path) {
    let ops = 1500;
    path = rm.findPath(pos, destPos, {
      ignoreCreeps: false,
      range: range,
      maxOps: ops,
      serialize: true,
    });
  }


  let desPath = Room.deserializePath(path);
  let lastStop = desPath[desPath.length - 1];
  let myPos = _.find(desPath, (step) => {
    return creep.pos.isNearTo(step.x, step.y);
  });


  // Check if 1st path try, or path from memory, gets us where we want to go.
  if (
    path &&
    lastStop &&
    myPos
  ) {
    creep.memory.path = path;
    retval = creep.moveByPath(path);


    if (retval === OK) {
      if (creep.pos.inRangeTo(dest, range)) {
        creep.memory.path = null;
      }

      // return retval;
    } else {
      path = null;
      creep.memory.path = null;
      // second chance path was also out of range
    }
  } else {
    path = null;
    creep.memory.path = null;
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
