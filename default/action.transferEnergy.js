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
  let spawn2 = Game.spawns.spawn2;
  let tower1 = Game.getObjectById(Memory.tower1Id);
  let tower2 = Game.getObjectById(Memory.tower2Id);
  let tower3 = Game.getObjectById(Memory.tower3Id);
  let tower4 = Game.getObjectById(Memory.tower4Id);
  let tower5 = Game.getObjectById(Memory.tower5Id);
  let tower6 = Game.getObjectById(Memory.tower6Id);
  let ermtower1 = Game.getObjectById(Memory.ermtower1Id);
  let towers = [tower1, tower2, tower3, tower4, tower5, tower6];
  let enAvail = rm.energyAvailable;
  let retval = -16;


  if(creep.store.getUsedCapacity(RESOURCE_ENERGY) < 50) {
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
    return retval;
  }

  if (creep.memory.role === "h" || creep.memory.role === "harvester") {
    if (creep.room.name === "E35N32") {
      if (
        creep.pos == Game.flags.northEntrance1 ||
        creep.pos.isNearTo(Game.flags.northEntrance1)
      ) {
        retval = creep.move(BOTTOM);
      } else {
        retval = smartMove(creep, Game.flags.northEntrance1, 0);
      }
      creep.say("northEntrance");
      return retval;
    } else if (creep.room.name === "E36N31") {
      retval = traneRm(creep);
      return retval;
    } else if (creep.room.name === "E34N31") {
      retval = smartMove(creep, tower6, 3);
      return retval;
    } else if (flag) {
      target = flag.pos.lookFor(LOOK_STRUCTURES).pop();
    } else if (creep.memory.dest) {
    } else if (creep.memory.flag) {
      target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
    }
  }

  if (
    target &&
    target.store.getUsedCapacity(RESOURCE_ENERGY) >=
      target.store.getCapacity(RESOURCE_ENERGY)
  ) {
    target = null;
    creep.memory.flag = null;
  }

  if (
    target &&
    target.structureType === STRUCTURE_TOWER &&
    rm &&
    enAvail < 1000
  ) {
    target = null;
    creep.memory.flag = null;
  }

  if (
    !target &&
    (creep.memory.direction === "south" || creep.memory.direction === "east") &&
    enAvail > 1000
  ) {
    target = towers[0];
    target = _.find(towers, tower => {
      // tower doesn't exist or doesn't have an energy component
      if (!tower1) {
        return false;
      }

      if (tower.id === tower6.id) {
        console.log(tower.id);
        return false;
      }
      // current target tower has more energy than this tower, switch to this tower
      if (
        target &&
        tower.store.getFreeCapacity([RESOURCE_ENERGY]) >
          target.store.getFreeCapacity([RESOURCE_ENERGY])
      ) {
        return tower;
      }
      target = tower;
    });
  }

  let extensionNeedsEnergy = false;

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        let type = structure.structureType;

        if (
          ((type === STRUCTURE_EXTENSION &&
            structure != Memory.spawnExts[0] &&
            structure != Memory.spawnExts[1]) ||
            (structure.structureType === STRUCTURE_SPAWN &&
              structure.name === "spawn2")) &&
          structure.store &&
          structure.store.getUsedCapacity(RESOURCE_ENERGY) < structure.store.getCapacity(RESOURCE_ENERGY)
        ) {
          return structure;
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
          return (
            structure.energy < structure.energyCapacity
          );
        }
      },
    });
  }

  if (target && creep.pos.isNearTo(target.pos)) {
    creep.memory.path = null;
    retval = creep.transfer(target, RESOURCE_ENERGY);
    if (retval === OK) {
      creep.say("t");
    }
  } else if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
  } else if (target) {
    retval = smartMove(creep, target, 1);


    if (retval !== OK) {
      creep.memory.path = null;
      creep.say("m.err." + retval);
    } else if (retval === OK) {
      creep.memory.dest = target.id;
      creep.say(target.pos.x + "," + target.pos.y);
    }
  } else {
    creep.memory.path = null;
    creep.say("t.err");
  }

  if (_.sum(creep.carry) <= 0) {
    creep.memory.path = null;
    creep.memory.transfer = false;
  }

  if (retval) {
    return retval;
  }
}

module.exports = tran;
