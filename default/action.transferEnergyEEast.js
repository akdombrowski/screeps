const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const traneRm = require("./action.transferEnergyeRm");
const transEnTower = require("./action.transEnTower");

function tran(creep, flag, dest) {
  let target;
  let rm = creep.room;
  let name = creep.name;
  let direction = creep.memory.direction;
  let sourceDir = creep.memory.sourceDir;
  let s1 = Memory.s1;
  let tower1 = Game.getObjectById(Memory.tower1Id);
  let tower2 = Game.getObjectById(Memory.tower2Id);
  let tower3 = Game.getObjectById(Memory.tower3Id);
  let ermtower1 = Game.getObjectById(Memory.ermtower1Id);
  let towers = [tower1, tower2, tower3, ermtower1];
  let enAvail = rm.energyAvailable;

  if (creep.memory.role === "h" || creep.memory.role === "harvester") {
    if (creep.room.name === "E37N31") {
      target = Game.getObjectById("5d356b280382bc5e2a8ad9f8");
    } else if (creep.memory.dest) {
      target = Game.getObjectById(creep.memory.dest);
    } else if (creep.memory.flag) {
      target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
    }
  }

  if (target && target.energy >= target.energyCapacity) {
    target = null;
  }

  if (
    target &&
    target.structureType === STRUCTURE_TOWER &&
    rm &&
    rm.energyAvailable &&
    rm.energyAvailable <= 300
  ) {
    target = null;
  }

  if (
    creep.memory.direction === "south" &&
    !target &&
    Game.spawns.spawn2.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  ) {
    target = Game.spawns.spawn2;
  }

  if (
    (creep.memory.direction === "south" || creep.memory.direction === "east") &&
    enAvail > 300
  ) {
    target = towers[0];
    target = _.find(towers, tower => {
      // tower doesn't exist or doesn't have an energy component
      if (!tower) {
        return false;
      }

      // tower has less than 300 energy units
      if (tower.energy < 900) {
        return tower;
      }

      // current target tower has more energy than this tower, switch to this tower
      if (tower.energy < target.energy) {
        return tower;
      }
    });
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        let type = structure.structureType;
        if (
          (type === STRUCTURE_EXTENSION &&
            structure.energy < structure.energyCapacity) ||
          (structure.structureType === STRUCTURE_SPAWN &&
            structure.name === "spawn2" &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        ) {
          extensionNeedsEnergy = true;
          return true;
        } else if (
          type === STRUCTURE_SPAWN &&
          structure.energy < structure.energyCapacity
        ) {
          return true;
        }
      },
    });
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        if (
          structure.structureType == STRUCTURE_STORAGE ||
          structure.structureType == STRUCTURE_CONTAINER
        ) {
          return _.sum(structure.store) < structure.storeCapacity;
        }
      },
    });
  }

  if (target && creep.pos.isNearTo(target.pos)) {
    creep.memory.path = null;
    retval = creep.transfer(target, RESOURCE_ENERGY);
    if (retval == OK) {
      creep.say("t");
      creep.memory.dest = target.id;
    }
  } else if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
  } else if (target) {
    creep.say("m." + target.pos.x + "," + target.pos.y);

    retval = smartMove(creep, target, 1);

    if (retval !== OK) {
      creep.memory.path = null;
      creep.memory.dest = null;
      creep.say("m.err." + retval);
    } else if (retval === OK) {
      creep.memory.dest = target.id;
      creep.say("m");
    }
  } else {
    creep.memory.dest = null;
    creep.memory.path = null;
    creep.say("t.err");
  }

  if (_.sum(creep.carry) == 0) {
    creep.memory.path = null;
    creep.memory.transfer = false;
  }

  if (retval) {
    return retval;
  }
}

module.exports = tran;
