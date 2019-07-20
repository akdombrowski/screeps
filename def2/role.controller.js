var roleController = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.controlling && creep.carry.energy == 0) {
      creep.memory.controlling = false;
      creep.say("🔄 harvest");
    }
    
    if (!creep.memory.controlling && creep.carry.energy == creep.carryCapacity) {
      creep.memory.controlling = true;
      creep.say("🚧 controlling");
    }

    if (creep.memory.controlling) {
      var targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: structure => {
          if(structure.structureType == STRUCTURE_CONTROLLER) {
            if (creep.upgradeController(structure) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure, {
            visualizePathStyle: { stroke: "#ffffff" }
          });
          
            creep.say("moving to");
            creep.say(structure.structureType);
            creep.say(" at (" + structure.pos.x + ","+ structure.pos.y + ")");
        } else {
            creep.upgradeController(structure);
            creep.say("upgrading");
        }
          }
        }
      });
    } else if (creep.carry.energy == creep.carryCapacity) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" }
          });
        }
      }
     } else {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
};

module.exports = roleController;
