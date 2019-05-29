const getEnergy = require("./action.getEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");

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
      getEnergy(creep);
      return;
    } else if (
      !creep.memory.working &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.working = true;
      creep.memory.getEnergy = false;
    }

    if (
      (creep.memory.working || !creep.memory.getEnergy) &&
      creep.room.name == "E35N31"
    ) {
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
        target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
          filter: constructionSite => {
            return constructionSite.progress < constructionSite.progressTotal;
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
          let pathMem = 200;
          let igCreeps = true;
          if (moveAwayFromCreep(creep)) {
            pathMem = 0;
            igCreeps = false;
          }
          retval = creep.moveTo(target, {
            reUsePath: pathMem,
            ignoreCreeps: igCreeps,
            range: 3,
            visualizePathStyle: { stroke: "#ffff0f" }
          });

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
        if (moveAwayFromCreep(creep)) {
          pathMem = 0;
          igCreeps = false;
        }
        creep.moveTo(Game.flags.northEntrance1, {
          reusePath: pathMem,
          ignoreCreeps: igCreeps,
          range: 1,
          visualizePathStyle: { stroke: "#0f52ff" }
        });
        creep.say("w.ne1");
      } else {
        creep.say("w.err");
        target = null;
        creep.memory.b = target;
      }
    }
  }
};

module.exports = roleWorker;
