const getEnergy = require("./action.getEnergy.1");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const build = require("./action.build");
const findRepairable = require("./action.findRepairableStruct");

var roleRepairer = {
  /** @param {Creep} creep **/
  run: function(creep) {
    let repair = creep.memory.repair;
    let retval = -16;
    const lastRepairableStructId = creep.memory.lastRepairableStructId;

    if (!repair && creep.carry.energy >= creep.carryCapacity) {
      creep.memory.repair = true;
      creep.memory.getEnergy = false;
      creep.say("r");
    } else if (!repair || creep.memory.getEnergy || _.sum(creep.carry) <= 0) {
      creep.say("h");
      creep.memory.repair = false;
      creep.memory.getEnergy = true;
      if (creep.memory.direction === "east") {
        getEnergy(creep, "E36N31");
      } else {
        getEnergy(creep, "E35N31");
      }
      return;
    }

    if (repair) {
      let struct;
      let target = Game.getObjectById(lastRepairableStructId);
      let targetObj;
      let targetType = creep.memory.targetType;

      if (target && target.hits >= target.hitsMax) {
        target = null;
      }

      if (!target) {
        target = findRepairable(creep);
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
            creep.say("r.err");
          }
        } else {
          smartMove(creep, target, 1);
          creep.memory.r = target.pos;
          if (creep.fatigue > 0) {
            creep.say("f." + creep.fatigue);
          } else if (retval == ERR_INVALID_TARGET) {
            creep.say("r." + "inval");
            target = null;
          } else {
            creep.say("m" + target.pos.x + "," + target.pos.y);
          }
        }
      } else if (creep.carry < creep.carryCapacity / 2) {
        creep.memory.repair = false;
        creep.memory.getEnergy = true;
        getEnergy(creep);
      } else {
        build(creep);
        creep.say("r.b");
      }
    }
  },
};

module.exports = roleRepairer;
