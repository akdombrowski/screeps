const getEnergy = require("./action.getEnergy");
const transferEnergy = require("./action.transferEnergy");
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
      creep.say("h");
      if (
        creep.memory.direction == "north" &&
        (!Memory.northAttackerId || Game.time >= Memory.nAtackDurationSafeCheck)
      ) {
        getEnergyNorth(creep);
      } else if (
        creep.memory.direction == "east" &&
        (!Memory.eastAttackerId || Game.time >= Memory.eAttackDurationSafeCheck)
      ) {
        getEnergyEast(creep);
      } else if (
        creep.memory.direction == "west" &&
        (!Memory.westAttackerId || Game.time >= Memory.wAttackDurationSafeCheck)
      ) {
        getEnergyWest(creep);
      } else if (creep.memory.direction == "south" || creep) {
        getEnergy(creep);
      } else {
        getEnergy(creep);
      }
    } else if (creep.memory.buildSpawn) {
      creep.memory.getEnergy = false;

      let s2 = Game.getObjectById("5d036fd6ac95ba2196cc5353");
      if (creep.pos.inRangeTo(s2, 3)) {
        creep.build(s2);
      } else {
        smartMove(creep, s2, 3);
      }
    } else if (creep.memory.transfer || creep.carry.energy > 0) {
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
