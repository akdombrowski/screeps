const transferEnergy = require("./action.transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const buildRoad = require("./action.buildRoad");

function vest(creep, flag, path) {
  let retval;

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;
    creep.memory.transfer = true;
    transferEnergy(creep);

    return;
  } else {
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
  }

  creep.memory.sourceId = Memory.source2.id;
  let target = Game.getObjectById(creep.memory.sourceId);
  creep.say("sID");
  if (flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, flag);
    creep.say("flag");
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, creep.memory.flag);
  }
  // else if (creep.memory.sourceId) {
  //   target = Game.getObjectById(creep.memory.sourceId);
  //   creep.say("sID");
  // }

  if (creep.memory.role != "harvester") {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        if (
          (structure.structureType == STRUCTURE_CONTAINER ||
            structure.structureType == STRUCTURE_STORAGE) &&
          _.sum(structure.store) >= creep.carryCapacity
        ) {
          return structure;
        }
      }
    });

    if (target) {
      creep.memory.sourceId = target.id;

      if (creep.pos.isNearTo(target.pos)) {
        retval = creep.withdraw(
          target,
          RESOURCE_ENERGY,
          creep.carryCapacity - _.sum(creep.carry)
        );
        if (retval == OK) {
          creep.say("wd.");
        } else {
          creep.say("wd." + retval);
        }
        return;
      } else {
        creep.say("wd." + target.pos.x + "," + target.pos.y);
        smartMove(creep, target, 1);
        return;
      }
    }
  }

  let dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
    filter: source => {
      if (!Memory.source1.pos.isNearTo(source)) {
        return source;
      }
    }
  });
  if (dropped) {
    target = dropped;
    if (creep.pos.isNearTo(target.pos)) {
      creep.say("pickup");
      creep.pickup(target);
      return;
    } else {
      creep.say("pickup");
      smartMove(creep, target, 1);
      return;
    }
  }

  if (!target || target.energy <= 0) {
    target = creep.pos.findClosestByPath(FIND_SOURCES, {
      filter: source => {
        return source.energy > 0;
      }
    });
  }

  if (target) {
    if (creep.pos.isNearTo(target)) {
      retval = creep.harvest(target);
      if (retval == OK) {
        creep.say("vest");
        creep.memory.sourceId = target.id;
      } else {
        creep.say("vest.err." + retval);
        creep.memory.sourceId = null;
      }
    } else if (creep.fatigue > 0) {
      creep.say("f." + creep.fatigue);
      return;
    } else if (path) {
      creep.say("m." + target.pos.x + "," + target.pos.y);

      if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
        return;
      }

      creep.moveByPath(path);
    } else if (creep.room.name == "E35N31") {
      smartMove(creep, target, 1);
    } else {
      target = null;
      creep.say("sad");
    }
  }
}

module.exports = vest;
