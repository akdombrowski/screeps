const getEnergy = require("./action.getEnergy.1");
const getEnergyE = require("./action.getEnergyE");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const build = require("./action.build");
const buildN = require("./action.buildN");
const buildE = require("./action.buildE");
const findRepairable = require("./action.findRepairableStruct");

var roleRepairer = {
  /** @param {Creep} creep **/
  run: function(creep) {
    let repair = creep.memory.repair;
    let retval = -16;
    let rm = creep.room;
    let rmName = rm.name;
    let name = creep.name;
    const lastRepairableStructId = creep.memory.lastRepairableStructId;

    if (rmName !== "E36N31") {
      retval = smartMove(
        creep,
        Game.spawns.spawnN,
        10,
        false,
        null,
        10,
        1000,
        2
      );
      return retval;
    }

    if (!repair && creep.carry.energy >= creep.carryCapacity) {
      creep.memory.repair = true;
      creep.memory.getEnergy = false;
      creep.say("r");
    } else if (!repair || creep.memory.getEnergy || _.sum(creep.carry) <= 0) {
      creep.say("h");
      creep.memory.repair = false;
      creep.memory.getEnergy = true;
      retval = getEnergyE(creep, "E36N31");

      return retval;
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
            retval = getEnergyE(creep);
            creep.say("r.En");
          } else {
            creep.say("r.err");
          }
        } else {
          retval = smartMove(creep, target, 3, false, null, 10, 400, 1);
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
        retval = getEnergyE(creep);
      } else {
        retval = buildE(creep);
        creep.say("r.b");
      }
    }
    return retval;
  },
};

module.exports = roleRepairer;
