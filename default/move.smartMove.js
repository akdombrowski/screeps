const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const getPath = require("./move.getPath");
const getRandomColor = require("./utilities.getRandomColor");
const profiler = require("./screeps-profiler");
const { getDestPos } = require("./move.getDestPos");
const { tryMoveByPath } = require("./move.tryMoveByPath");
const { setVisualAndPathInMemory } = require("./move.setVisualAndPathInMemory");
const { shiftPathIfNecessary } = require("./move.shiftPathIfNecessary");
const {
  retryMoveByPathAfterERR_NOT_FOUND,
} = require("./move.retryMoveByPathAfterERR_NOT_FOUND");
const {
  retryMoveByPathAfterShiftingPath,
} = require("./move.retryMoveByPathAfterShiftingPath");
const { checkIfValidPath } = require("./move.checkIfValidPath");
const { smartMoveReaction } = require("./move.smartMoveReaction");
const { convertPathToRoomPositions } = require("./convertPathToRoomPositions");
const { tryDeserializingPath } = require("./tryDeserializingPath");
const { stuckCreepMovement } = require("./move.stuckCreepMovement");

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
  if (Game.cpu.getUsed() >= (Game.cpu.tickLimit / 100) * 50) {
    return -99;
  }

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
  pathMem = pathMem || Math.floor(Math.random() * 100) + 1;
  maxOps = maxOps || Math.floor(Math.random() * 1000) + 1500;
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

  // will try to deserialize if path is a string and return the output, otherwise it just returns the variable path back
  path = tryDeserializingPath(path);

  // Is the creep stuck? Keep track of last position and compare it to the current creep position
  let retval2 = stuckCreepMovement(
    creep,
    lastCreepPos,
    dest,
    range,
    pathColor,
    pathMem,
    maxOps,
    maxRms
  );
  if (retval2 >= 0 || retval2 === -16) {
    return retval2;
  }
  // if (lastCreepPos && lastCreepPos.x) {
  //   lastCreepPos = new RoomPosition(
  //     lastCreepPos.x,
  //     lastCreepPos.y,
  //     lastCreepPos.roomName
  //   );
  //   if (lastCreepPos.isEqualTo(creepPos.x, creepPos.y)) {
  //     // stuck means they were at the same position the previous two ticks
  //     // since the current tick is equal to their last position, that means if they're also stuck, the've been in the same spot for 3 ticks. Try using moveTo with ignore creeps set to false to get out of stuck position
  //     if (stuck) {
  //       creep.memory.path = null;
  //       retval = creep.moveTo(dest, {
  //         reusePath: 0,
  //         serializeMemory: false,
  //         ignoreCreeps: false,
  //         maxRooms: 1,
  //         maxOps: 100,
  //         range: range,
  //         visualizePathStyle: {
  //           fill: "transparent",
  //           stroke: pathColor,
  //           lineStyle: "dashed",
  //           strokeWidth: 0.25,
  //           opacity: 0.2,
  //         },
  //       });

  //       // if (creep.name.startsWith("hdS")) {
  //       //   console.log("retval0: " + retval);
  //       // }

  //       if (retval === OK) {
  //         let newPathArray = [];
  //         creep.memory.stuck = false;

  //         if (creep.memory._move) {
  //           path = creep.memory._move.path;

  //           path.forEach((step) => {
  //             // console.log(JSON.stringify(step));
  //             let px = step.x + step.dx;
  //             let py = step.y + step.dy;
  //             let roomName = creep.room.name;
  //             let pos = new RoomPosition(px, py, roomName);
  //             newPathArray.push(pos);
  //           });

  //           creep.memory.path = newPathArray;
  //         }
  //       }

  //       return retval;
  //     }

  //     creep.memory.stuck = true;
  //     path = null;
  //     creep.memory.path = null;
  //     ignoreCreeps = false;
  //   } else {
  //     creep.memory.stuck = false;
  //   }
  // }

  path = convertPathToRoomPositions(path);

  // if(creep.name.startsWith("hdS")) {
  //   console.log("path: " + path)
  // }

  // no path in memory.path. get one.
  if (!path || path.length <= 0 || pathMem < 1) {
    getPath(creep, dest, range, ignoreCreeps, pathColor, pathMem, maxOps, 1);
    path = creep.memory.path;

    // if(creep.name.startsWith("hdS")) {
    //   console.log("path2: " + path)
    // }
  }

  path = checkIfValidPath(path, name);

  creep.memory.lastCreepPos = creepPos;
  if (path) {
    retval = tryMoveByPath(creep, path, name);

    // if(creep.name.startsWith("hdS")) {
    //   console.log("retval: " + retval)
    // }

    if (retval === OK) {
      creep.memory.lastCreepPos = creep.pos;
      setVisualAndPathInMemory(creep, path, pathColor);
    } else if (retval === ERR_NOT_FOUND) {
      //   shiftPathIfNecessary(path, creepPos);

      //   retval = retryMoveByPathAfterERR_NOT_FOUND(
      //     creep,
      //     path,
      //     pathColor,
      //     creepPos
      //   );

      //   if (retval != OK) {
      //     retval = retryMoveByPathAfterShiftingPath(creep, path, pathColor);
      //   } else {
      //     creep.memory.path = null;
      //   }
      // }
      creep.memory.path = null;
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

  path = smartMoveReaction(
    retval,
    path,
    creep,
    destPos,
    pathColor,
    dest,
    range
  );

  return retval;
}

smartMove = profiler.registerFN(smartMove, "smartMove");
module.exports = smartMove;
