const getEnergy = require("./action.getEnergy.1");
const transferEnergyEEast = require("./action.transferEnergyEEast");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const getEnergyNorth = require("./action.getEnergy.1");
const getEnergyEast = require("./action.getEnergy.1");
const ermgetEnergyEast = require("./action.getEnergy.1");
const ermgetEnergyEEast = require("./action.getEnergyEEast");
const getEnergyWest = require("./action.getEnergy.1");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./move.smartMove");
const build = require("./build");
const transEnTower = require("./action.transEnTower");

const roleHarvesterBuilder = {
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

      // console.log("buildRoom:" + creep.memory.buildRoom)

      if(direction === "east") {
        ermgetEnergyEast(creep, creep.memory.buildRoom, creep.memory.buildRoom);
      } else if (direction === "eeast") {
        ermgetEnergyEEast(creep);
      } else {
        ermgetEnergyEast(creep, creep.memory.buildRoom, creep.memory.buildRoom);
      }
    } else if (creep.memory.transfer || creep.carry.energy > 0) {
      creep.memory.getEnergy = false;
      creep.memory.transfer = true;
      if (name === Memory.eeastSource2CreepName) {
        Memory.eeastSource2CreepName = null;
      }
      retval = -16;
      let sites = Game.constructionSites;
      let target = _.find(sites, (site, hashId) => {
        if (site.room) {
          return site.room.name === creep.memory.buildRoom && site.my;
        }
      });

      if (target) {
        if (creep.pos.inRangeTo(target, 3)) {
          creep.build(target);
        } else {
          smartMove(creep, target, 3);
        }
      } else {
        console.log("no construction sites");
        if (creep.memory.direction === "eeast") {
          creep.memory.role = "eBuilder";
        }
      }
    }
  },
};

module.exports = roleHarvesterBuilder;
