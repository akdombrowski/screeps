const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");

function traneRm(creep, flag, dest) {
  let target;
  let s2 = Game.getObjectById(Memory.s2);
  if (creep.memory.role == "h" || creep.memory.role == "harvester") {
    if (creep.room.name == "E36N31") {
      if (creep.pos.isNearTo(s2)) {
        creep.transfer(s2, RESOURCE_ENERGY);
        creep.say("t");
      } else {
        smartMove(creep, s2, 1);
        creep.say("m.s2");
      }

      return;
    } else if (creep.memory.dest) {
      target = Game.getObjectById(creep.memory.dest);
    } else if (creep.memory.flag) {
      target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
    }

    if (target && target.energy >= target.energyCapacity) {
      target = null;
    }
    let tower = Game.getObjectById(Memory.tower1Id);
    let tower2 = Game.getObjectById(Memory.tower2Id);
    let towers = [tower, tower2];

    _.forEach(towers, tor => {
      if (tor) {
        if (
          (tor.energy < tor.energyCapacity &&
            Object.keys(Game.creeps).length > 10) ||
          tor.energy <= 50
        ) {
          target = tor;
        }
      }
    });
    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => {
          let type = structure.structureType;
          if (
            (type === STRUCTURE_EXTENSION || type === STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity
          ) {
            extensionNeedsEnergy = true;
            return true;
          }
        }
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
        }
      });
    }

    if (target && creep.pos.isNearTo(target.pos)) {
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

      if (retval != OK) {
        creep.say("err." + retval);
      } else {
        creep.say("m");
      }

      creep.memory.dest = target.id;
    } else {
      creep.memory.dest = null;
      creep.say("t.err");
    }

    if (_.sum(creep.carry) == 0) {
      creep.memory.transfer = false;
    }
  }
}

module.exports = traneRm;
