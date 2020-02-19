const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");

function traneRm(creep, flag, dest) {
  let target;
  let s2 = Game.getObjectById(Memory.s2);
  let name = creep.name;
  let retval = -16;

  if (creep.room.name === "E36N31") {
    if (creep.room.energyAvailable < creep.room.energyCapacity) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => {
          let type = structure.structureType;
          if (
            (type === STRUCTURE_EXTENSION || type === STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          ) {
            extensionNeedsEnergy = true;
            return true;
          }
        },
      });
    }

    if (creep.pos.isNearTo(target)) {
      retval = creep.transfer(target, RESOURCE_ENERGY);
      creep.say("t");
    } else {
      retval = smartMove(creep, target, 1);
      creep.say("m");
    }

    return retval;
  } else if (creep.room.name === "E36N32") {
    if (creep.pos.isNearTo(Game.flags.ne_e)) {
      retval = creep.move(BOTTOM);
    } else {
      retval = smartMove(creep, Game.flags.ne_e, 1);
    }

    return retval;
  } else if (creep.room.name === "E34N31") {
    retval = smartMove(
      creep,
      Game.getObjectById("5d1330677594977c6d3f49ad"),
      3
    );
    return retval;
  } else if (creep.room.name === "E35N32") {
    if (creep.pos.y >= 49) {
      retval = creep.move(BOTTOM);
    } else {
      retval = smartMove(creep, Game.flags.northEntrance1, 1);
    }
    return retval;
  } else if (creep.memory.dest) {
    target = Game.getObjectById(creep.memory.dest);
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
  }

  if (target && target.energy >= target.energyCapacity) {
    target = null;
  }

  if (creep.memory.direction === "east") {
    let tower = Game.getObjectById(Memory.tower1Id);
    let tower2 = Game.getObjectById(Memory.tower2Id);
    let tower1 = Game.getObjectById(Memory.ermtowerId);
    let towers = [tower, tower2, tower1];

    _.forEach(towers, tor => {
      if (tor) {
        if (
          (tor.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
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
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          ) {
            extensionNeedsEnergy = true;
            return true;
          }
        },
      });
    }
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        if (
          structure.structureType == STRUCTURE_STORAGE ||
          structure.structureType == STRUCTURE_CONTAINER
        ) {
          return structure.store.getFreeCapacity(RESOURCE_ENERGY);
        }
      },
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

module.exports = traneRm;
