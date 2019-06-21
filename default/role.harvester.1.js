const getEnergy = require("./action.getEnergy");
const transferEnergy = require("./action.transferEnergy");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const getEnergyNorth = require("./action.getEnergyNorth");
const getEnergyEast = require("./action.getEnergyEast");
const ermgetEnergyEast = require("./action.erm.getEnergyEast");
const getEnergyWest = require("./action.getEnergyWest");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./action.smartMove");
const build = require("./action.build");

const roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    let ermHarvesters = Memory.ermHarvesters;
    let ermNeHarvesters = Memory.ermNeHarvesters;

    if (creep.memory.getEnergy || creep.carry.energy <= 0) {
      creep.memory.getEnergy = true;
      creep.memory.transfer = false;

      if (creep.memory.direction == "north") {
        if (
          !Memory.northAttackerId ||
          Game.time >= Memory.nAtackDurationSafeCheck
        ) {
          getEnergyNorth(creep);
        } else {
          Memory.northAttackerId = creep.room.find(FIND_HOSTILE_CREEPS).pop()
            ? Memory.northAttackerId
            : null;
        }
      } else if (creep.memory.direction == "east") {
        if (
          !Memory.eastAttackerId ||
          Game.time >= Memory.eAttackDurationSafeCheck
        ) {
          let found = ermHarvesters.find(function(element) {
            return element === creep.name;
          });
          let foundNe = ermNeHarvesters.find(n => {
            return n === creep.name;
          });
          console.log("here:" + JSON.stringify(Memory.ermNeHarvesters));
          console.log("harvester" + found + " " + foundNe);
          console.log(creep.name);
          if (found || foundNe) {
            ermgetEnergyEast(creep);
          } else {
            getEnergyEast(creep);
          }
        } else {
          Memory.eastAttackerId = creep.room.find(FIND_HOSTILE_CREEPS).pop()
            ? Memory.eastAttackerId
            : null;
          console.log("East attacker");
        }
      } else if (creep.memory.direction == "west") {
        if (
          !Memory.westAttackerId ||
          Game.time >= Memory.wAttackDurationSafeCheck
        ) {
          getEnergyWest(creep);
        } else {
          Memory.westAttackerId = creep.room.find(FIND_HOSTILE_CREEPS).pop()
            ? Memory.westAttackerId
            : null;
        }
      } else if (creep.memory.direction == "south" || creep) {
        getEnergy(creep);
      } else {
        getEnergy(creep);
      }
    } else if (creep.memory.transfer || creep.carry.energy > 0) {
      creep.memory.getEnergy = false;
      retval = -16;
      if (creep.memory.direction === "east") {
        retval = transferEnergyeRm(creep);
      } else {
        if (retval != OK) {
          creep.memory.transfer = true;
          retval = transferEnergy(creep);
        }
      }
    }
  }
};

module.exports = roleHarvester;
