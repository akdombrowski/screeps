const findRepairable = require("./action.findRepairableStruct");
const { findFixables } = require("./find.findFixables");
const profiler = require("./screeps-profiler");

function findFixablesForCreep(creep, target) {
  const timeToPassForRecheck = 50;
  if (creep.memory.direction.startsWith("s")) {
    if (!Memory.e59s48fixables ||
      Memory.e59s48fixables.length <= 0 ||
      Memory.lastSouthCheckFixables - Game.time > timeToPassForRecheck) {
      Memory.e59s48fixables = findFixables(Game.rooms[Memory.homeRoomName]);
      Memory.lastSouthCheckFixables = Game.time;
    }
  } else if (creep.memory.direction.startsWith("n")) {
    if (!Memory.e59s47fixables ||
      Memory.e59s47fixables.length <= 0 ||
      Memory.lastNorthCheckFixables - Game.time > timeToPassForRecheck) {
      Memory.e59s47fixables = findFixables(
        Game.rooms[Memory.northRoomName]
      );
      Memory.lastNorthCheckFixables = Game.time;
    }
  } else if (creep.memory.direction.startsWith("deepSouth")) {
    if (!Memory.e59s49fixables ||
      Memory.e59s49fixables.length <= 0 ||
      Memory.lastDeepSouthCheckFixables - Game.time > timeToPassForRecheck) {
      Memory.e59s49fixables = findFixables(
        Game.rooms[Memory.deepSouthRoomName]
      );
      Memory.lastDeepSouthCheckFixables = Game.time;
    }
  } else {
    if (!Memory.e59s48fixables ||
      Memory.e59s48fixables.length <= 0 ||
      Memory.lastSouthCheckFixables - Game.time > timeToPassForRecheck) {
      Memory.e59s48fixables = findFixables(Game.rooms[Memory.homeRoomName]);
      Memory.lastSouthCheckFixables = Game.time;
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
