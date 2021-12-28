const getEnergy = require("./action.getEnergy.1");
const transferEnergy = require("./transferEnergy");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const getEnergyNorth = require("./action.getEnergy.1");
const getEnergyEast = require("./action.getEnergy.1");
const ermgetEnergyEast = require("./action.getEnergy.1");
const getEnergyWest = require("./action.getEnergy.1");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./move.smartMove");
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
      creep.memory.transferTower = true;
      retval = transEnTower(creep, 500);

      // didn't give energy to tower.
      if (retval === OK) {
        creep.say("tower");
      }  else if (retval != OK) {
        console.log(name + " error trans to tower1 " + retval);
      }
    }
    return retval;
  }
};

module.exports = roleHarvesterTower1;
