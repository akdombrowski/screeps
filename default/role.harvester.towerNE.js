const getEnergy = require("./action.getEnergy.1");
const transferEnergy = require("./transferEnergy");
const transferEnergyNE = require("./action.transferEnergyNE");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const getEnergyNorth = require("./action.getEnergy.1");
const getEnergyEast = require("./action.getEnergy.1");
const getEnergyEE = require("./action.getEnergyEEast");
const getEnergyWest = require("./action.getEnergy.1");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./move.smartMove");
const build = require("./build");
const transEnTower = require("./action.transEnTower");

const roleHarvesterToTower = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (
      !creep.store[RESOURCE_ENERGY] ||
      creep.memory.getEnergy ||
      creep.carry.energy <= 0
    ) {
      creep.memory.buildRoad = false;
      creep.memory.transferTower = false;
      creep.memory.getEnergy = true;
      creep.memory.transfer = false;
      getEnergy(creep, "E36N32", "E36N32", Game.flags.newtower1);
    } else if (creep.memory.transfer || creep.carry.energy > 0) {
      creep.memory.getEnergy = false;
      creep.memory.transfer = true;
      retval = -16;
      let tower1Id = "5e627bdb6ec99b7b4d5ff213";
      let tower1 = Game.getObjectById(tower1Id);
      let target = tower1;

      if(target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {

        if (creep.pos.isNearTo(target)) {
          creep.transfer(target, RESOURCE_ENERGY);
        } else {
          smartMove(creep, target, 1);
        }
      } else {
        transferEnergyNE(creep);
      }
    }
  },
};

module.exports = roleHarvesterToTower;
