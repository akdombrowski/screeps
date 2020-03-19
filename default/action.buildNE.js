const smartMove = require("./action.smartMove");

function build(creep, flag, room) {
  let targetId = "5e60f7da11457a06d70b09a8";
  let target = Game.getObjectById(targetId);
  let building = true;
  let retval = -16;
  let rm = creep.room;
  let rmName = rm.name;
  let name = creep.name;

  if (rmName !== room) {
    return smartMove(creep, flag, 1);
  }

  if (
    !creep.store[RESOURCE_ENERGY] ||
    creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0 ||
    creep.memory.getEnergy
  ) {
    creep.memory.getEnergy = true;
    target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    if (creep.pos.isNearTo(target)) {
      retval = creep.harvest(target);
    } else if (creep.fatigue > 0) {
      retval = ERR_TIRED;
      creep.say("f." + creep.fatigue);
    } else {
      retval = smartMove(creep, target, 1, false, null, 100, 1000, 1);
    }

    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
      creep.memory.getEnergy = false;
    }
  } else {
    creep.memory.build = true;
    creep.memory.getEnergy = false;

    target = Game.getObjectById(targetId);

    if (
      !target ||
      !CONSTRUCTION_COST[target.structureType] ||
      target.progress >= target.progressTotal
    ) {
      let t;
      if (!Memory.e36n32sites || Memory.e36n32sites) {
        Memory.e36n32sites = Game.rooms.E36N32.find(FIND_CONSTRUCTION_SITES, {
          filter: site => {
            let prog = site.progress;
            let progTot = site.progressTotal;
            let progLeft = progTot - prog;
            let type = site.structureType;
            if (prog >= progTot) {
              return false;
            } else if (type === STRUCTURE_EXTENSION) {
              extFound = true;
              t = site;
            }
            return site;
          },
        });
      }

      let arr = [];
      _.forEach(Memory.e36n32sites, site => {
        return arr.push(Game.getObjectById(site.id));
      });

      target = creep.pos.findClosestByRange(arr);
      targetId = target ? target.id : null;
    }

    if (target && creep.pos.inRangeTo(target, 3)) {
      if (
        creep.pos.findInRange(FIND_CREEPS, 1).pop().name !== creep.name &&
        creep.pos.isNearTo(Game.getObjectById(Memory.source1eRm))
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
    } else {
      if (creep.fatigue > 0) {
        creep.say("f" + creep.fatigue);
        return ERR_TIRED;
      }

      retval = smartMove(creep, target, 3, false, null, 100, 1000, 1);

      if (retval !== OK) {
        creep.say("err");
      } else {
        creep.say("m");
      }
    }

    if (creep.carry.energy <= 0) {
      creep.memory.building = false;
      creep.memory.getEnergy = true;
      retval = ERR_NOT_ENOUGH_ENERGY;
    } else {
      retval = -17;
    }
  }

  return retval;
}

module.exports = build;
