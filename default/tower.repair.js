const { findFixables } = require("./find.findFixables");
const findRepairable = require("./action.findRepairableStruct");
const profiler = require("./screeps-profiler");

function towerRepair(
  towers,
  timeToPassForRecheck,
  minEnergyToKeepForInvaders,
  repairInterval
) {
  if (Game.time % repairInterval === 0) {
    for (let i = 0; i < towers.length; i++) {
      let t = towers[i];
      let target = null;

      if (t.store[RESOURCE_ENERGY] >= minEnergyToKeepForInvaders) {
        if (t.room.name === Memory.homeRoomName && !Memory.invaderId) {
          if (
            !Memory.homeFixables ||
            Memory.homeFixables.length <= 0 ||
            Game.time - Memory.lastHomeCheckFixables > timeToPassForRecheck
          ) {
            Memory.homeFixables = findFixables(Game.rooms[Memory.homeRoomName]);
            Memory.lastHomeCheckFixables = Game.time;
          }
        } else if (
          t.room.name === Memory.northRoomName &&
          !Memory.nAttackerId
        ) {
          if (
            !Memory.northFixables ||
            Memory.northFixables.length <= 0 ||
            Game.time - Memory.lastNorthCheckFixables > timeToPassForRecheck
          ) {
            Memory.northFixables = findFixables(
              Game.rooms[Memory.northRoomName]
            );
            Memory.lastNorthCheckFixables = Game.time;
          }
        } else if (t.room.name === Memory.southRoomName && !Memory.sAttackerId) {
          if (
            !Memory.southFixables ||
            Memory.southFixables.length <= 0 ||
            Game.time - Memory.lastSouthCheckFixables > timeToPassForRecheck
          ) {
            Memory.southFixables = findFixables(
              Game.rooms[Memory.southRoomName]
            );
            Memory.lastSouthCheckFixables = Game.time;
          }
        } else if (
          t.room.name === Memory.westRoomName &&
          !Memory.wAttackerId
        ) {
          if (
            !Memory.westFixables ||
            Memory.westFixables.length <= 0 ||
            Game.time - Memory.lastWestCheckFixables > timeToPassForRecheck
          ) {
            Memory.westFixables = findFixables(
              Game.rooms[Memory.westRoomName]
            );
            Memory.lastWestCheckFixables = Game.time;
          }
        } else {
          if (
            !Memory.homeFixables ||
            Memory.homeFixables.length <= 0 ||
            Memory.lastHomeCheckFixables - Game.time > timeToPassForRecheck
          ) {
            Memory.homeFixables = findFixables(Game.rooms[Memory.homeRoomName]);
            Memory.lastHomeCheckFixables = Game.time;
          }
        }
        target = findRepairable(t);
        if (target && t.store[RESOURCE_ENERGY] > minEnergyToKeepForInvaders) {
          t.repair(target);
        }
      }
    }
  }
}

towerRepair = profiler.registerFN(towerRepair, "towerRepair");
exports.towerRepair = towerRepair;
