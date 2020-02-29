const smartMove = require("./action.smartMove");

function build(creep, flag, room) {
  let targetId = "5e5a6e2b016b547504000249";
  let target = Game.getObjectById(targetId);
  let nsource = Game.getObjectById("5bbcaefa9099fc012e639e8c");
  let building = true;
  let retval = -16;
  let rm = creep.room;
  let rmName = rm.name;
  let name = creep.name;

  // get to the right room
  if (rmName !== room) {
    return smartMove(creep, flag, 1, false, "#fff000");
  }

  // harvest or build depending on energy level and if still filling up
  if (
    !creep.store[RESOURCE_ENERGY] ||
    creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0 ||
    creep.memory.getEnergy
  ) {
    creep.memory.getEnergy = true;
    target = nsource;

    // Find closest source if sourceEE1Id isn't good.
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    }

    // harvest energy or move to source
    if (creep.pos.isNearTo(target)) {
      retval = creep.harvest(target);
    } else if (creep.fatigue > 0) {
      retval = ERR_TIRED;
      creep.say("f." + creep.fatigue);
    } else {
      retval = smartMove(creep, target, 1);
    }

    // switch off of harvesting when full
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
      creep.memory.getEnergy = false;
    }
  } else {
    // switch to build mode
    creep.memory.build = true;
    creep.memory.getEnergy = false;
    target = Game.getObjectById(targetId);

    // find new construction target if necessary
    if (
      !target ||
      !CONSTRUCTION_COST[target.structureType] ||
      creep.room.lookAt(target).progress >=
        creep.room.lookAt(target).progressTotal
    ) {
      if (!Memory.nsites) {
        Memory.nsites = Game.rooms.E35N32.find(FIND_CONSTRUCTION_SITES, {
          filter: constructionSite => {
            return constructionSite.progress < constructionSite.progressTotal;
          },
        });
      }
      target = creep.pos.findClosestByRange(Memory.nsites);
      targetId = target ? target.id : null;
      creep.memory.targetId = targetId;
      if (targetId) {
        target = Game.getObjectById(targetId);
      } else {
        target = null;
        Memory.nsites = null;
      }
    }

    if (target && creep.pos.inRangeTo(target, 3)) {
      if (
        creep.pos.findInRange(FIND_CREEPS, 1).pop().name !== creep.name &&
        creep.pos.isNearTo(Game.getObjectById(Memory.nsource))
      ) {
        retval = creep.move(LEFT);

        if (retval !== OK) {
          retval = creep.move(TOP_LEFT);
        }

        if (retval !== OK) {
          retval = creep.move(RIGHT);
        }

        if (retval !== OK) {
          retval = creep.move(TOP_RIGHT);
        }

        if (retval !== OK) {
          retval = creep.move(BOTTOM);
        }

        if (retval !== OK) {
          retval = creep.move(BOTTOM_RIGHT);
        }

        creep.say("pass");
      } else {
        retval = creep.build(target);
        creep.memory.b = targetId;
        creep.say("build");
      }
    } else if (target) {
      if (creep.fatigue > 0) {
        creep.say("f" + creep.fatigue);
        return ERR_TIRED;
      }
      retval = smartMove(creep, target, 3, "#ffff0f");
      if (retval !== OK) {
        creep.say("err");
      } else {
        creep.say("m");
      }
    } else {
      creep.say("target?")
    }

    if (creep.carry.energy <= 0) {
      creep.memory.building = false;
      creep.memory.getEnergy = true;
    } else {
      retval = ERR_NOT_ENOUGH_ENERGY;
    }
  }
  return retval;
}

module.exports = build;
