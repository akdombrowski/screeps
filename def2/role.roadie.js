var roleWorker = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false;
      creep.say("🔄 harvest");
    }

    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.say("🚧 working");
    }

    if (creep.memory.working) {
      var targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: structure => {
          if (structure.structureType == STRUCTURE_ROAD) {
            if (creep.build(structure) == ERR_NOT_IN_RANGE) {
              creep.moveTo(structure, {
                visualizePathStyle: { stroke: "#ffffff" }
              });
              creep.say("moving to");
              creep.say(structure.structureType);
              creep.say(
                " at (" + structure.pos.x + "," + structure.pos.y + ")"
              );
            } else {
              creep.build(structure);
              creep.say("building");
            }
          }
        }
      });
    } else if (creep.carry.energy == creep.carryCapacity) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      var closest;
      if (targets.length) {
        for (let t in targets) {
          closest = Math.min(creep.pos.findPath(t));
        }
        if (creep.build(closest) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closest, {
            visualizePathStyle: { stroke: "#ffffff" }
          });
        }
      }
    } else {
      var sources = creep.room.find(FIND_SOURCES);
      var closest;
      for (let t in targets) {
        closest = Math.min(creep.pos.findPath(t));
      }
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
};

module.exports = roleWorker;
