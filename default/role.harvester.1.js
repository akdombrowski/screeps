const getEnergy = require("./action.getEnergy.1");
const transferEnergy = require("./action.transferEnergy");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const getEnergyNorth = require("./action.getEnergy.1");
const getEnergyEast = require("./action.getEnergy.1");
const ermgetEnergyEast = require("./action.getEnergy.1");
const getEnergyWest = require("./action.getEnergy.1");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./action.smartMove");
const build = require("./action.build");

const roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    let ermHarvesters = Memory.ermHarvesters;
    let ermNeHarvesters = Memory.ermNeHarvesters;
    let name = creep.name;

    if (creep.memory.getEnergy || creep.carry.energy <= 0) {
      creep.memory.getEnergy = true;
      creep.memory.transfer = false;

      if (creep.memory.direction == "north") {
        if (
          !Memory.northAttackerId ||
          Game.time >= Memory.nAtackDurationSafeCheck
        ) {
          getEnergyNorth(creep, "E35N32");
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
          let foundNe = ermNeHarvesters.find((n) => {
            return n === creep.name;
          });
          let nesource1Creeps = Memory.nesource1Creeps || [];
          let nesource2Creeps = Memory.nesource2Creeps || [];
          if(creep.memory.nesourceNumber) {
            ermgetEnergyEast(creep, "E36N32", "E36N31", creep.memory.nesourceNumber);
          } else if (nesource1Creeps.length < nesource2Creeps.length) {
            // go to energy source 1
            ermgetEnergyEast(creep, "E36N32", "E36N31", Game.flags.neSource1); 
            creep.memory.nesourceNumber = 1;
          } else {
            // go to energy source 2
            creep.memory.nesourceNumber = 2;
            ermgetEnergyEast(creep, "E36N32", "E36N31", Game.flags.neSource2); 
          }
      
          if (creep.name[3] % 2 === 0) {
          } else {
          }
          // if ((creep.memory.sourceDir = "east1")) {
          //   // ermgetEnergyEast(creep, "E36N32", Game.flags.neSource1); // yes i want e36n32
          // } else if ((creep.memory.sourceDir = "east2")){
          //   ermgetEnergyEast(creep, "E36N32", Game.flags.neSource2); // yes i
          // } else if ((creep.memory.sourceDir = "north1")){
          //   ermgetEnergyEast(creep, "E36N32", Game.flags.neSource1); // yes i
          // } else if ((creep.memory.sourceDir = "north2")){
          //   ermgetEnergyEast(creep, "E36N32", Game.flags.neSource2); // yes i
          // } else {
          //   ermgetEnergyEast(creep, "E36N32"); // yes i
          // }
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
          getEnergyWest(creep, "E34N31");
        } else {
          Memory.westAttackerId = creep.room.find(FIND_HOSTILE_CREEPS).pop()
            ? Memory.westAttackerId
            : null;
        }
      } else if (creep.memory.direction == "south" || creep) {
        getEnergy(creep, "E35N31");
      } else {
        getEnergy(creep, "E35N31");
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
  },
};

module.exports = roleHarvester;
