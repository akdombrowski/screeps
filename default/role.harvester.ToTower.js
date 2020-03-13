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

    if (
      !creep.store[RESOURCE_ENERGY] ||
      creep.memory.getEnergy ||
      creep.carry.energy <= 0
    ) {
      creep.memory.buildRoad = false;
      creep.memory.transferTower = false;
      creep.memory.getEnergy = true;
      creep.memory.transfer = false;
      switch (direction) {
        case "South":
        case "south":
        case "s":
          getEnergy(creep, "E35N32", "E35N32", Game.flags.tower1N);
          break;
        case "west":
        case "w":
          getEnergyWest(creep, "E34N31", "E34N31", Game.flags.west);
          break;
        case "north":
        case "n":
          getEnergyNorth(creep, "E35N32", "E35N32", Game.flags.north1);
          break;
        case "east":
        case "e":
          getEnergyEast(creep, "E36N31", "E36N31", Game.flags.east);
          break;
          break;
        case "eeast":
        case "ee":
          getEnergyEE(creep, Game.flags.eetower1);
          break;
        default:
          getEnergy(creep, "E35N32", "E35N32", Game.flags.tower1N);
          break;
      }
    } else if (creep.memory.transfer || creep.carry.energy > 0) {
      //
      //
      // make room agnostic
      //
      //

      creep.memory.getEnergy = false;
      creep.memory.transfer = true;
      retval = -16;
      let tower1Id = "5e5dcc407c6d8f35385b7da7";
      let tower1 = Game.getObjectById(tower1Id);
      let target = tower1;

      retval = transEnTower(creep, 0);
      if (retval !== OK) {
        if (creep.pos.isNearTo(target)) {
          creep.transfer(target, RESOURCE_ENERGY);
        } else {
          smartMove(creep, target, 1);
        }
      }
    }
  },
};

module.exports = roleHarvesterToTower;
