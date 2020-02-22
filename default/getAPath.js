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
  let serPath;
  let isOnPath;
  let checkLastStop;
  ignoreCreeps = ignoreCreeps;
  pathColor = pathColor || "#ffffff";
  pathMem = Math.random() * 100 - 1;
  maxOps = Math.random() * 2000;

  let destPos = dest;
  if (destPos && (dest.room || dest.roomName)) {
    let rmName = dest.roomName;
    if (!rmName) {
      rmName = dest.room.name;
    }

    if (!(destPos instanceof RoomPosition)) {
      destPos = new RoomPosition(dest.pos.x, dest.pos.y, rmName);
    }
  } else {
    return null;
  }

  let opts;

  if (!path || pathMem === 0) {
    if (!opts) {
      opts = {
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
          let creepCost = 0xff;

          room.find(FIND_STRUCTURES).forEach(function(struct) {
            if (struct.structureType === STRUCTURE_ROAD) {
              // Favor roads over plain tiles
              costs.set(struct.pos.x, struct.pos.y, 0);
            } else if (
              (struct.structureType !== STRUCTURE_CONTAINER &&
                struct.structureType !== STRUCTURE_RAMPART) ||
              !struct.my
            ) {
              // Can't walk through non-walkable buildings
              costs.set(struct.pos.x, struct.pos.y, 0xff);
            }
          });

          // Avoid creeps in the room
          room.find(FIND_CREEPS).forEach(function(c) {
            costs.set(c.pos.x, c.pos.y, creepCost);
          });

          return costs;
        },
      };
      Memory.costMatrix = opts;
      creep.memory.costMatrix = opts;
    }

    let goals = { pos: destPos, range: range };

    let ret = PathFinder.search(creep.pos, goals, opts);

    path = ret.path;
  } else {
    try {
      serPath = Room.serializePath(path);
      try {
        desPath = Room.deserializePath(serPath);
      } catch (err) {
        creep.memory.path = null;
        console.log("here line 114");
        return null;
      }
    } catch (e) {
      desPath = path;
    }
  }

  desPath = path;
  creep.memory.path = path;

  // path.shift();

  if (desPath) {
    lastStop = desPath[desPath.length - 1];
    isOnPath = _.find(desPath, step => {
      return creep.pos.isNearTo(step.x, step.y);
    });

    checkLastStop = false;

    if (destPos && creep.room !== destPos.roomName) {
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

    if (path) {
      creep.memory.path = path;
      desPath = Room.deserializePath(path);
      path = desPath;

      lastStop = desPath[desPath.length - 1];
      isOnPath = _.find(desPath, step => {
        return creep.pos.isNearTo(step.x, step.y);
      });

      if (lastStop && destPos.inRangeTo(lastStop.x, lastStop.y, range)) {
        checkLastStop = true;
      }
    }
  }

  // Check if 1st path try, or path from memory, gets us where we want to go.
  if (desPath && checkLastStop && isOnPath) {
    creep.memory.path = path;
    return path;

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
  console.log(creep.name + " retval: " + path);
  return null;
}

module.exports = getAPath;
