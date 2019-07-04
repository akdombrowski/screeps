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
const transEnTower = require("./action.transEnTower");

const roleHarvesterTower1 = {
  /** @param {Creep} creep **/
  run: function(creep) {
    let ermHarvesters = Memory.ermHarvesters;
    let ermNeHarvesters = Memory.ermNeHarvesters;
    let name = creep.name;
    let direction = creep.memory.direction;
    let sourceDir = creep.memory.sourceDir;
    let retval = -16;
    if (creep.memory.getEnergy || creep.carry.energy <= 0) {
      creep.memory.buildRoad = false;
      creep.memory.transferTower = false;
      creep.memory.getEnergy = true;
      creep.memory.transfer = false;

     
        retval = getEnergy(creep, "E35N31");
        
    } else if (creep.memory.transfer || creep.carry.energy > 0) {
      creep.memory.getEnergy = false;
      retval = -16;

      if (direction === "south" || direction === "east") {
        creep.memory.transferTower = true;
        creep.memory.buildRoad = false;
        retval = transEnTower(creep, 500);
      }

      // didn't give energy to tower. build road.
      if (
        (retval != OK &&
          !creep.memory.transfer &&
          !creep.memory.transferTower &&
          creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: (site) => {
              return site.structureType === STRUCTURE_ROAD;
            },
          })) ||
        creep.memory.buildRoad
      ) {
        console.log(name + " build road inside role harvester")
        retval = buildRoad(creep);
        if (retval === OK) {
          creep.memory.buildRoad = true;
        }
      } else if (retval === OK) {
        creep.say("tower");
        creep.memory.transferTower = true;
      } else {
        creep.memory.buildroad = false;
      }

      // didn't build road and didn't transto tower
      if (retval != OK) {
        if (creep.memory.direction === "east") {
          retval = transferEnergyeRm(creep);
        } else {
          creep.memory.transfer = true;
          retval = transferEnergy(creep);
        }
      }
    }
  },
};

module.exports = roleHarvesterTower1;
