const getEnergy = require("./action.getEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const build = require("./action.build");
const findRepairable = require("./action.findRepairableStruct");

var roleRepairer = {
  /** @param {Creep} creep **/
  run: function (creep, targetRoomName, exit, exitDirection) {
    let mem_repair = creep.memory.repair;
    let retval = -16;
    const lastRepairableStructId = creep.memory.lastRepairableStructId;
    const name = creep.name;
    const creepPos = creep.pos;
    const creepRoom = creep.room;
    const creepRoomName = creep.room.name;
    let mem_direction = creep.memory.direction;
    let mem_getEnergy = creep.memory.getEnergy;

    if (!mem_repair || creep.memory.getEnergy) {
      if (creepRoomName != targetRoomName) {
        if (creep.pos.isNearTo(exit)) {
          retval = creep.move(exitDirection);
        } else {
          retval = smartMove(creep, exit, 0, true, null, null, null, 1);
        }
      }

      return retval;
    }

    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
      mem_repair = true;
      creep.memory.build = false;
      creep.memory.repair = mem_repair;
      creep.memory.getEnergy = false;
      creep.say("r");
    } else if (
      !mem_repair &&
      (creep.memory.getEnergy || creep.store[RESOURCE_ENERGY] <= 0)
    ) {
      creep.memory.build = false;
      creep.memory.repair = false;
      creep.memory.getEnergy = true;
      creep.say("h");

      retval = getEnergy(creep, targetRoomName);

      return retval;
    }

    if (creep.memory.build) {
      creep.memory.repair = false;
      mem_repair = false;
      retval = build(creep);
      creep.say("r.b");
    }

    if (mem_repair) {
      let struct;
      // will be null if lastRepairableStructId is null
      let target = Game.getObjectById(lastRepairableStructId);
      let targetObj;
      let targetType = creep.memory.targetType;

      if (target && target.hits >= target.hitsMax) {
        target = null;
      }

      if (target && target.room && target.room.name != creep.room.name) {
        target = null;
      }

      if (!target) {
        target = findRepairable(creep);
      }

      if (target && target.hits >= target.hitsMax) {
        target = null;
      }

      if (target) {
        creep.memory.lastRepairableStructId = target.id;
        if (creep.pos.inRangeTo(target, 3)) {
          retval = creep.repair(target);

          if (retval == OK) {
            creep.say("r");
          } else if (retval == ERR_NOT_ENOUGH_ENERGY) {
            creep.memory.repair = false;
            retval = getEnergy(creep);
            creep.say("r.En");
          } else {
            creep.say("err." + retval);
          }
        } else {
          retval = smartMove(creep, target, 1);
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
      } else if (creep.store[RESOURCE_ENERGY] <= 0) {
        creep.memory.repair = false;
        creep.memory.getEnergy = true;
        retval = getEnergy(creep);
      } else {
        creep.memory.build = true;
        creep.memory.repair = false;
        retval = build(creep);
        creep.say("r.b");
      }
    }

    return retval;
  },
};

module.exports = roleRepairer;
