const getEnergy = require("./action.getEnergy");
const getEnergyEast = require("./action.getEnergyEast");
const smartMove = require("./action.smartMove");

var roleWorker = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (!creep.memory.working) {
      creep.memory.working = false;
    }

    if (
      creep.carry.energy <= 0 ||
      (creep.carry.energy < creep.carryCapacity && !creep.memory.working)
    ) {
      creep.memory.working = false;
      creep.say("h");
      creep.memory.getEnergy = true;
      if (creep.room.name === "E36N31" || creep.room.name === "E36N32") {
        getEnergyEast(creep);
      } else {
        getEnergy(creep);
      }
      return;
    } else if (
      !creep.memory.working &&
      creep.carry.energy >= creep.carryCapacity
    ) {
      creep.memory.working = true;
      creep.memory.getEnergy = false;
    }

    if (creep.memory.working) {
      let retval;
      let targetId = creep.memory.b;
      let target = Game.getObjectById(targetId);
      if (target) {
        if (creep.room.name != target.room.name) {
          creep.memory.b = null;
          targetId = null;
        }
      }

      if (
        !target ||
        !CONSTRUCTION_COST[target.structureType] ||
        target.progress >=
          target.progressTotal
      ) {
        let extFound = false;
        let t;
        target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
          filter: site => {
            let prog = site.progress;
            let progTot = site.progressTotal;
            let progLeft = progTot - prog;
            let type = site.structureType;
            if (prog >= progTot) {
              return false;
            }
            
            
            if (type === STRUCTURE_EXTENSION) {
              extFound = true;
              return site;
            } else {
              t = site;
            }
          }
        });
        target = !target ? t : target; 
        targetId = target ? target.id : null;
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
          if (retval === ERR_INVALID_TARGET) {
            creep.say("m.inval");
            target = null;
            creep.memory.b = null;
          } else if (retval === OK) {
            creep.say("m." + target.pos.x + target.pos.y);
            creep.memory.b = targetId;
          } else {
            creep.say("m.  " + retval);
            target = null;
            creep.memory.b = null;
          }
        }
      } else if (creep.room.name === "E35N32") {
        smartMove(creep, Game.flags.northEntrance1, 1);
        creep.say("w.n");
      } else {
        // creep.memory.role = "r";
        // creep.memory.working = false;
        creep.say("w.err");
        target = null;
        creep.memory.b = target;
      }
    }
  }
};

module.exports = roleWorker;
