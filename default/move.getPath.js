const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const getRandomColor = require("./utilities.getRandomColor");
const getRoomTerrainCosts = require("./move.getRoomTerrainCosts");
const profiler = require("./screeps-profiler");

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
  pathMem = pathMem || Math.floor(Math.random() * 100) + 100;
  maxOps = maxOps || Math.floor(Math.random() * 2000) + 1000;
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
    console.log(name + " getPath no destPos");
    return null;
  }

  if (creep.memory.path) {
    return OK;
  }

  let goals = { pos: destPos, range: range };

  let ret = PathFinder.search(creepPos, goals, {
    // // We need to set the defaults costs higher so that we
    // // can set the road cost lower in `roomCallback`
    // plainCost: 2,
    // swampCost: 11,
    // roadCost: 0, // not an actual parameter

    roomCallback: function (roomName) {
      let room = Game.rooms[roomName];
      // In this example `room` will always exist, but since
      // PathFinder supports searches which span multiple rooms
      // you should be careful!
      if (!room) return;
      let visual = room.visual;
      // let costs = new PathFinder.CostMatrix();
      let direction = "home";
      switch (creep.room.name) {
        case Memory.homeRoomName:
          direction = "home";
          break;
        case Memory.westRoomName:
          direction = "west";
          break;
        case Memory.northwestRoomName:
          direction = "northwest";
          break;
        case Memory.southRoomName:
          direction = "south";
          break;
        case Memory.northRoomName:
          direction = "north";
          break;
        default:
          direction = "home";
          break;
      }

      // by default values with a value of 0 uses the default terrain value
      let costs = getRoomTerrainCosts(roomName, direction);

      // let x = 14;
      // let y = 32;
      // let rName = Memory.homeRoomName;

      // if (room.name === rName) {
      //   console.log(rName + " (" + x + "," + y + "): " + costs.get(x, y));
      // }

      room.find(FIND_STRUCTURES, {
        filter: (struct) => {
          if (struct.structureType === STRUCTURE_ROAD) {
            // visual.circle(struct.pos, {
            //   fill: "transparent",
            //   radius: 0.15,
            //   stroke: "red",
            // });
            costs.set(struct.pos.x, struct.pos.y, 0);
          } else if (
            struct.structureType !== STRUCTURE_CONTAINER &&
            !(struct.structureType === STRUCTURE_RAMPART && struct.my)
          ) {
            // Can't walk through non-walkable buildings
            // visual.circle(struct.pos, {
            //   fill: "transparent",
            //   radius: 0.15,
            //   stroke: "blue",
            // });
            costs.set(struct.pos.x, struct.pos.y, 0xff);
          }
        },
      });

      if (!ignoreCreeps) {
        let creepArr = creepPos.findInRange(FIND_CREEPS, 3);
        // Avoid creeps in the room
        for (const c of creepArr) {
          // body parts array of creep
          let bodyParts = c.body;
          // new array with just the MOVE body parts
          let moveBodyParts = bodyParts.filter((part) => part === MOVE);
          let numberOfMoveBodyParts = moveBodyParts.length;
          // how much fatigue this creep can recover from in a game tick
          let fatigueRecoverablePerTick = numberOfMoveBodyParts * 2;
          if (c.pos) {
            if (c.fatigue > fatigueRecoverablePerTick) {
              // creep isn't moving due to fatigue
              visual.circle(c.pos, {
                fill: "transparent",
                radius: 0.15,
                stroke: "green",
              });
              costs.set(c.pos.x, c.pos.y, 0xff);
            } else if (c.memory) {
              let path = c.memory.path;

              if (path && path.length > 0) {
                // creep has a path and no fatigue
                visual.circle(path[0], {
                  fill: "transparent",
                  radius: 0.15,
                  stroke: "green",
                });
                costs.set(path[0].x, path[0].y, 0xff);
              } else {
                // creep has no path, likely not moving
                visual.circle(c.pos, {
                  fill: "transparent",
                  radius: 0.15,
                  stroke: "green",
                });
                costs.set(c.pos.x, c.pos.y, 0xff);
              }
            }
          }
        }
      }

      // x = 14;
      // y = 32;
      // rName = Memory.homeRoomName;

      // if (room.name === rName) {
      //   console.log(rName + " (" + x + "," + y + "): " + costs.get(x, y));
      // }

      return costs;
    },
    flee: false,
    maxOps: maxOps,
    maxRooms: 1,
  });

  // if (ret.incomplete) {
  //   if (
  //     ret.path &&
  //     ret.path[ret.path.length - 1] &&
  //     ret.path[ret.path.length - 1].pos &&
  //     !ret.path[ret.path.length - 1].pos.inRangeTo(destPos, range)
  //   ) {
  //     console.log(name + " getPath need more ops for pathfinding");

  //     ret = PathFinder.search(creepPos, goals, {
  //       // We need to set the defaults costs higher so that we
  //       // can set the road cost lower in `roomCallback`
  //       plainCost: 2,
  //       swampCost: 10,
  //       flee: false,
  //       maxOps: maxOps * 10,
  //       maxRooms: 1,

  //       roomCallback: function (roomName) {
  //         let room = Game.rooms[roomName];
  //         // In this example `room` will always exist, but since
  //         // PathFinder supports searches which span multiple rooms
  //         // you should be careful!
  //         if (!room) return;
  //         let costs = new PathFinder.CostMatrix();

  //         room.find(FIND_STRUCTURES).forEach(function (struct) {
  //           if (struct.structureType === STRUCTURE_ROAD) {
  //             // Favor roads over plain tiles
  //             costs.set(struct.pos.x, struct.pos.y, 1);
  //           } else if (
  //             struct.structureType !== STRUCTURE_CONTAINER &&
  //             (struct.structureType !== STRUCTURE_RAMPART || !struct.my)
  //           ) {
  //             // Can't walk through non-walkable buildings
  //             costs.set(struct.pos.x, struct.pos.y, 0xff);
  //           }
  //         });

  //         let creepArr = creepPos.findInRange(FIND_CREEPS, 2);
  //         if (!ignoreCreeps || creepArr.length > 1) {
  //           // Avoid creeps in the room
  //           for (const c of creepArr) {
  //             // body parts array of creep
  //             let bodyParts = c.body;
  //             // new array with just the MOVE body parts
  //             let moveBodyParts = bodyParts.filter((part) => part === MOVE);
  //             let numberOfMoveBodyParts = moveBodyParts.length;
  //             // how much fatigue this creep can recover from in a game tick
  //             let fatigueRecoverablePerTick = numberOfMoveBodyParts * 2;
  //             if (c.pos) {
  //               if (c.fatigue > fatigueRecoverablePerTick) {
  //                 // creep isn't moving due to fatigue
  //                 costs.set(c.pos.x, c.pos.y, 0xff);
  //               } else if (c.memory) {
  //                 let path = c.memory.path;

  //                 if (path && path.length > 0) {
  //                   // creep has a path and no fatigue
  //                   costs.set(path[0].x, path[0].y, 0xff);
  //                 } else {
  //                   // creep has no path, likely not moving
  //                   costs.set(c.pos.x, c.pos.y, 0xff);
  //                 }
  //               }
  //             }
  //           }
  //         }

  //         // // Avoid creeps in the room
  //         // room.find(FIND_CREEPS).forEach(function (creep) {
  //         //   costs.set(creep.pos.x, creep.pos.y, 0xff);
  //         // });

  //         return costs;
  //       },
  //     });

  //     if (ret.incomplete) {
  //       creep.memory.path = ret.path;
  //       return ERR_NO_PATH;
  //     } else {
  //       creep.memory.path = ret.path;
  //       return OK;
  //     }
  // } else if (ret.path.length <= 0) {
  //   // we have an incomplete and empty path!
  //   creep.memory.path = null;
  //   console.log("getpath ret.path.length is zero");
  //   return ERR_NOT_FOUND;
  // } else if (ret.path) {
  //   // we have an incomplete path, but the last position is in range to the destination. HOW DID THIS HAPPEN?!?
  //   creep.memory.path = ret.path;
  //   return OK;
  // }
  // } else {
  creep.memory.path = ret.path;
  return OK;
  // }
}

getPath = profiler.registerFN(getPath, "getPath");
module.exports = getPath;
