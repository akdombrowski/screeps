const { droppedDuty } = require("./action.droppedDuty");

const transferEnergy = require("./action.transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const buildRoad = require("./action.buildRoad");

function vest(creep, sourceRmTargeted, taskRm, flag, path) {
  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;
    return;
  } else {
    creep.memory.getEnergy = true;
  }

  let retval = -16;
  let target;
  let name = creep.name;
  let rmName = creep.rm.name;
  let rm = creep.rm;
  let lastSourceId = creep.memory.lastSourceId;
  let numCrps = Object.keys(crps).length;

  const targetedrm = Game.rooms[sourceRmTargeted];

  if (targetedrm != creep.rm.name) {
    target = targetedrm.find(FIND_SOURCES_ACTIVE, {
      filter: (source) => {
        if (source.pos.findInRange(FIND_CREEPS, 2).length <= 4) {
          return source;
        }
      },
    });

    smartMove(creep, target, 10);
  }

  // Do I need to pick up some dropped energy somewhere?
  retval = droppedDuty(creep);
  if (retval === OK) {
    return retval;
  }

  // See if there's a particular target from a previous trip
  // or one that's been specified.
  if (flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, flag);
    creep.say("flag");
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, creep.memory.flag);
  } else if (lastSourceId) {
    target = Game.getObjectById(lastSourceId);
    creep.say("sID");
  }

  // If I don't have a target yet or the target has no energy look for a \
  // new source
  if (!target || target.energy <= 0) {
    target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
      filter: (structure) => {
        if (structure.pos.findInRange(FIND_CREEPS, 2).length <= 4) {
          return structure;
        }
      },
    });
  }

  // If i don't have a target yet. Check containers and storage units
  //  for energy.
  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        if (
          (structure.structureType == STRUCTURE_CONTAINER ||
            structure.structureType == STRUCTURE_STORAGE) &&
          _.sum(structure.store) >= creep.carryCapacity &&
          structure.pos.findInRange(FIND_CREEPS, 2).length <= 4
        ) {
          return structure;
        }
      },
    });
  }

  // If I have a target, go harvest it.
  if (target) {
    // I'm right next to the target. Harvest.
    if (creep.pos.isNearTo(target)) {
      retval = creep.harvest(target);
      if (retval === OK) {
        creep.say("v");
        creep.memory.sourceId = target.id;
      } else {
        creep.say("v." + retval);
        creep.memory.lastSourceId = null;
      }
    } else if (creep.fatigue > 0) {
      // Still tired
      creep.say("f." + creep.fatigue);
      return;
    } else if (path) {
      // There's already a found path I can take
      retval = creep.moveByPath(path);
      if (retval === OK) {
        creep.say("m." + target.pos.x + "," + target.pos.y);
      } else {
        creep.say("mp." + retval);
      }
    } else {
      retval = smartMove(creep, target, 1);
      creep.say("m." + target.pos.x + "," + target.pos.y);
    }
  } else {
    // Something went wrong;
    target = null;
    creep.memory.lastSourceId = target;
    creep.say("sad");
  }

  return retval;
}

module.exports = vest;
