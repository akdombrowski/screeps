const getEnergy = require("./action.getEnergy");

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
      creep.say("🔄h");
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
            return (
              constructionSite.progress < constructionSite.progressTotal 
              // &&
              // ter.get(constructionSite.pos.x, constructionSite.pos.y) !=
              //   TERRAIN_MASK_WALL
            );
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
          creep.say("🛌🏻." + creep.fatigue);
        } else {
          retval = creep.moveTo(target, {
            reUsePath: 0,
            range: 3,
            visualizePathStyle: { stroke: "#ffff0f" }
          });

          // Couldn't move towards construction target
          if (retval == ERR_INVALID_TARGET) {
            creep.say("w.inval");
            target = null;
            creep.memory.b = null;
          } else if (retval == OK) {
            creep.say("🚗w." + target.x + target.y);
            creep.memory.b = targetId;
          } else {
            creep.say("w." + retval);
            target = null;
            creep.memory.b = targetId;
          }
        }
      } else if (creep.room.name == "E35N32") {
        creep.moveTo(Game.flags.northEntrance1);
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
