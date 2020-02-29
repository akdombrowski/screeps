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
  let roll = creep.memory.role;
  let direction = creep.memory.direction;
  let rm = creep.room;
  let name = creep.name;
  let pos = creep.pos;
  let lastStop;
  let desPath;
  let serPath;
  let isOnPath;
  let checkLastStop;
  pathColor = pathColor || "#ffffff";
  pathMem = 0; // Math.random() * 2 - 1;
  maxOps = Math.random() * 200;

  if (creep.fatigue > 0) {
    return null;
  }

  // keep them separate to allow fine tuning of maxOps
  if (name === "claimNE") {
    maxOps = 1000;
  } else if (roll === "upCNE") {
    maxOps = 1000;
  } else if (roll === "upCN") {
    maxOps = 500;
  } else if (name.endsWith("W")) {
    maxOps = 500;
  } else if (name.startsWith("claim")) {
    maxOps = 200;
  } else if (name.endsWith("E")) {
    maxOps = 500;
  } else if (roll === "neBuilder") {
    maxOps = 500;
  } else if (roll === "worker" && direction === "eeast") {
    maxOps = 500;
  } else if (name.startsWith("etowerHarvester")) {
    maxOps = 500;
  } else if (name.startsWith("eeUp")) {
    maxOps = 200;
  } else if (
    creep.memory.sourceDir === "eeast" &&
    (roll === "worker" || roll === "eeworker")
  ) {
    maxOps = 500;
  }

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



  let opts = creep.memory.opts;
  let maxCost = 10000;
  if (!opts) {
    opts = {
      // We need to set the defaults costs higher so that we
      // can set the road cost lower in `roomCallback`
      plainCost: 3,
      swampCost: 5,
      maxOps: maxOps,
      serialize: true,
      range: range,
      ignoreCreeps: false,
      maxRooms: 4,

      costCallback: function(roomName, costMatrix) {
        let room = Game.rooms[roomName];
        // In this example `room` will always exist, but since
        // PathFinder supports searches which span multiple rooms
        // you should be careful!
        if (!room) return;

        costMatrix = new PathFinder.CostMatrix();
        let creepCost = 255;
        let ter = new Room.Terrain(roomName);

        room.find(FIND_STRUCTURES).forEach(function(struct) {
          const x = struct.pos.x;

          const y = struct.pos.y;

          if (struct.structureType === STRUCTURE_ROAD) {
            // Favor roads over plain tiles
            costMatrix.set(x, y, 0);
          } else if (struct.structureType === STRUCTURE_CONTAINER) {
            // should already be set to the right value based on terrain costs above
            costMatric.set(x, y, 1);
          } else if (
            struct.structureType === STRUCTURE_RAMPART &&
            costMatrix.get(x, y) < 1
          ) {
            costMatrix.set(x, y, 1);
          } else if (struct.structureType === STRUCTURE_WALL) {
            costMatrix.set(x, y, 255);
          } else {
            // Can't walk through non-walkable buildings
            // let rmPos = struct.pos;
            // let objs = rmPos.look();
            // let isRoadThere = _.find(objs, lookObject => {
            //   if (
            //     lookObject.type === "structure" &&
            //     lookObject.structure.structureType === STRUCTURE_ROAD
            //   ) {
            //     costs.set(struct.pos.x, struct.pos.y, 0);
            //     return true;
            //   }
            // });
            costMatrix.set(x, y, 255);
          }
        });

        costMatrix.set(31, 11, 255);

        // Avoid creeps in the room
        room.find(FIND_CREEPS).forEach(function(c) {
          costMatrix.set(c.pos.x, c.pos.y, creepCost);
        });

        // if (room.name === "E35N31") {
        //   let rd = _.find(room.lookForAt(LOOK_STRUCTURES, 29, 14), struct => {
        //     return struct.structureType === STRUCTURE_ROAD;
        //   });

        //   if (rd) {
        //     costMatrix.set(rd.pos.x, rd.pos.y, 0);
        //   }

        //   rd = _.find(room.lookForAt(LOOK_STRUCTURES, 30, 14), struct => {
        //     return struct.structureType === STRUCTURE_ROAD;
        //   });

        //   if (rd) {
        //     costMatrix.set(rd.pos.x, rd.pos.y, 0);
        //   }

        //   rd = _.find(room.lookForAt(LOOK_STRUCTURES, 30, 15), struct => {
        //     return struct.structureType === STRUCTURE_ROAD;
        //   });

        //   if (rd) {
        //     costMatrix.set(rd.pos.x, rd.pos.y, 0);
        //   }

        //   rd = _.find(room.lookForAt(LOOK_STRUCTURES, 30, 16), struct => {
        //     return struct.structureType === STRUCTURE_ROAD;
        //   });

        //   if (rd) {
        //     costMatrix.set(rd.pos.x, rd.pos.y, 0);
        //   }
        // }

        Memory.costMatrix = JSON.stringify(costMatrix.serialize());
        return costMatrix;
      },
    };
    creep.memory.costMatrix = opts;
  }

  PathFinder.use(true);
  let ret = creep.room.findPath(creep.pos, destPos, opts);
  path = ret;

  try {
    serPath = path;
    desPath = Room.deserializePath(serPath);
    creep.memory.path = JSON.stringify(serPath);
  } catch (e) {
    console.log(name + " no despath");
    return null;
  }

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

    if (!isOnPath || !checkLastStop) {
      path = null;
    }
  }

  // Check if 1st path try, or path from memory, gets us where we want to go.
  if (serPath && checkLastStop && isOnPath) {
    creep.memory.path = serPath;
    return serPath;

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

  path = null;
  creep.memory.path = null;
  creep.say("null");
  return null;
}

module.exports = getAPath;
