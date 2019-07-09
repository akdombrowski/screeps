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

const roleHarvesterToTower = {
  /** @param {Creep} creep **/
  run: function(creep) {
    let ermHarvesters = Memory.ermHarvesters;
    let ermNeHarvesters = Memory.ermNeHarvesters;
    let name = creep.name;
    let direction = creep.memory.direction;
    let sourceDir = creep.memory.sourceDir;

    if (creep.memory.getEnergy || creep.carry.energy <= 0) {
      creep.memory.buildRoad = false;
      creep.memory.transferTower = false;
      creep.memory.getEnergy = true;
      creep.memory.transfer = false;
      ermgetEnergyEast(creep, "E35N31", "E35N31", Game.flags.source1);

      
    } else if (creep.memory.transfer || creep.carry.energy > 0) {
      creep.memory.getEnergy = false;
      creep.memory.transfer = true;
      retval = -16;
      let tower1Id = Memory.tower1Id;
      let tower2Id = Memory.tower2Id;
      let tower1 = Game.getObjectById(tower1Id);
      let tower2 = Game.getObjectById(tower2Id);
      let target = tower1;
      
      if(tower2.energy < tower1.energy) {
        target = tower2;
      }

      if(target.energy <= 0) {
        target = creep.room.storage;
      }
      if(creep.pos.isNearTo(target)) {
        creep.transfer(target,RESOURCE_ENERGY);
      } else {
        smartMove(creep, target, 1);
      }
    }
  },
};

module.exports = roleHarvesterToTower;
