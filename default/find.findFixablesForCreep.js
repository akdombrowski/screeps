const findRepairable = require("./action.findRepairableStruct");
const { findFixables } = require("./find.findFixables");
const profiler = require("./screeps-profiler");

function findFixablesForCreep(creep, target) {
  const timeToPassForRecheck = 50;
  if (creep.memory.direction.startsWith("s")) {
    if (
      !Memory.homefixables ||
      Memory.homefixables.length <= 0 ||
      Memory.lastHomeCheckFixables - Game.time > timeToPassForRecheck
    ) {
      Memory.homefixables = findFixables(Game.rooms[Memory.homeRoomName]);
      Memory.lastHomeCheckFixables = Game.time;
    }
  } else if (creep.memory.direction.startsWith("n")) {
    if (
      !Memory.northfixables ||
      Memory.northfixables.length <= 0 ||
      Memory.lastNorthCheckFixables - Game.time > timeToPassForRecheck
    ) {
      Memory.northfixables = findFixables(Game.rooms[Memory.northRoomName]);
      Memory.lastNorthCheckFixables = Game.time;
    }
  } else if (creep.memory.direction == "south") {
    if (
      !Memory.southfixables ||
      Memory.southfixables.length <= 0 ||
      Memory.lastSouthCheckFixables - Game.time > timeToPassForRecheck
    ) {
      Memory.southfixables = findFixables(Game.rooms[Memory.southRoomName]);
      Memory.lastSouthCheckFixables = Game.time;
    }
  } else if (creep.memory.direction == "west") {
    if (
      !Memory.westfixables ||
      Memory.westfixables.length <= 0 ||
      Memory.lastWestCheckFixables - Game.time > timeToPassForRecheck
    ) {
      Memory.westfixables = findFixables(Game.rooms[Memory.westRoomName]);
      Memory.lastWestCheckFixables = Game.time;
    }
  } else {
    if (
      !Memory.homefixables ||
      Memory.homefixables.length <= 0 ||
      Memory.lastHomeCheckFixables - Game.time > timeToPassForRecheck
    ) {
      Memory.homefixables = findFixables(Game.rooms[Memory.homeRoomName]);
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
