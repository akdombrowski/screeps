const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const getRandomColor = require("./getRandomColor");

function getPath(
  creep,
  dest,
  range,
  ignoreCreeps,
  pathColor,
  pathMem,
  maxOps,
  maxRms
) {
  let s;
  let retval = -16;
  let blockage;
  let noPathFinding = true;
  let path = creep.memory.path;
  const rm = creep.room;
  const name = creep.name;
  const creepPos = creep.pos;
  let desPath;
  const roll = creep.memory.role;
  const direction = creep.memory.direction;
  pathColor = pathColor || getRandomColor();
  pathMem = pathMem || Math.floor(Math.random() * 100);
  maxOps = maxOps || Math.floor(Math.random() * 100) + 1;
  maxRms = maxRms || 1;
  ignoreCreeps = ignoreCreeps || false;

  if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  } else if (!dest) {
    creep.say("no destination");
    return retval;
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
    console.log();
    console.log(name + " getPath no destPos");
    return null;
  }

  if (creep.memory.path) {
    return OK;
  }

  let goals = { pos: destPos, range: range };

  let ret = PathFinder.search(creepPos, goals, {
    // We need to set the defaults costs higher so that we
    // can set the road cost lower in `roomCallback`
    plainCost: 2,
    swampCost: 10,

    roomCallback: function (roomName) {
      let room = Game.rooms[roomName];
      // In this example `room` will always exist, but since
      // PathFinder supports searches which span multiple rooms
      // you should be careful!
      if (!room) return;
      let costs = new PathFinder.CostMatrix();

      room.find(FIND_STRUCTURES).forEach(function (struct) {
        if (struct.structureType === STRUCTURE_ROAD) {
          // Favor roads over plain tiles
          costs.set(struct.pos.x, struct.pos.y, 1);
        } else if (
          struct.structureType !== STRUCTURE_CONTAINER &&
          (struct.structureType !== STRUCTURE_RAMPART || !struct.my)
        ) {
          // Can't walk through non-walkable buildings
          costs.set(struct.pos.x, struct.pos.y, 0xff);
        }
      });

      let creepArr = creepPos.findInRange(FIND_CREEPS, 1);
      if (!ignoreCreeps || creepArr.length > 0) {
        // Avoid creeps in the room
        if (creepArr.length > 0) {
          for (const c of creepArr) {
            if (c.pos) {
              costs.set(c.pos.x, c.pos.y, 0xff);
            }
          }
        } else {
          room.find(FIND_CREEPS).forEach(function (creep) {
            costs.set(creep.pos.x, creep.pos.y, 0xff);
          });
        }
      }

      return costs;
    },
    flee: false,
    maxOps: maxOps,
    maxRooms: 1,
  });

  if (ret.incomplete) {
    if (ret.path &&
      ret.path[ret.path.length - 1] &&
      ret.path[ret.path.length - 1].pos &&
      !ret.path[ret.path.length - 1].pos.isNearTo(destPos)
    ) {
      console.log();
      console.log(name + " getPath need more ops for pathfinding");

      ret = PathFinder.search(creepPos, goals, {
        // We need to set the defaults costs higher so that we
        // can set the road cost lower in `roomCallback`
        plainCost: 2,
        swampCost: 10,
        flee: false,
        maxOps: maxOps * 10,
        maxRooms: 1,

        roomCallback: function (roomName) {
          let room = Game.rooms[roomName];
          // In this example `room` will always exist, but since
          // PathFinder supports searches which span multiple rooms
          // you should be careful!
          if (!room) return;
          let costs = new PathFinder.CostMatrix();

          room.find(FIND_STRUCTURES).forEach(function (struct) {
            if (struct.structureType === STRUCTURE_ROAD) {
              // Favor roads over plain tiles
              costs.set(struct.pos.x, struct.pos.y, 1);
            } else if (
              struct.structureType !== STRUCTURE_CONTAINER &&
              (struct.structureType !== STRUCTURE_RAMPART || !struct.my)
            ) {
              // Can't walk through non-walkable buildings
              costs.set(struct.pos.x, struct.pos.y, 0xff);
            }
          });

          // // Avoid creeps in the room
          // room.find(FIND_CREEPS).forEach(function (creep) {
          //   costs.set(creep.pos.x, creep.pos.y, 0xff);
          // });

          return costs;
        },
      });

      if (ret.incomplete) {
        creep.memory.path = ret.path;
        return ERR_NO_PATH;
      } else {
        creep.memory.path = ret.path;
        return OK;
      }
    } else {
      console.log();
      return OK;
    }
  } else {
    creep.memory.path = ret.path;
    return OK;
  }
}

module.exports = getPath;
