const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const profiler = require("./screeps-profiler");

function findAPath(
  destPos,
  opts,
  path,
  serPath,
  desPath,
  e,
  name,
  isOnPath,
  checkLastStop,
  range
) {
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
    isOnPath = _.find(desPath, (step) => {
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

  if (serPath && checkLastStop && isOnPath) {
    creep.memory.path = serPath;
    return serPath;
  }

  return null;
}

findAPath = profiler.registerFN(findAPath, "findAPath");

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

      costCallback: function (roomName, costMatrix) {
        let room = Game.rooms[roomName];
        // In this example `room` will always exist, but since
        // PathFinder supports searches which span multiple rooms
        // you should be careful!
        if (!room) return;

        costMatrix = new PathFinder.CostMatrix();
        let creepCost = 255;
        let ter = new Room.Terrain(roomName);

        room.find(FIND_STRUCTURES).forEach(function (struct) {
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
        room.find(FIND_CREEPS).forEach(function (c) {
          costMatrix.set(c.pos.x, c.pos.y, creepCost);
        });

        Memory.costMatrix = JSON.stringify(costMatrix.serialize());
        return costMatrix;
      },
    };
    creep.memory.costMatrix = opts;
  }

  let path = findAPath(
    destPos,
    opts,
    path,
    serPath,
    desPath,
    e,
    name,
    isOnPath,
    checkLastStop,
    range
  );

  creep.memory.path = path;
  return path;
}

getAPath = profiler.registerFN(getAPath, "getAPath");

module.exports = getAPath;
