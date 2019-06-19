const getEnergy = require("./action.getEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");

function upController(creep, flag) {
  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.up = true;
  } else if (_.sum(creep.carry) == 0) {
    creep.memory.up = false;
    creep.memory.getEnergy = true;
    getEnergy(creep);
    return;
  }

  let target;
  if (flag) {
    target = flag;
  } else if (creep.memory.controller) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.controller);
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
  }

  target = Game.getObjectById("5bbcaefa9099fc012e639e90");

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: structure => {
        structure.type == STRUCTURE_CONTROLLER;
      }
    });
    creep.memory.controller = target.pos;
  }

  if (creep.memory.up) {
    if (creep.room.name === "E36N32") {
      smartMove(creep, Game.getObjectById("5bbcaf0c9099fc012e63a0be"), 3);
    } else {
      retval = creep.upgradeController(target);
      if (retval == OK) {
        creep.say("uc");
      } else if (retval == ERR_NOT_IN_RANGE) {
        creep.say("uc" + target.pos.x + "," + target.pos.y);

        smartMove(creep, target, 3);

        if (retval == ERR_TIRED) {
          creep.say("f." + creep.fatigue);
        }
      } else if (retval == ERR_NOT_ENOUGH_RESOURCES) {
        creep.say("uc");
        creep.memory.getEnergy = true;
        getEnergy(creep);
      } else {
        creep.memory.controller = null;
        creep.say("uc." + retval);
      }
    }
  } else {
    creep.say("uchH");
    getEnergy(creep);
  }
}

module.exports = upController;
