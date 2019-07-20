const getEnergy = require("./action.getEnergy");

var roleWorker = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if(!creep.memory.working) {
      creep.memory.working = false;
    }

    if (creep.carry.energy == 0) {
      creep.memory.working = false;
      creep.say("🔄 harvest");
    } else if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.say("🚧 working");
    }

    if (creep.memory.working) {
      let target = creep.memory.b;
      if(!target || creep.room.lookAt(target).progress == creep.room.lookAt(target).progressTotal) {
        target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
      }

      if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: { stroke: "#FFFF00" }
        });
        creep.memory.b=target.pos;
        creep.say("b" + target.pos.x + "," + target.pos.y);
      } else {
        creep.memory.b = target.pos;
        creep.say("b");
      }
    } else {
      getEnergy(creep);
    }
  }
};

module.exports = roleWorker;
