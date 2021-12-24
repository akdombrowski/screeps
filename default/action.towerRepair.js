const { findFixables } = require("./find.findFixables");
const findRepairable = require("./action.findRepairableStruct");
const profiler = require("./screeps-profiler");

function towerRepair(towers) {
  const timeToPassForRecheck = 100;
  const minEnergyToKeepForInvaders = 200;
  for (let i = 0; i < towers.length; i++) {
    let t = towers[i];
    let target = null;
    if (t.room.name === Memory.homeRoomName && !Memory.invaderId) {
      if (!Memory.e59s48fixables ||
        Memory.e59s48fixables.length <= 0 ||
        Memory.lastSouthCheckFixables - Game.time > timeToPassForRecheck) {
        Memory.e59s48fixables = findFixables(Game.rooms[Memory.homeRoomName]);
        Memory.lastSouthCheckFixables = Game.time;
      }
    } else if (t.room.name === Memory.northRoomName && !Memory.nAttackerId) {
      if (!Memory.e59s47fixables ||
        Memory.e59s47fixables.length <= 0 ||
        Memory.lastNorthCheckFixables - Game.time > timeToPassForRecheck) {
        Memory.e59s47fixables = findFixables(Game.rooms[Memory.northRoomName]);
        Memory.lastNorthCheckFixables = Game.time;
      }
    } else if (t.room.name === Memory.deepSouthRoomName && !Memory.dSAttackerId) {
      if (!Memory.e59s49fixables ||
        Memory.e59s49fixables.length <= 0 ||
        Memory.lastDeepSouthCheckFixables - Game.time > timeToPassForRecheck) {
        Memory.e59s49fixables = findFixables(Game.rooms[Memory.deepSouthRoomName]);
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
    target = findRepairable(t);
    if (target && t.store[RESOURCE_ENERGY] > minEnergyToKeepForInvaders) {
      t.repair(target);
    }
  }
}

towerRepair = profiler.registerFN(towerRepair, "towerRepair");
exports.towerRepair = towerRepair;
