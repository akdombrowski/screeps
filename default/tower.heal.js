const { findFixables } = require("./find.findFixables");
const findRepairable = require("./action.findRepairableStruct");
const profiler = require("./screeps-profiler");
const { findHealables } = require("./find.findHealables");
const findHealable = require("./action.findHealableCreep");

function towerHeal(
  towers,
  timeToPassForRecheck,
  minEnergyToKeepForInvaders,
  repairInterval
) {
  let retval = -16;

  if (Game.time % repairInterval === 0) {
    for (let i = 0; i < towers.length; i++) {
      let t = towers[i];
      let target = null;

      if (t.store[RESOURCE_ENERGY] >= minEnergyToKeepForInvaders) {
        if (t.room.name === Memory.homeRoomName && !Memory.invaderId) {
          if (
            !Memory.e59s48healables ||
            Memory.e59s48healables.length <= 0 ||
            Memory.lastSouthCheckHealables - Game.time > timeToPassForRecheck
          ) {
            Memory.e59s48healables = findHealables(
              Game.rooms[Memory.homeRoomName]
            );
            Memory.lastSouthCheckHealables = Game.time;
          }
        } else if (
          t.room.name === Memory.northRoomName &&
          !Memory.nAttackerId
        ) {
          if (
            !Memory.e59s47healables ||
            Memory.e59s47healables.length <= 0 ||
            Memory.lastNorthCheckHealables - Game.time > timeToPassForRecheck
          ) {
            Memory.e59s47healables = findHealables(
              Game.rooms[Memory.northRoomName]
            );
            Memory.lastNorthCheckHealables = Game.time;
          }
        } else if (
          t.room.name === Memory.deepSouthRoomName &&
          !Memory.dSAttackerId
        ) {
          if (
            !Memory.e59s49healables ||
            Memory.e59s49healables.length <= 0 ||
            Memory.lastDeepSouthCheckHealables - Game.time >
              timeToPassForRecheck
          ) {
            Memory.e59s49healables = findHealables(
              Game.rooms[Memory.deepSouthRoomName]
            );
            Memory.lastDeepSouthCheckHealables = Game.time;
          }
        } else {
          if (
            !Memory.e59s48healables ||
            Memory.e59s48healables.length <= 0 ||
            Memory.lastSouthCheckHealables - Game.time > timeToPassForRecheck
          ) {
            Memory.e59s48healables = findHealables(
              Game.rooms[Memory.homeRoomName]
            );
            Memory.lastSouthCheckHealables = Game.time;
          }
        }

        target = findHealable(t);

        if (target) {
          retval = t.heal(target);
        }
      }
    }
  }

  return retval;
}

towerHeal = profiler.registerFN(towerHeal, "towerHeal");
exports.towerHeal = towerHeal;
