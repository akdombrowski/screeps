function tran(creep, flag, dest) {
  let target;
  if (creep.memory.dest) {
    target = Game.getObjectById(creep.memory.dest);
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
  }

  if (target && target.energy >= target.energyCapacity) {
    target = null;
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: structure => {
        if (
          structure.structureType == STRUCTURE_CONTAINER ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_STORAGE ||
          structure.structureType == STRUCTURE_EXTENSION
        ) {
          return structure.energy < structure.energyCapacity
        }
      }
    });
    creep.memory.dest = target.id;
  }

  retval = creep.transfer(target, RESOURCE_ENERGY);
  if (retval == OK) {
    creep.say("t");
  } else if (retval == ERR_NOT_IN_RANGE) {
    creep.say("t" + target.pos.x + "," + target.pos.y);
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" }
    });
  } else {
    creep.memory.dest = null;
    creep.say("t" + retval);
  }

  if (_.sum(creep.carry) == 0) {
    creep.memory.transfer = false;
    creep.memory.dest = null;
  }
}

module.exports = tran;
