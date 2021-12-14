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
  maxRms,
  flee,
  fleeFromCreeps
) {
  let s;
  let retval = -16;
  let blockage;
  let noPathFinding = true;
  let path = creep.memory.path;
  const rm = creep.room;
  const name = creep.name;
  const creepPos = creep.pos;
  let lastCreepPos = creep.memory.lastCreepPos;
  let desPath;
  pathColor = pathColor || getRandomColor();
  pathMem = pathMem || Math.floor(Math.random() * 100);
  maxOps = maxOps || Math.floor(Math.random() * 500) + 1;
  maxRms = maxRms || 1;
  ignoreCreeps = ignoreCreeps || true;

  if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  } else if (!dest && !flee) {
    console.log();
    console.log(name + " smartMove no destination");

    creep.say("no destination");
    return retval;
  }

  let destPos = dest;
  if (destPos && dest.room) {
    if (!(destPos instanceof RoomPosition)) {
      destPos = new RoomPosition(dest.pos.x, dest.pos.y, dest.room.name);
    }
  } else if (flee) {
    let ret = PathFinder.search(
      creep.pos,
      { pos: new RoomPosition(25, 25, creep.room.name), range: 10 },
      {
        flee: true,
        maxOps: maxOps,
        maxRooms: 1,
      }
    );
    retval = creep.moveByPath(ret.path);

    creep.say("aaaaahhhhh");
    return retval;
  }

  if (creepPos.inRangeTo(destPos, range)) {
    creep.memory.path = null;
    return OK;
  }

  if (lastCreepPos) {
    lastCreepPos = new RoomPosition(
      lastCreepPos.x,
      lastCreepPos.y,
      lastCreepPos.roomName
    );
    if (lastCreepPos.isEqualTo(creepPos.x, creepPos.y)) {
      path = null;
      creep.memory.path = null;
      ignoreCreeps = false;
    }
  }

  // no path in memory.path. get one.
  if (!path || path.length <= 0 || pathMem < 1) {
    getPath(creep, dest, range, ignoreCreeps, pathColor, pathMem, maxOps);
    path = creep.memory.path;
  }

  if (path && path[0].x && !(path[0] instanceof RoomPosition)) {
    path = path.map((p) => new RoomPosition(p.x, p.y, p.roomName));
  }

  // if (
  //   path &&
  //   path[0] &&
  //   path[0].pos &&
  //   path[0].pos.x != creep.pos.x &&
  //   path[0].pos.y != creep.pos.y
  // ) {
  //   path = null;
  //   return retval;
  // }

  if ((path && path.length === 0) || !path || !path[0]) {
    console.log();
    console.log(name + " smartMove no path");
  }

  creep.memory.lastCreepPos = creepPos;
  if (path) {
    try {
      retval = creep.moveByPath(path);
    } catch (e) {
      console.log();
      console.log(name + " moveByPath exception " + path);

      creep.memory.path = null;
      retval = -16;
    }

    if (retval === OK) {
      if (path[0] && path[0].x && creep.pos.isEqualTo(path[0].x, path[0].y)) {
        path.shift();
      }

      creep.memory.path = path;
    } else if (retval === ERR_NOT_FOUND) {
      if (path[0] && path[0].x && creepPos.isEqualTo(path[0].x, path[0].y)) {
        path.shift();
      }

      try {
        retval = creep.moveByPath(path);

        if (retval === OK) {
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

      if (creep.pos === path[1]) {
        path.shift();
        retval = creep.moveByPath(path);
        if (retval === OK) {
          path.shift();
          creep.memory.path = path;
        } else {
          creep.memory.path = null;
        }
      } else {
        creep.memory.path = null;
      }
    }
  }

  // if (!path || retval != OK) {
  //   creep.memory.path = null;
  //   retval = creep.moveTo(destPos, {
  //     plainCost: 1,
  //     swampCost: 2,
  //     range: range,
  //     ignoreCreeps: ignoreCreeps,
  //     noPathFinding: false,
  //     reusePath: pathMem,
  //     maxOps: maxOps,
  //     maxRooms: maxRms,
  //     serializeMemory: true,
  //     visualizePathStyle: {
  //       fill: "transparent",
  //       stroke: pathColor,
  //       lineStyle: "dashed",
  //       strokeWidth: 0.15,
  //       opacity: 0.1,
  //     },
  //   });
  // }

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

  if (retval != 0) {
    console.log();
    console.log("path === null " + (path === null));
    console.log("path.length === 0 " + (path && path.length <= 0));
    console.log(name + " path " + path);
    console.log(name + " retval " + retval + " creep.pos " + creepPos);
  }

  if (retval === OK || (path && path.length <= 0)) {
    retval = OK;
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

    console.log();
    console.log(name + " smartMove oops " + retval);

    creep.say("oops." + retval);
    creep.memory.path = path;
    // second chance path was also out of range
  }

  return retval;
}

module.exports = smartMove;
