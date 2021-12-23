const getEnergy = require("./action.getEnergy.1");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./move.smartMove");

function upController(creep, flag, room) {
  let controllerId = "5bbcaf0c9099fc012e63a0b9";
  let retval;
  let rm = room;
  controller = Game.getObjectById(controllerId);
  if (creep.room.name !== room) {
    retval = smartMove(creep, controller, 10, false, null, 10, 1000, 2);
  }

  if (
    rm === creep.room.name &&
    (!creep.store ||
      creep.store[RESOURCE_ENERGY] <= 0 ||
      creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0 ||
      creep.memory.getEnergy)
  ) {
    let target;
    creep.memory.getEnergy = true;
    target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (target) {
      if (creep.pos.inRangeTo(target, 1)) {
        retval = creep.harvest(target);
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
          creep.memory.getEnergy = false;
        }
      } else if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
        retval = ERR_TIRED;
      } else {
        creep.say(target.pos.x + "," + target.pos.y);
        retval = smartMove(creep, target, 1, false, null, 10, 500, 1);
      }
    } else {
      creep.say("sad");
    }
  } else {
    if (creep.pos.inRangeTo(controller, 3)) {
      retval = creep.upgradeController(controller);
      creep.say("up." + retval);
    } else {
      retval = smartMove(creep, controller, 3, false, null, 100, 500, 1);
    }
  }

  return retval;
}

module.exports = upController;
