function tran(creep, flag, dest) {
  let target;
  if (creep.memory.role == "h") {
    if (creep.room.name == "E35N32") {
      if (
        creep.pos == Game.flags.northEntrance1 ||
        creep.pos.isNearTo(Game.flags.northEntrance1)
      ) {
        creep.move(BOTTOM);
      } else {
        creep.moveTo(Game.flags.northEntrance1);
      }
      return;
    }
  } else if (creep.memory.dest) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.dest).pop();
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
  }

  if (target && target.energy >= target.energyCapacity) {
    target = null;
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        if (
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_EXTENSION
        ) {
          return structure.energy < structure.energyCapacity;
        } else if (
          structure.structureType == STRUCTURE_STORAGE ||
          structure.structureType == STRUCTURE_CONTAINER
        ) {
          return _.sum(structure.store) < structure.storeCapacity;
        }
      }
    });
  }

  let tower = Game.getObjectById("5ce73685d7640d2de26e09bf");
  if (
    tower.energy < tower.energyCapacity &&
    !creep.memory.goNorth &&
    Object.keys(Game.creeps).length > 10
  ) {
    target = tower;
  }

  if (target && creep.pos.isNearTo(target.pos)) {
    retval = creep.transfer(target, RESOURCE_ENERGY);
    if (retval == OK) {
      creep.say("t");
      creep.memory.dest = target.pos;
    }
  } else if (creep.fatigue > 0) {
    creep.say("🛌🏻." + creep.fatigue);
  } else if (target) {
    creep.say("🚘t." + target.pos.x + "," + target.pos.y);
    let igCrps = true;
    if (creep.pos.getRangeTo(target) <= 5) {
      igCrps = false;
    }

    retval = creep.moveTo(target, {
      ignoreCreeps: igCrps,
      swampCost: 4,
      range: 1,
      visualizePathStyle: { stroke: "#ffffff" }
    });

    if (retval != OK) {
      creep.say("err." + retval);
    } else {
      creep.say("🚘t");
    }

    creep.memory.dest = target.pos;
  } else {
    creep.memory.dest = null;
    creep.say("t.err");
  }

  if (_.sum(creep.carry) == 0) {
    creep.memory.transfer = false;
  }
}

module.exports = tran;
