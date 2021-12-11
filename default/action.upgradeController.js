const getEnergy = require("./action.getEnergy.1");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");

function upController(creep, flag) {
  const name = creep.name;

  if (creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
    creep.memory.up = true;
    creep.memory.getEnergy = false;
  } else if (creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.up = false;
    creep.memory.getEnergy = true;
    getEnergy(creep);
    return;
  }

  if (creep.memory.up) {
    creep.memory.getEnergy = false;
  }

  let target;
  if (flag) {
    target = flag;
  } else if (creep.memory.controller) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.controller);
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
  }

  target = Game.getObjectById("59bbc5d22052a716c3cea137");

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (structure) => {
        structure.type == STRUCTURE_CONTROLLER;
      },
    });
    creep.memory.controller = target.pos;
  }

  if (creep.memory.up) {
    if (creep.room.name !== "E59S48") {
      smartMove(
        creep,
        Game.getObjectById("59bbc5d22052a716c3cea137"),
        3,
        true,
        "#290199",
        null,
        10000
      );
    } else if (creep.pos.inRangeTo(target, 3)) {
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
      console.log(name + " " + target);

      retval = smartMove(creep, target, 3, true, "#ffff80", 100, 10000, 1);

      console.log(name + " retval " + retval);

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
