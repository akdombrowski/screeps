const getEnergy = require("./action.getEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const build = require("./action.build");
const findRepairable = require("./action.findRepairableStruct");

var roleRepairer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    let repair = creep.memory.repair;
    let retval = -16;
    const lastRepairableStructId = creep.memory.lastRepairableStructId;

    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
      repair = true;
      creep.memory.build = false;
      creep.memory.repair = repair;
      creep.memory.getEnergy = false;
      creep.say("r");
    } else if (
      !repair ||
      creep.memory.getEnergy ||
      creep.store[RESOURCE_ENERGY] <= 0
    ) {
      creep.memory.build = false;
      creep.memory.repair = false;
      creep.memory.getEnergy = true;
      creep.say("h");

      getEnergy(creep, Memory.homeRoomName);

      return;
    }

    if (creep.memory.build) {
      console.log("build");
      build(creep);
      creep.say("r.b");
    }

    if (repair) {
      let struct;
      // will be null if lastRepairableStructId is null
      let target = Game.getObjectById(lastRepairableStructId);
      let targetObj;
      let targetType = creep.memory.targetType;

      if (target && target.hits >= target.hitsMax) {
        target = null;
      }

      if (!target) {
        target = findRepairable(creep);
      }

      if(target.hits >= target.hitsMax) {
        target = null;
      }

      if (target) {
        creep.memory.lastRepairableStructId = target.id;
        if (creep.pos.inRangeTo(target, 3)) {
          let retval = creep.repair(target);

          if (retval == OK) {
            creep.say("r");
          } else if (retval == ERR_NOT_ENOUGH_ENERGY) {
            creep.memory.repair = false;
            getEnergy(creep);
            creep.say("r.En");
          } else {
            creep.say("err." + retval);
          }
        } else {
          smartMove(creep, target, 1);
          creep.memory.rx = target.pos.x;
          creep.memory.ry = target.pos.y;
          if (creep.fatigue > 0) {
            creep.say("f." + creep.fatigue);
          } else if (retval == ERR_INVALID_TARGET) {
            creep.say("invalTarg");
            target = null;
            creep.memory.lastRepairableStructId = null;
          } else {
            creep.say(target.pos.x + "," + target.pos.y);
          }
        }
      } else if (
        creep.store[RESOURCE_ENERGY] <
        creep.store.getCapacity(RESOURCE_ENERGY) / 2
      ) {
        creep.memory.repair = false;
        creep.memory.getEnergy = true;
        getEnergy(creep);
      } else {
        creep.memory.build = true;
        creep.memory.repair = false;
        build(creep);
        creep.say("r.b");
      }
    }
  },
};

module.exports = roleRepairer;
