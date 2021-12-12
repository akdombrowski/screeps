const getEnergy = require("./action.getEnergy");
const smartMove = require("./action.smartMove");
const yucreepin = require("./action.checkForAnotherCreepNearMe");
const build = require("./action.build");

var roleWorker = {
  /** @param {Creep} creep **/
  run: function (creep, flag, workRoom) {
    let s1 = Game.getObjectById(Memory.s1);
    let name = creep.name;
    let direction = creep.memory.direction;
    let rm = creep.room;
    let pos = creep.pos;
    let retval = -16;
    let homeRoomName = Memory.homeRoomName;

    if (
      creep.getEnergy ||
      !creep.store[RESOURCE_ENERGY] ||
      creep.store[RESOURCE_ENERGY] <= 0 ||
      (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
        !creep.memory.working)
    ) {
      creep.memory.working = false;
      creep.say("h");
      creep.memory.getEnergy = true;

      console.log(name + " getting energy ");

      retval = getEnergy(creep, homeRoomName);

      return retval;
    } else if (
      !creep.memory.working &&
      creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity(RESOURCE_ENERGY)
    ) {
      creep.memory.working = true;
      creep.memory.getEnergy = false;
    } else if (!creep.memory.working) {
      console.log(name + " role.worker.js confusion ");
      return retval;
    }

    if (creep.memory.working) {
      return build(creep);
    }
  },
};

module.exports = roleWorker;
