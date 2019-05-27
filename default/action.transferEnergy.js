function tran(creep, flag, dest) {
  let target;
  if (creep.memory.role == "h" || creep.memory.role == "harvester") {
    if (creep.room.name == "E35N32") {
      if (
        creep.pos == Game.flags.northEntrance1 ||
        creep.pos.isNearTo(Game.flags.northEntrance1)
      ) {
        creep.move(BOTTOM);
        creep.move(BOTTOM);
      }
      creep.moveTo(Game.flags.northEntrance1, {
        reusePath: 200,
        range: 1,
        visualizePathStyle: { stroke: "#0f52ff" }
      });
      creep.say("northEntrance");
      return;
    } else if (creep.room.name == "E36N31") {
      if (
        creep.pos == Game.flags.eastEntrance1 ||
        creep.pos.isNearTo(Game.flags.eastEntrance1)
      ) {
        creep.move(LEFT);
        creep.move(LEFT);
      }
      creep.moveTo(Game.flags.eastEntrance1, {
        reusePath: 200,
        range: 1,
        visualizePathStyle: { stroke: "#0f52ff" }
      });
      creep.say("eastEntrance");
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
    let spawnNeedsEnergy = false;
    let extensionNeedsEnergy = false;
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        if (
          structure.structureType == STRUCTURE_EXTENSION &&
          structure.energy < structure.energyCapacity
        ) {
          extensionNeedsEnergy = true;
          return true;
        } else if (
          !extensionNeedsEnergy &&
          structure.structureType == STRUCTURE_SPAWN &&
          structure.energy < structure.energyCapacity
        ) {
          spawnNeedsEnergy = true;
          return true;
        } else if (
          !extensionNeedsEnergy &&
          !spawnNeedsEnergy &&
          (structure.structureType == STRUCTURE_STORAGE ||
            structure.structureType == STRUCTURE_CONTAINER)
        ) {
          return _.sum(structure.store) < structure.storeCapacity;
        }
      }
    });
  }

  let tower = Game.getObjectById("5ce73685d7640d2de26e09bf");
  if (
    (tower.energy < tower.energyCapacity &&
      Object.keys(Game.creeps).length > 10) ||
    tower.energy < tower.energyCapacity / 2
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
    creep.say("f." + creep.fatigue);
  } else if (target) {
    creep.say("m." + target.pos.x + "," + target.pos.y);
    let igCrps = true;
    if (creep.pos.getRangeTo(target) <= 5) {
      igCrps = false;
    }

    retval = creep.moveTo(target, {
      reusePath: 200,
      ignoreCreeps: igCrps,
      swampCost: 4,
      range: 1,
      visualizePathStyle: { stroke: "#ffffff" }
    });

    if (retval != OK) {
      creep.say("err." + retval);
    } else {
      creep.say("m");
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
