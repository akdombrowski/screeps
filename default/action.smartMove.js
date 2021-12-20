const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const getPath = require("./action.getPath");
const getRandomColor = require("./getRandomColor");
const profiler = require("./screeps-profiler");

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
  let stuck = creep.memory.stuck;
  let lastCreepPos = creep.memory.lastCreepPos;
  let desPath;
  pathColor = pathColor || getRandomColor();
  pathMem = pathMem || Math.floor(Math.random() * 100);
  maxOps = maxOps || Math.floor(Math.random() * 500) + 1;
  maxRms = maxRms || 1;
  ignoreCreeps = ignoreCreeps || true;
  flee = flee || false;

  if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    creep.memory.stuck = false;
    return ERR_TIRED;
  } else if (!dest && !flee) {
    console.log(name + " smartMove no destination");

    creep.say("no destination");
    return retval;
  }

  let destPos = getDestPos(dest);

  if (flee) {
    return flee(creep, maxOps, path, pathColor);
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
      if (stuck) {
        creep.memory.path = null;
        retval = creep.moveTo(dest, {
          reusePath: 50,
          serializeMemory: false,
          ignoreCreeps: false,
          maxRooms: 1,
          maxOps: 100,
          range: range,
          visualizePathStyle: {
            fill: "transparent",
            stroke: pathColor,
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.2,
          },
        });

        if (retval === OK) {
          creep.memory.stuck = false;
          if (creep.memory._move.path instanceof String) {
            path = Room.deserializePath(creep.memory._move.path);
          }
          creep.memory.path = path;
        }

        return retval;
      }

      creep.memory.stuck = true;
      path = null;
      creep.memory.path = null;
      ignoreCreeps = false;
    } else {
      creep.memory.stuck = false;
    }
  }

  // no path in memory.path. get one.
  if (!path || path.length <= 0 || pathMem < 1) {
    getPath(creep, dest, range, ignoreCreeps, pathColor, pathMem, maxOps);
    path = creep.memory.path;
  }

  if (
    path &&
    path.length > 0 &&
    path[0] &&
    path[0].x &&
    path[0].roomName &&
    !(path[0] instanceof RoomPosition)
  ) {
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

  retval = checkIfValidPath(path, name);

  creep.memory.lastCreepPos = creepPos;
  if (path) {
    retval = tryMoveByPath(creep, path, name);

    if (retval === OK) {
      setVisualAndPathInMemory(creep, path, pathColor);
    } else if (retval === ERR_NOT_FOUND) {
      shiftPathIfNecessary(path, creepPos);

      retval = retryMoveByPathAfterERR_NOT_FOUND(
        creep,
        path,
        pathColor,
        creepPos
      );

      if (retval != OK) {
        retval = retryMoveByPathAfterShiftingPath(creep, path, pathColor);
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

  // if (retval != 0) {
  //   console.log("path === null " + (path === null));
  //   console.log("path.length === 0 " + (path && path.length <= 0));
  //   console.log(name + " path " + path);
  //   console.log(name + " retval " + retval + " creep.pos " + creepPos);
  // }

  if (retval === OK || (path && path.length <= 0)) {
    retval = successfulMove(creep, destPos, path, pathColor, dest, range);
  } else if (retval === ERR_NOT_FOUND) {
    // path doesn't match creep's location
    creep.say("no match");
    creep.memory.path = null;
  } else if (retval === ERR_INVALID_TARGET) {
    creep.say("invalidTarget");
    creep.memory.path = null;
  } else if (retval === ERR_NO_PATH) {
    creep.say("noPath");
    creep.memory.path = null;
  } else {
    path = null;

    // console.log(name + " smartMove oops " + retval);

    creep.say("oops." + retval);
    creep.memory.path = path;
    // second chance path was also out of range
  }

  return retval;
}

smartMove = profiler.registerFN(smartMove, "smartMove");
module.exports = smartMove;
function successfulMove(creep, destPos, path, pathColor, dest, range) {
  let retval = OK;
  creep.say(destPos.x + "," + destPos.y);
  creep.room.visual.poly(path, {
    stroke: pathColor,
    lineStyle: "dashed",
    opacity: 0.25,
  });

  if (creep.pos.inRangeTo(dest, range)) {
    creep.memory.path = null;
  }
  return retval;
}

successfulMove = profiler.registerFN(successfulMove, "successfulMove");

function checkIfValidPath(path, name) {
  let retval = -16;
  if ((path && path.length === 0) || !path || !path[0]) {
    // console.log(name + " smartMove no path");
    retval = ERR_NOT_FOUND;
  }
  return retval;
}

checkIfValidPath = profiler.registerFN(checkIfValidPath, "checkIfValidPath");

function retryMoveByPathAfterShiftingPath(creep, path, pathColor) {
  let retval = -16;
  if (creep.pos === path[1]) {
    path.shift();
    retval = creep.moveByPath(path);
    if (retval === OK) {
      creep.room.visual.poly(path, {
        stroke: pathColor,
        lineStyle: "dashed",
        opacity: 0.25,
      });
      path.shift();
      creep.memory.path = path;
    } else {
      creep.memory.path = null;
    }
  }
  return retval;
}

retryMoveByPathAfterShiftingPath = profiler.registerFN(
  retryMoveByPathAfterShiftingPath,
  "retryMoveByPathAfterShiftingPath"
);

function retryMoveByPathAfterERR_NOT_FOUND(creep, path, pathColor, creepPos) {
  let retval = -16;
  try {
    retval = creep.moveByPath(path);

    if (retval === OK) {
      creep.room.visual.poly(path, {
        stroke: pathColor,
        lineStyle: "dashed",
        opacity: 0.25,
      });
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
  return retval;
}

retryMoveByPathAfterERR_NOT_FOUND = profiler.registerFN(
  retryMoveByPathAfterERR_NOT_FOUND,
  "retryMoveByPathAfterERR_NOT_FOUND"
);

function shiftPathIfNecessary(path, creepPos) {
  if (path[0] && path[0].x && creepPos.isEqualTo(path[0].x, path[0].y)) {
    path.shift();
  }
}

shiftPathIfNecessary = profiler.registerFN(
  shiftPathIfNecessary,
  "shiftPathIfNecessary"
);

function setVisualAndPathInMemory(creep, path, pathColor) {
  creep.room.visual.poly(path, {
    stroke: pathColor,
    lineStyle: "dashed",
    opacity: 0.25,
  });

  if (path[0] && path[0].x && creep.pos.isEqualTo(path[0].x, path[0].y)) {
    path.shift();
    creep.memory.path = path;
  }

}

setVisualAndPathInMemory = profiler.registerFN(
  setVisualAndPathInMemory,
  "setVisualAndPathInMemory"
);

function tryMoveByPath(creep, path, name) {
  let retval = -16;
  try {
    retval = creep.moveByPath(path);

    // if (name.startsWith("upCdS")) {
    //   console.log(name + " path in smartMove " + path);
    //   console.log(name + " moveByPath in smartMove " + retval);
    // }
  } catch (e) {
    console.log(name + " moveByPath exception path: " + path);

    creep.memory.path = null;
    retval = -16;
  }

  return retval;
}

tryMoveByPath = profiler.registerFN(tryMoveByPath, "tryMoveByPath");

function flee(creep, maxOps, path, pathColor) {
  let ret = PathFinder.search(
    creep.pos,
    { pos: new RoomPosition(25, 25, creep.room.name), range: 20 },
    {
      flee: true,
      maxOps: maxOps,
      maxRooms: 1,
    }
  );
  retval = creep.moveByPath(ret.path);

  let px = ret.path.length > 0 ? ret.path[0].x : "";
  let py = ret.path.length > 0 ? ret.path[0].y : "";
  creep.say("ah!" + px + "," + py);
  if (retval === OK || retval === ERR_TIRED) {
    creep.room.visual.poly(path, {
      stroke: pathColor,
      strokeWidth: 0.1,
      lineStyle: "dashed",
      opacity: 0.2,
    });
  }
  return retval;
}

flee = profiler.registerFN(flee, "flee");

function getDestPos(dest) {
  let destPos = dest;
  if (destPos && dest.room) {
    if (!(destPos instanceof RoomPosition)) {
      destPos = new RoomPosition(dest.pos.x, dest.pos.y, dest.room.name);
    }
  }
  return destPos;
}

getDestPos = profiler.registerFN(getDestPos, "getDestPos");
