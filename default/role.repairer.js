const getEnergy = require("./getEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./move.smartMove");
const build = require("./action.build");
const { checkIfBlockingSource } = require("./utilities.checkIfBlockingSource");
const profiler = require("./screeps-profiler");
const { findFixablesForCreep } = require("./find.findFixablesForCreep");

function roleRepairer(creep, targetRoomName, exit, exitDirection) {
  let mem_repair = creep.memory.repair;
  let retval = -16;
  const lastRepairableStructId = creep.memory.lastRepairableStructId;
  const name = creep.name;
  const creepPos = creep.pos;
  const creepRoom = creep.room;
  const creepRoomName = creep.room.name;
  let mem_direction = creep.memory.direction;
  let mem_getEnergy = creep.memory.getEnergy;
  let target = Game.getObjectById(creep.memory.lastSourceId);

  if (!target) {
    if (targetRoomName && creepRoomName != targetRoomName) {
      if (creepRoomName === Memory.northRoomName) {
        // if in the north room but target is not north, head south
        exitDirection = BOTTOM;
        exit = Game.flags.northEntrance;
      } else if (creepRoomName === Memory.deepSouthRoomName) {
        // if in the deepSouth room but target room is not deepSouth, head north
        exitDirection = TOP;
        exit = Game.flags.southEntrance;
      }

      if (creep.pos.isNearTo(exit)) {
        creep.say(exitDirection);
        retval = creep.move(exitDirection);
      } else {
        creep.say(targetRoomName);
        retval = smartMove(creep, exit, 0, true, null, null, null, 1);
      }
      return retval;
    }
  }

  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
    mem_repair = true;
    creep.memory.build = false;
    creep.memory.repair = mem_repair;
    creep.memory.getEnergy = false;
  } else if (
    !mem_repair &&
    (creep.memory.getEnergy || creep.store[RESOURCE_ENERGY] <= 0)
  ) {
    creep.memory.build = false;
    creep.memory.lastBuildID = null;
    creep.memory.repair = false;
    creep.memory.getEnergy = true;
    creep.say("h");

    if (creep.memory.direction === "south") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        null,
        null,
        targetRoomName
      );
    } else if (creep.memory.direction === "north") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        Game.flags.northExit,
        TOP,
        targetRoomName
      );
    } else if (creep.memory.direction === "deepSouth") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        Game.flags.southExit,
        BOTTOM,
        targetRoomName
      );
    }
    return retval;
  }

  if (creep.memory.build) {
    creep.memory.repair = false;
    mem_repair = false;
    retval = build(creep);
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
      target = findFixablesForCreep(creep, target);
    }

    if (target && target.hits >= target.hitsMax) {
      target = null;
    }

    if (target) {
      creep.memory.lastRepairableStructId = target.id;
      if (creep.pos.inRangeTo(target, 3)) {
        checkIfBlockingSource(creep, 1);

        retval = creep.repair(target);
        creep.memory.path = null;

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
    } else {
      creep.memory.build = true;
      creep.memory.repair = false;
      retval = build(creep);
      creep.say("b");
    }
  } else {
    creep.memory.build = true;
    creep.memory.repair = false;
    retval = build(creep);
    creep.say("b");
  }

  return retval;
}

roleRepairer = profiler.registerFN(roleRepairer, "roleRepairer");
module.exports = roleRepairer;

