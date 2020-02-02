const moveAwayFromCreep = require("./action.moveAwayFromCreep");

function getAPath(
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
  let lastStop;
  let desPath;
  let isOnPath;
  let checkLastStop;
  ignoreCreeps = ignoreCreeps;
  pathColor = pathColor || "#ffffff";
  pathMem = Math.random() * 100 - 1;
  maxOps = Math.random() * 10000;

  blockage = moveAwayFromCreep(creep);
  if (blockage) {
    // console.log(name + " blockage " + blockage);

    ignoreCreeps = false;
    pathMem = 0;
    noPathFinding = false;
    creep.say("out of my way creep");
    path = null;
    creep.memory.path = path;

    return;
  }

  let destPos = dest;
  if (dest.pos) {
    destPos = dest.pos;
    if (!(destPos instanceof RoomPosition)) {
      destPos = new RoomPosition(dest.pos.x, dest.pos.y, dest.room.name);
    }
  }

  let costMatrix;

  if (!path || pathMem === 0) {
    if (!costMatrix) {
      costMatrix = {
        // We need to set the defaults costs higher so that we
        // can set the road cost lower in `roomCallback`
        plainCost: 1,
        swampCost: 2,
        maxOps: maxOps,

        roomCallback: function(roomName) {
          let room = Game.rooms[roomName];
          // In this example `room` will always exist, but since
          // PathFinder supports searches which span multiple rooms
          // you should be careful!
          if (!room) return;
          let costs = new PathFinder.CostMatrix();

          room.find(FIND_STRUCTURES).forEach(function(struct) {
            if (struct.structureType === STRUCTURE_ROAD) {
              // Favor roads over plain tiles
              costs.set(struct.pos.x, struct.pos.y, 0);
            } else if (
              struct.structureType !== STRUCTURE_CONTAINER &&
              (struct.structureType !== STRUCTURE_RAMPART || !struct.my)
            ) {
              // Can't walk through non-walkable buildings
              costs.set(struct.pos.x, struct.pos.y, 0xff);
            }
          });

          // Avoid creeps in the room
          room.find(FIND_CREEPS).forEach(function(creep) {
            costs.set(creep.pos.x, creep.pos.y, 0xff);
          });

          return costs;
        },
      };
      Memory.costMatrix = costMatrix;
      creep.memory.costMatrix = costMatrix;
    }

    let goals = destPos;

    let ret = PathFinder.search(creep.pos, goals, costMatrix);

    path = ret.path;
  }

  if (path instanceof String) {
    desPath = Room.deserializePath(path);
  } else {
    desPath = path;
  }

  if (desPath) {
    lastStop = desPath[desPath.length - 1];
    isOnPath = _.find(desPath, step => {
      return creep.pos.isNearTo(step.x, step.y);
    });

    checkLastStop = false;

    if (creep.room !== destPos.roomName) {
      checkLastStop = true;
    }

    if (lastStop && destPos.inRangeTo(lastStop.x, lastStop.y, range)) {
      checkLastStop = true;
    }
  }

  if (!isOnPath || !checkLastStop) {
    path = null;
  }

  // No path. Try finding path using maxOps.
  if (!path) {
    let ops = maxOps * 2;
    path = rm.findPath(pos, destPos, {
      ignoreCreeps: false,
      range: range,
      maxOps: ops,
      serialize: true,
    });

    if (path instanceof String) {
      desPath = Room.deserializePath(path);
    } else {
      desPath = path;
    }

    lastStop = desPath[desPath.length - 1];
    isOnPath = _.find(desPath, step => {
      return creep.pos.isNearTo(step.x, step.y);
    });

    if (lastStop && destPos.inRangeTo(lastStop.x, lastStop.y, range)) {
      checkLastStop = true;
    }
  }

  // Check if 1st path try, or path from memory, gets us where we want to go.
  if (desPath && checkLastStop && isOnPath) {
    creep.memory.path = path;
    return desPath;

    retval = creep.moveByPath(path, {
      visualizePathStyle: {
        fill: "transparent",
        stroke: "#fff",
        lineStyle: "dashed",
        strokeWidth: 0.15,
        opacity: 0.1,
      },
    });

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

  creep.say("gap." + retval);
  return retval;
}

module.exports = getAPath;
