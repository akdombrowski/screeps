const getEnergy = require("./action.getEnergy");

var roleRepairer = {
  /** @param {Creep} creep **/
  run: function(creep) {
    let repair = creep.memory.repair;
    if(!repair) {
      creep.memory.repair = false;
    }

    if (creep.carry.energy == 0) {
      creep.memory.repair = false;
      creep.say("🔄 harvest");
    } else if (!repair && creep.carry.energy == creep.carryCapacity) {
      creep.memory.repair = true;
      creep.say("🚧 repairing");
    }

    repair = creep.memory.repair;
    if (repair) {
      let target = creep.memory.r;
      if(!target || creep.room.lookAt(target).hits == creep.room.lookAt(target).hitsMax) {
        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          filter: structure => {
            if(structure.structureType == STRUCTURE_ROAD) {
              return structure;
            }
          }
        });
      }

      let retval = creep.repair(target);
      if (retval == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: { stroke: "#000000" }
        });
        creep.memory.r=target.pos;
        creep.say("r" + target.pos.x + "," + target.pos.y);
      } else {
        creep.memory.repair = false;
        creep.say("r" + retval);
      }
    } else {
      getEnergy(creep);
    }
  }
};

module.exports = roleRepairer;
