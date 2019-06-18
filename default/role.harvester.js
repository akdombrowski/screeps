const getEnergy = require("./action.getEnergy");
const transferEnergy = require("./action.transferEnergy");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const getEnergyNorth = require("./action.getEnergyNorth");
const getEnergyEast = require("./action.getEnergyEast");
const getEnergyWest = require("./action.getEnergyWest");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./action.smartMove");

const roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.getEnergy || creep.carry.energy <= 0) {
      creep.memory.getEnergy = true;
      creep.memory.transfer = false;

      if (
        creep.memory.direction === "north" &&
        (!Memory.northAttackerId || Game.time >= Memory.nAtackDurationSafeCheck)
      ) {
        getEnergyNorth(creep);
      } else if (creep.memory.direction === "east") {
        if (
          !Memory.eastAttackerId ||
          Game.time >= Memory.eAttackDurationSafeCheck
        ) {
          getEnergyEast(creep);
        } else {
          Memory.eastAttackerId = creep.room.find(FIND_HOSTILE_CREEPS).pop()
            ? Memory.eastAttackerId
            : null;
        }
      } else if (creep.memory.direction === "west") {
        if (
          !Memory.westAttackerId ||
          Game.time >= Memory.wAttackDurationSafeCheck
        ) {
          getEnergyWest(creep);
        } else {
          console.log("Memory.westAttack " + Memory.westAttackerId);
          Memory.westAttackerId = creep.room.find(FIND_HOSTILE_CREEPS).pop()
            ? Memory.westAttackerId
            : null;
        }
      } else if (creep.memory.direction === "south" || creep) {
        getEnergy(creep);
      } else {
        getEnergy(creep);
      }
    } else if (creep.memory.transfer || creep.carry.energy > 0) {
      creep.memory.getEnergy = false;

      if (
        creep.room.energyAvailable >=
        creep.room.energyCapacityAvailable - 700
      ) {
        // buildRoad(creep);
      } else {
        creep.memory.transfer = true;

        transferEnergy(creep);
      }
    }
  }
};

module.exports = roleHarvester;
