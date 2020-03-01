const smartMove = require("./action.smartMove");

const yucreepin = require("./action.checkForAnotherCreepNearMe");

function build(creep) {
  let targetId = "5e4da6ddb59f24183dd709cb";
  let target = Game.getObjectById(targetId);
  let building = creep.memory.building || true;
  let s2 = Game.spawns.s2;
  let retval = -16;

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    building = true;
    creep.memory.building = building;
  } else if (_.sum(creep.carry) <= 0) {
  }

  if (building && _.sum(creep.carry) > 0) {
    if (
      !target ||
      !CONSTRUCTION_COST[target.structureType] ||
      target.progress >= target.progressTotal
    ) {
      let extFound = false;
      let t;
      if (!Memory.e35n31sites || Memory.e35n31sites) {
        Memory.e35n31sites = Game.rooms.E35N31.find(FIND_CONSTRUCTION_SITES, {
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
            } else {
              return site;
            }
          },
        });
      }

      let arr = [];
      _.forEach(Memory.e35n31sites, site => {
        return arr.push(Game.getObjectById(site.id));
      });

      if (arr) {
        try {
          target = arr[0];
          // target = creep.pos.findClosestByPath(arr);

          if (target && !target.id) {
            target = null;
            creep.memory.buildTarget = null;
            Memory.e35n31sites = null;
            return retval;
          } else {
            target = t || target;
            targetId = target ? target.id : null;
          }
        } catch (e) {
          Memory.e35n31sites = null;
        }
      }
    }

    if (target) {
      if (creep.pos.inRangeTo(target, 3)) {
        retval = creep.build(target);
        creep.memory.b = targetId;
        creep.say("b");
      } else if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
      } else {
        retval = smartMove(creep, target, 3);
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
    } else if (creep.room.name === "E35N32") {
      retval = smartMove(creep, Game.flags.northEntrance1, 1);
      creep.say("w.n");
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
