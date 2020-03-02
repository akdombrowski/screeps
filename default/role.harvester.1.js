const getEnergy = require("./action.getEnergy.1");
const transferEnergy = require("./action.transferEnergy");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const transferEnergyEE = require("./action.transferEnergyEEast");
const transferEnergyNE = require("./action.transferEnergyNE");
const getEnergyNorth = require("./action.getEnergyNorth");
const getEnergyNE = require("./action.getEnergyNE");
const getEnergyEast = require("./action.getEnergy.1");
const ermgetEnergyEast = require("./action.getEnergy.1");
const getEnergyEEast = require("./action.getEnergyEEast");
const getEnergyWest = require("./action.getEnergyWest");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./action.smartMove");
const build = require("./action.build");
const transEnTower = require("./action.transEnTower");

const roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    const ermHarvesters = Memory.ermHarvesters;
    const ermNeHarvesters = Memory.ermNeHarvesters;
    const name = creep.name;
    const direction = creep.memory.direction;
    const sourceDir = creep.memory.sourceDir;
    const fatigue = creep.fatigue;
    const rm = creep.room;
    let retval = -16;

    if (
      creep.memory.getEnergy ||
      creep.store[RESOURCE_ENERGY] < 5 ||
      !creep.store[RESOURCE_ENERGY]
    ) {
      if (creep.store.getFreeCapacity() <= 0) {
        retval = ERR_FULL;
        creep.memory.getEnergy = false;
        return retval;
      }

      creep.memory.buildRoad = false;
      creep.memory.transferTower = false;
      creep.memory.getEnergy = true;
      creep.memory.transfer = false;

      if (direction == "north") {
        if (
          !Memory.northAttackerId ||
          Game.time >= Memory.nAtackDurationSafeCheck
        ) {
          retval = getEnergyNorth(creep, "E35N32");
        } else {
          Memory.northAttackerId = creep.room.find(FIND_HOSTILE_CREEPS).pop()
            ? Memory.northAttackerId
            : null;
        }
      } else if (direction == "east") {
        if (
          !Memory.eastAttackerId ||
          Game.time >= Memory.eAttackDurationSafeCheck
        ) {
          if (creep.memory.sourceDir === "east") {
            retval = ermgetEnergyEast(creep, "E36N31");
          } else {
            let nesource1Creeps = Memory.nesource1Creeps || [];
            let nesource2Creeps = Memory.nesource2Creeps || [];
            if (creep.memory.nesourceNumber === 1) {
              retval = ermgetEnergyEast(
                creep,
                "E36N32",
                "E36N31",
                Game.flags.neSource1
              );
            } else if (creep.memory.nesourceNumber === 2) {
              retval = ermgetEnergyEast(
                creep,
                "E36N32",
                "E36N31",
                Game.flags.neSource2
              );
            } else if (nesource1Creeps.length < nesource2Creeps.length) {
              // go to energy source 1
              retval = ermgetEnergyEast(
                creep,
                "E36N32",
                "E36N31",
                Game.flags.neSource1
              );
              creep.memory.nesourceNumber = 1;
            } else {
              // go to energy source 2
              creep.memory.nesourceNumber = 2;
              retval = ermgetEnergyEast(
                creep,
                "E36N32",
                "E36N31",
                Game.flags.neSource2
              );
            }
          }
        } else {
          Memory.eastAttackerId = creep.room.find(FIND_HOSTILE_CREEPS).pop()
            ? Memory.eastAttackerId
            : null;
          console.log("East attacker");
        }
      } else if (direction === "eeast") {
        retval = getEnergyEEast(creep, "E37N31", Game.flags.eesource1);
      } else if (direction == "west") {
        if (
          !Memory.westAttackerId ||
          Game.time >= Memory.wAttackDurationSafeCheck
        ) {
          retval = getEnergyWest(creep, "E34N31");
        } else {
          Memory.westAttackerId = creep.room.find(FIND_HOSTILE_CREEPS).pop()
            ? Memory.westAttackerId
            : null;
        }
      } else if (direction == "south") {
        retval = getEnergy(creep, "E35N31");
      } else if (direction == "ne") {
        retval = getEnergyNE(creep, "E36N32");
      } else {
        retval = getEnergy(creep, "E35N31");
      }
    } else if (creep.memory.transfer || creep.carry.energy > 0) {
      if (!creep.store[RESOURCE_ENERGY] || creep.store[RESOURCE_ENERGY] <= 0) {
        creep.memory.getEnergy = true;
        creep.memory.transEnTower = false;
        creep.memory.transfer = false;
        creep.memory.buildRoad = false;
        return ERR_NOT_ENOUGH_RESOURCES;
      }
      creep.memory.transEnTower = false;
      creep.memory.getEnergy = false;
      retval = -16;

      if (direction === "north") {
        retval = transferEnergy(creep);
      } else if (direction === "east") {
        retval = transferEnergyeRm(creep);
        return retval;
      } else if (direction === "west") {
        retval = transferEnergy(creep);
        return retval;
      } else if (direction === "eeast") {
        retval = transferEnergyEE(creep);
        return retval;
      } else if (direction === "ne") {
        retval = transferEnergyNE(creep);
        return retval;
      } else {
        retval = transferEnergy(creep);
      }

      if (retval === ERR_TIRED) {
        creep.say("f." + fatigue);
        return retval;
      }

      if (retval === -17) {
        return retval;
      }

      if (retval === -5 || retval === -2) {
        creep.memory.path = null;
        return retval;
      }

      if (retval !== OK && direction === "south") {
        creep.memory.transferTower = true;
        creep.memory.buildRoad = false;

        retval = transEnTower(creep, 2000);
      }

      // didn't give energy to tower. build road.
      if (
        (direction === "south" &&
          retval != OK &&
          !creep.memory.transfer &&
          !creep.memory.transferTower &&
          creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: site => {
              return site.structureType === STRUCTURE_ROAD;
            },
          })) ||
        creep.memory.buildRoad
      ) {
        retval = buildRoad(creep);
        if (retval === OK) {
          creep.memory.buildRoad = true;
        }
      } else if (retval === OK && creep.memory.transferTower) {
        creep.say("tower");
      }

      if (retval === ERR_TIRED) {
        creep.say("f." + fatigue);
      }

      // didn't build road and didn't transto tower
      if (retval != OK) {
        creep.say("sad." + retval);
      }
    }
  },
};

module.exports = roleHarvester;
