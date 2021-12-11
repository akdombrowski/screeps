const smartMove = require("./action.smartMove");
const getEnergy = require("./action.getEnergy");
const yucreepin = require("./action.checkForAnotherCreepNearMe");
const { checkIfBlockingSource } = require("./checkIfBlockingSource");

function build(creep) {
  let targetId = creep.memory.lastBuildID;
  let target = targetId ? Game.getObjectById(targetId) : null;
  let building = creep.memory.building || true;
  let retval = -16;

  if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
    building = true;
    creep.memory.building = building;
  } else if (creep.store[RESOURCE_ENERGY] <= 0) {
    return getEnergy(creep);
  }

  if (building && creep.store[RESOURCE_ENERGY] > 0) {
    if (
      !target ||
      !CONSTRUCTION_COST[target.structureType] ||
      target.progress >= target.progressTotal
    ) {
      let extFound = false;
      let t;
      Memory.e59s48sites = Game.rooms.E59S48.find(FIND_CONSTRUCTION_SITES, {
        filter: (site) => {
          let prog = site.progress;
          let progTot = site.progressTotal;
          let progLeft = progTot - prog;
          let type = site.structureType;
          if (progLeft <= 0) {
            return false;
          } else if (type === STRUCTURE_EXTENSION) {
            extFound = true;
            t = site;
            return site;
          } else {
            return site;
          }
        },
      });

      let arr = [];
      _.forEach(Memory.e59s48sites, (site) => {
        return arr.push(Game.getObjectById(site.id));
      });

      if (arr) {
        try {
          target = creep.pos.findClosestByPath(arr, {
            filter: (site) => {
              return site.progress < site.progressTotal;
            },
          });
          // target = creep.pos.findClosestByPath(arr);

          if (target && !target.id) {
            target = null;
            creep.memory.buildTarget = null;
            Memory.e59s48sites = null;
            return retval;
          } else if (t) {
            target = t;
            targetId = target.id;
            if (targetId === null) {
              target = null;
            }
          } else {
            target = t || target;
            targetId = target ? target.id : null;
          }
        } catch (e) {
          Memory.e59s48sites = null;
        }
      }
    }

    if (target) {
      if (creep.pos.inRangeTo(target, 3)) {
        creep.memory.path = null;

        checkIfBlockingSource(creep);

        retval = creep.build(target);
        creep.memory.b = targetId;
        creep.say("b");
      } else if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
      } else {
        retval = smartMove(creep, target, 3, false, null, null, 200, 1);

        // Couldn't move towards construction target
        if (retval === ERR_INVALID_TARGET || retval === ERR_INVALID_TARGET) {
          creep.say("m.inval");
          target = null;
          creep.memory.b = null;
        } else if (retval === OK && target) {
          creep.say("m." + target.pos.x + "," + target.pos.y);
          creep.memory.b = targetId;
        } else {
          creep.say("m." + retval);
          target = null;
          creep.memory.b = null;
        }
      }
    } else {
      // creep.memory.role = "r";
      // creep.memory.working = false;
      creep.say("w.err");
      target = null;
      creep.memory.b = target;
    }
  } else {
    retval = ERR_NOT_ENOUGH_ENERGY;
  }
  return retval;
}

module.exports = build;
