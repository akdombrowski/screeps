const getEnergy = require("./action.getEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");

function upController(
  creep,
  controllerFlag,
  targetRoomName,
  exit,
  exitDirection,
  controllerID
) {
  const name = creep.name;
  const targetRoom = Game.rooms[targetRoomName];
  const creepPos = creep.pos;
  const creepRoom = creep.room;
  const creepRoomName = creep.room.name;
  const controller = Game.getObjectById(controllerID);
  let retval = -16;

  if (creepRoomName != targetRoomName) {
    if (creep.pos.isNearTo(exit)) {
      retval = creep.move(exitDirection);
    } else {
      retval = smartMove(creep, exit, 0, true, null, null, null, 1);
    }

    return retval;
  }

  if (
    creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity(RESOURCE_ENERGY)
  ) {
    creep.memory.up = true;
    creep.memory.getEnergy = false;
  } else if (creep.store[RESOURCE_ENERGY] <= 0 || creep.memory.getEnergy) {
    creep.memory.up = false;
    creep.memory.getEnergy = true;
    retval = getEnergy(creep, targetRoomName, targetRoomName, null, Game.flags.northExit, TOP, targetRoomName);
    return retval;
  }

  if (creep.memory.up) {
    creep.memory.getEnergy = false;
  }

  let target;
  if (controllerFlag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, controllerFlag).pop();
  } else if (creep.memory.controllerID) {
    target = creep.room
      .lookForAt(LOOK_STRUCTURES, Game.getObjectById(creep.memory.controllerID))
      .pop();
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (structure) => {
        structure.type == STRUCTURE_CONTROLLER;
      },
    });
    creep.memory.controller = target.pos;
  }

  if (creep.memory.up) {
    if (creep.pos.inRangeTo(target, 3)) {
      retval = creep.upgradeController(target);
      if (retval == OK) {
        creep.say("uc");
      } else if (retval === ERR_NOT_IN_RANGE) {
        creep.say("uc" + target.pos.x + "," + target.pos.y);
      } else if (retval === ERR_NOT_ENOUGH_RESOURCES) {
        creep.say("uc");
        creep.memory.up = false;
        creep.memory.getEnergy = true;
        getEnergy(creep);
        return retval;
      } else {
        creep.memory.controller = null;
        creep.say("uc." + retval);
      }
    } else if (creep.fatigue > 0) {
      creep.say("f." + creep.fatigue);
    } else {
      retval = smartMove(creep, target, 3, true, "#ffff80", 100, 10000, 1);

      if (retval != OK) {
        creep.say("err." + retval);
      }
    }
  } else {
    creep.say("uchH");
    getEnergy(creep);
  }
}

module.exports = upController;
