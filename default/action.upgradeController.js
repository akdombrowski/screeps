const getEnergy = require("./action.getEnergy");

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
    target = creep.room
      .lookForAt(LOOK_STRUCTURES, creep.memory.controller)
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
    retval = creep.upgradeController(target);
    if (retval == OK) {
      creep.say("uc");
    } else if (retval == ERR_NOT_IN_RANGE) {
      creep.say("uc" + target.pos.x + "," + target.pos.y);

      let igCrps = false;
      if (creep.pos.getRangeTo(target) <= 10) {
        igCrps = false;
      }

      retval = creep.moveTo(target, {
        ignoreCreeps: igCrps,
        range: 3,
        swampCost: 7,
        visualizePathStyle: { stroke: "#ffff0f" }
      });

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
  } else {
    creep.say("ucGE");
    getEnergy(creep);
  }
}

module.exports = upController;
