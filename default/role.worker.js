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
      creep.carry.energy == 0 ||
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
      creep.carry.energy == creep.carryCapacity
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
        creep.room.lookAt(target).progress >=
          creep.room.lookAt(target).progressTotal
      ) {
        let linkFound = false;
        let extFound = false;
        target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
          filter: site => {
            if (site.progress >= site.progressTotal) {
              return false;
            }

            const type = site.structureType;

            if (type === STRUCTURE_LINK) {
              linkFound = true;
            }

            if (!linkFound && type === STRUCTURE_EXTENSION) {
              extFound = true;
              return site;
            } else if (!extFound && !linkFound) {
              return site;
            }
          }
        });
        targetId = target ? target.id : null;
      }

      target = Game.getObjectById(targetId);
      if (target) {
        if (creep.pos.inRangeTo(target, 3)) {
          retval = creep.build(target);
          creep.memory.b = targetId;
          creep.say("b");
        } else if (creep.fatigue > 0) {
          creep.say("f." + creep.fatigue);
        } else {
          smartMove(creep, target, 3);

          // Couldn't move towards construction target
          if (retval == ERR_INVALID_TARGET) {
            creep.say("w.inval");
            target = null;
            creep.memory.b = null;
          } else if (retval == OK) {
            creep.say("w." + target.x + target.y);
            creep.memory.b = targetId;
          } else {
            creep.say("w." + retval);
            target = null;
            creep.memory.b = targetId;
          }
        }
      } else if (creep.room.name == "E35N32") {
        let pathMem = 200;
        let igCreeps = true;
        smartMove(creep, Game.flags.northEntrance1, 1);
        creep.say("w.ne1");
      } else {
        creep.memory.role = "r";
        creep.memory.working = false;
        creep.say("w.err");
        target = null;
        creep.memory.b = target;
      }
    }
  }
};

module.exports = roleWorker;
