const getEnergy = require("./action.getEnergy");
const transferEnergy = require("./action.transferEnergy");
const getEnergyNorth = require("./action.getEnergyNorth");
const getEnergyEast = require("./action.getEnergyEast");
const getEnergyWest = require("./action.getEnergyWest");
const buildRoad = require("./action.buildRoad");

const roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.getEnergy || creep.carry.energy <= 0) {
      creep.memory.getEnergy = true;
      creep.memory.transfer = false;
      creep.say("h");
      if (creep.memory.direction == "north") {
        getEnergyNorth(creep);
      } else if (creep.memory.direction == "east") {
        getEnergyEast(creep);
      } else if (creep.memory.direction == "west") {
        getEnergyWest(creep);
      } else if (creep.memory.direction == "south" || creep) {
        getEnergy(creep);
      }
    } else if (
      creep.memory.transfer ||
      creep.carry.energy > 0
    ) {
      creep.memory.getEnergy = false;
      
      
      if (creep.memory.buildingRoad) {
        buildRoad(creep);
        creep.say("road");
      } else {
        creep.memory.transfer = true;
        creep.say("t");
        transferEnergy(creep);
      }
    }
  }
};

module.exports = roleHarvester;
