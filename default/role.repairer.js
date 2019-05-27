const getEnergy = require("./action.getEnergy");

var roleRepairer = {
  /** @param {Creep} creep **/
  run: function(creep) {
    let repair = creep.memory.repair;

    if (!repair && creep.carry.energy == creep.carryCapacity) {
      creep.memory.repair = true;
      creep.memory.getEnergy = false;
      creep.say("ð¨ð½âð­");
    } else if (!repair) {
      creep.say("ð");
      creep.memory.getEnergy = true;
      getEnergy(creep);
      return;
    }

    if (repair) {
      let struct;
      let target;
      if (creep.memory.r) {
        target = creep.memory.r;
      }

      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => {
          if (
            (structure.structureType == STRUCTURE_ROAD ||
              structure.structureType == STRUCTURE_CONTAINER) &&
            Game.flags.Flag1.pos.inRangeTo(structure.pos, 9)
          ) {
            return structure.hits < structure.hitsMax;
          }
        }
      });

      let mostRepairNeeded;
      if (!target) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: structure => {
            if (!mostRepairNeeded) {
              mostRepairNeeded = structure;
            } else {
              highestRepair = mostRepairNeeded.hitsMax - mostRepairNeeded.hits;
              structRepair = structure.hitsMax - structure.hits;

              if (highestRepair < structRepair) {
                Memory.towerRepairTarget = mostRepairNeeded;
                mostRepairNeeded = structure;
              }
            }
            return structure.hits <= structure.hitsMax / 2;
          }
        });

        if (target &&
          mostRepairNeeded.hitsMax - mostRepairNeeded.hits >
          target.hitsMax - target.hits
        ) {
          target = mostRepairNeeded;
        }
      }

      if (target) {
        if (creep.pos.inRangeTo(target, 3)) {
          let retval = creep.repair(target);

          if (retval == OK) {
            creep.say("ð¨ð½âð­");
          } else if (retval == ERR_NOT_ENOUGH_ENERGY) {
            creep.memory.repair = false;
            getEnergy(creep);
            creep.say("ð¨ð½âð­.En");
          } else {
            creep.say("ð¨ð½âð­.err");
          }
        } else {
          retval = creep.moveTo(target, {
            reusePath: 20,
            ignoreCreeps: false,
            maxRooms: 1,
            maxOps: 3000,
            range: 3,
            swampCost: 10,
            visualizePathStyle: { stroke: "#ff00ff" }
          });
          creep.memory.r = target.pos;
          if (creep.fatigue > 0) {
            creep.say("ðð»." + creep.fatigue);
          } else if (retval == ERR_INVALID_TARGET){
            creep.say("ðð»." +"inval");
            target = null;
          }else {
            creep.say("ð¨ð½âð­" + target.pos.x + "," + target.pos.y);
          }
        }
      } else if (creep.carry < creep.carryCapacity / 2) {
        
        creep.memory.repair = false;
        creep.memory.getEnergy = true;
        getEnergy(creep);
      } else {
        console.log("repair target is null");
      }
    }
  }
};

module.exports = roleRepairer;
