const findRepairable = require("./action.findRepairableStruct");
const { findFixables } = require("./find.findFixables");
const profiler = require("./screeps-profiler");

function findFixablesForCreep(creep, target) {
  const timeToPassForRecheck = 10;
  if (creep.memory.direction === "home") {
    if (
      !Memory.homeFixables ||
      Memory.homeFixables.length <= 0 ||
      Game.time - Memory.lastHomeCheckFixables > timeToPassForRecheck
    ) {
      Memory.homeFixables = findFixables(Game.rooms[Memory.homeRoomName]);
      Memory.lastHomeCheckFixables = Game.time;
    }
  } else if (creep.memory.direction === "north") {
    if (
      !Memory.northFixables ||
      Memory.northFixables.length <= 0 ||
      Game.time - Memory.lastNorthCheckFixables > timeToPassForRecheck
    ) {
      Memory.northFixables = findFixables(Game.rooms[Memory.northRoomName]);
      Memory.lastNorthCheckFixables = Game.time;
    }
  } else if (creep.memory.direction === "south") {
    if (
      !Memory.southFixables ||
      Memory.southFixables.length <= 0 ||
      Game.time - Memory.lastSouthCheckFixables > timeToPassForRecheck
    ) {
      Memory.southFixables = findFixables(Game.rooms[Memory.southRoomName]);
      Memory.lastSouthCheckFixables = Game.time;
    }
  } else if (creep.memory.direction === "west") {
    if (
      !Memory.westFixables ||
      Memory.westFixables.length <= 0 ||
      Game.time - Memory.lastWestCheckFixables > timeToPassForRecheck
    ) {
      Memory.westFixables = findFixables(Game.rooms[Memory.westRoomName]);
      Memory.lastWestCheckFixables = Game.time;
    }
  } else {
    if (
      !Memory.homeFixables ||
      Memory.homeFixables.length <= 0 ||
      Game.time - Memory.lastHomeCheckFixables > timeToPassForRecheck
    ) {
      Memory.homeFixables = findFixables(Game.rooms[Memory.homeRoomName]);
      Memory.lastHomeCheckFixables = Game.time;
    }
  }

  target = findRepairable(creep);
  return target;
}
exports.findFixablesForCreep = findFixablesForCreep;
findFixablesForCreep = profiler.registerFN(
  findFixablesForCreep,
  "findFixablesForCreep"
);
