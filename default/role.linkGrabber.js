const getEnergy = require("./action.getEnergy");
const transferEnergy = require("./action.transferEnergy");
const getEnergyNorth = require("./action.getEnergyNorth");
const getEnergyEast = require("./action.getEnergyEast");
const getEnergyWest = require("./action.getEnergyWest");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./move.smartMove");

const roleLinkGrabber = {
  /** @param {Creep} creep **/
  run: function(creep) {
    let link1 = Game.getObjectById(Memory.link1);
    let storing = creep.memory.storing;
    let grabbing = creep.memory.grabbing;
    let stor1 = Game.getObjectById(Memory.stor1);
    if (_.sum(creep.carry) >= creep.carryCapacity) {
      creep.memory.storing = true;
      creep.memory.grabbing = false;
    } else if (_.sum(creep.carry) <= 0) {
      creep.memory.storing = false;
      creep.memory.grabbing = true;
    }

    if (storing) {
      creep.memory.grabbing = false;
      if (creep.pos.isNearTo(stor1)) {
        creep.transfer(stor1, RESOURCE_ENERGY);
      }
    } else if (creep.pos.isNearTo(link1)) {
      creep.memory.storing = false;
      creep.memory.grabbing = true;
      let en = creep.room.lookForAt(LOOK_ENERGY, linkx, linky);
      if (en && creep.pos.isNearTo(en)) {
        creep.pickup(en);
      }
    } else {
      smartMove(creep, link1, 1);
    }
  }
};

module.exports = roleLinkGrabber;
