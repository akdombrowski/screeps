const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const traneRm = require("./action.transferEnergyeRm");

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
      smartMove(creep, Game.flags.northEntrance1, 1);
      creep.say("northEntrance");
      return;
    } else if (creep.room.name == "E36N31") {
      traneRm;
    } else if (creep.room.name == "E34N31") {
      if (
        creep.pos.isEqualTo(Game.flags.westEntrance1.pos) ||
        creep.pos.isNearTo(Game.flags.westEntrance1)
      ) {
        creep.move(RIGHT);
        creep.move(RIGHT);
        creep.say("RIGHT");
      } else {
        smartMove(creep, Game.flags.westEntrance1, 1);
        creep.say("westEntrance");
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

  let tower = Game.getObjectById(Memory.tower1Id);
  let tower2 = Game.getObjectById(Memory.tower2Id);
  let towers = [tower, tower2];
  
    _.forEach(towers, tor => {
      if (
        tor &&
        tor.energy < tor.energyCapacity &&
        (Object.keys(Game.creeps).length > 15 || tor.energy <= 50)
      ) {
        target = tor;
      }
    });
  

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

    retval = smartMove(creep, target, 1);

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
