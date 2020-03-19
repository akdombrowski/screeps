const getEnergy = require("./action.getEnergy.1");
const transferEnergy = require("./action.transferEnergy");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const getEnergyNorth = require("./action.getEnergy.1");
const getEnergyEast = require("./action.getEnergy.1");
const getEnergyEE = require("./action.getEnergyEEast");
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
    let tower1Id = "5d352664dbfe1b628e86ecff";
    let tower2Id = "5d0f99d929c9cb5363cba23d";

    if (
      !creep.store[RESOURCE_ENERGY] ||
      creep.memory.getEnergy ||
      creep.carry.energy <= 0
    ) {
      creep.memory.buildRoad = false;
      creep.memory.transferTower = false;
      creep.memory.getEnergy = true;
      creep.memory.transfer = false;
      getEnergy(creep, "E36N31", "E36N31", Game.flags.east);
    } else if (creep.memory.transfer || creep.carry.energy > 0) {
      creep.memory.getEnergy = false;
      creep.memory.transfer = true;
      retval = -16;
      let tower1 = Game.getObjectById(tower1Id);
      let tower2 = Game.getObjectById(tower2Id);
      let target = tower1;
      if (
        !tower2.store[RESOURCE_ENERGY] ||
        (tower1.store[RESOURCE_ENERGY] &&
          tower2.store[RESOURCE_ENERGY] < tower1.store[RESOURCE_ENERGY])
      ) {
        target = tower2;
      }

      if (creep.pos.isNearTo(target)) {
        creep.transfer(target, RESOURCE_ENERGY);
      } else {
        smartMove(creep, target, 1);
      }
    }
  },
};

module.exports = roleHarvesterToTower;
