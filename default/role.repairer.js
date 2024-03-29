const getEnergy = require("./getEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./move.smartMove");
const build = require("./build");
const { checkIfBlockingSource } = require("./utilities.checkIfBlockingSource");
const profiler = require("./screeps-profiler");
const { findFixablesForCreep } = require("./find.findFixablesForCreep");
const { pullFromSourceArrays } = require("./getEnergy.pullFromSourceArrays");

function roleRepairer(
  creep,
  targetRoomName,
  exit,
  exitDirection,
  targetBuildRoomName,
  buildExit,
  buildExitDirection
) {
  let mem_repair = creep.memory.repair;
  let retval = -16;
  const lastRepairableStructId = creep.memory.lastRepairableStructId;
  const name = creep.name;
  const creepPos = creep.pos;
  const creepRoom = creep.room;
  const creepRoomName = creep.room.name;
  let mem_direction = creep.memory.direction;
  let mem_getEnergy = creep.memory.getEnergy;
  let target = Game.getObjectById(lastRepairableStructId);

  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
    mem_repair = true;
    creep.memory.build = false;
    creep.memory.repair = mem_repair;
    creep.memory.getEnergy = false;

    pullFromSourceArrays(name);
  } else if (
    !mem_repair &&
    (creep.memory.getEnergy || creep.store[RESOURCE_ENERGY] <= 0)
  ) {
    creep.memory.build = false;
    creep.memory.lastBuildID = null;
    creep.memory.repair = false;
    creep.memory.getEnergy = true;
    creep.say("v");

    if (creep.memory.direction === "home") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        exit,
        exitDirection
      );
    } else if (creep.memory.direction === "north") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        Game.flags.homeToNorth,
        TOP
      );
    } else if (creep.memory.direction === "south") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        Game.flags.homeToSouth,
        BOTTOM
      );
    } else if (creep.memory.direction === "southwest") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        Game.flags.southToSouthwest,
        LEFT
      );
    } else if (creep.memory.direction === "west") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        Game.flags.homeToWest,
        LEFT
      );
    }

    return retval;
  }

  if (creep.memory.build) {
    creep.memory.repair = false;
    creep.memory.getEnergy = false;
    creep.memory.transfer = false;
    mem_repair = false;
    if (targetBuildRoomName) {
      retval = build(creep, targetBuildRoomName, buildExitDirection, buildExit);
    } else {
      retval = build(creep, Memory.homeRoomName, RIGHT, Game.flags.westToHome);
    }
  }

  if (mem_repair) {
    let struct;

    // will be null if lastRepairableStructId is null
    let target = Game.getObjectById(lastRepairableStructId);
    let targetObj;
    let targetType = creep.memory.targetType;

    if (target && target.hits >= target.hitsMax) {
      target = null;
      creep.memory.path = null;
    }

    if (target && target.room && target.room.name != creep.room.name) {
      target = null;
      creep.memory.path = null;
    }

    if (!target) {
      target = findFixablesForCreep(creep, target);
    }

    if (target && target.hits >= target.hitsMax) {
      target = null;
      creep.memory.path = null;
    }

    if (target) {
      creep.memory.lastRepairableStructId = target.id;
      if (creep.pos.inRangeTo(target, 3)) {
        checkIfBlockingSource(creep, 1);

        retval = creep.repair(target);
        creep.memory.path = null;

        if (retval == OK) {
          creep.say("r:" + target.pos.x + "," + target.pos.y);
        } else if (retval == ERR_NOT_ENOUGH_ENERGY) {
          creep.memory.repair = false;
          retval = getEnergy(creep);
          creep.say("r.En:" + retval);
        } else {
          creep.say("err." + retval);
        }
      } else {
        retval = smartMove(creep, target, 1);
        creep.memory.rx = target.pos.x;
        creep.memory.ry = target.pos.y;
        if (creep.fatigue > 0) {
          creep.say(
            "r." +
              creep.fatigue +
              "." +
              target.pos.x +
              "," +
              target.pos.y +
              "😴"
          );
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
      if (targetBuildRoomName) {
        retval = build(
          creep,
          targetBuildRoomName,
          buildExitDirection,
          buildExit
        );
      } else {
        retval = build(
          creep,
          Memory.homeRoomName,
          RIGHT,
          Game.flags.westToHome
        );
      }
    }
  } else if (!creep.memory.getEnergy) {
    creep.memory.build = true;
    creep.memory.repair = false;
    if (targetBuildRoomName) {
      retval = build(creep, targetBuildRoomName, buildExitDirection, buildExit);
    } else {
      retval = build(creep, Memory.homeRoomName, RIGHT, Game.flags.westToHome);
    }
  }

  return retval;
}

roleRepairer = profiler.registerFN(roleRepairer, "roleRepairer");
module.exports = roleRepairer;
